const gachaRepository = require('./gacha-repository');

const MAX_PULLS_PER_DAY = 5;

const PRIZE_POOL = [
  { prizeName: 'Emas 10 gram', maxWinners: 1, weight: 1 },
  { prizeName: 'Smartphone X', maxWinners: 5, weight: 5 },
  { prizeName: 'Smartwatch Y', maxWinners: 10, weight: 10 },
  { prizeName: 'Voucher Rp100.000', maxWinners: 100, weight: 50 },
  { prizeName: 'Pulsa Rp50.000', maxWinners: 500, weight: 100 },
];

const NO_PRIZE_WEIGHT = 834;

async function initializePrizes() {
  const prizes = PRIZE_POOL.map((p) => ({
    prizeName: p.prizeName,
    maxWinners: p.maxWinners,
  }));
  await gachaRepository.initializePrizes(prizes);
}

async function determineWinner() {
  const dbPrizes = await Promise.all(
    PRIZE_POOL.map((prize) => gachaRepository.getPrizeByName(prize.prizeName))
  );

  const availablePrizes = [];
  let totalWeight = NO_PRIZE_WEIGHT;

  PRIZE_POOL.forEach((prize, index) => {
    const dbPrize = dbPrizes[index];
    if (dbPrize && dbPrize.currentWinners < dbPrize.maxWinners) {
      availablePrizes.push(prize);
      totalWeight += prize.weight;
    }
  });

  const roll = Math.random() * totalWeight;
  const selectedPrize = availablePrizes.reduce(
    (found, prize, _i, arr) => {
      if (found.selected) return found;
      const next = found.cumulative + prize.weight;
      if (roll < next) {
        arr.splice(1);
        return { selected: prize, cumulative: next };
      }
      return { selected: null, cumulative: next };
    },
    { selected: null, cumulative: 0 }
  ).selected;

  if (selectedPrize) {
    const updated = await gachaRepository.incrementPrizeWinner(
      selectedPrize.prizeName
    );
    if (updated) {
      return selectedPrize.prizeName;
    }
    return null;
  }

  return null;
}

async function pull(userId, userName) {
  const todayCount = await gachaRepository.getTodayPullCount(userId);
  if (todayCount >= MAX_PULLS_PER_DAY) {
    return {
      success: false,
      error: `Anda telah mencapai batas maksimal ${MAX_PULLS_PER_DAY} kali gacha hari ini. Silakan coba lagi besok.`,
    };
  }

  const wonPrize = await determineWinner();

  const pullRecord = await gachaRepository.createPull(
    userId,
    userName,
    wonPrize
  );

  if (wonPrize) {
    return {
      success: true,
      message: `Selamat! Anda memenangkan: ${wonPrize}`,
      prize: wonPrize,
      pullsRemainingToday: MAX_PULLS_PER_DAY - todayCount - 1,
      pull: pullRecord,
    };
  }

  return {
    success: true,
    message: 'Maaf, Anda tidak memenangkan hadiah kali ini. Coba lagi!',
    prize: null,
    pullsRemainingToday: MAX_PULLS_PER_DAY - todayCount - 1,
    pull: pullRecord,
  };
}

async function getHistory(userId) {
  return gachaRepository.getHistoryByUserId(userId);
}

async function getPrizeList() {
  const prizes = await gachaRepository.getAllPrizes();
  return prizes.map((p) => ({
    prizeName: p.prizeName,
    maxWinners: p.maxWinners,
    currentWinners: p.currentWinners,
    remainingQuota: p.maxWinners - p.currentWinners,
  }));
}

function maskName(name) {
  if (!name) return '***';

  return name
    .split('')
    .map((char) => {
      if (char === ' ') return ' ';
      return Math.random() < 0.5 ? '*' : char;
    })
    .join('');
}

async function getWinners() {
  const winningPulls = await gachaRepository.getAllWinningPulls();

  const winnersMap = winningPulls.reduce((acc, entry) => {
    if (!acc[entry.prize]) {
      acc[entry.prize] = [];
    }
    acc[entry.prize].push({
      maskedName: maskName(entry.userName),
      wonAt: entry.pulledAt,
    });
    return acc;
  }, {});

  return winnersMap;
}

module.exports = {
  pull,
  getHistory,
  getPrizeList,
  getWinners,
  initializePrizes,
};
