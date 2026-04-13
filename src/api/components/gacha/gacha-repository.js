const { GachaPulls, GachaPrizes } = require('../../../models');

async function getTodayPullCount(userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return GachaPulls.countDocuments({
    userId,
    pulledAt: { $gte: startOfDay, $lte: endOfDay },
  });
}

async function createPull(userId, userName, prize) {
  return GachaPulls.create({
    userId,
    userName,
    prize,
    pulledAt: new Date(),
  });
}

async function getHistoryByUserId(userId) {
  return GachaPulls.find({ userId }).sort({ pulledAt: -1 });
}

async function getAllPrizes() {
  return GachaPrizes.find({});
}

async function getPrizeByName(prizeName) {
  return GachaPrizes.findOne({ prizeName });
}

async function incrementPrizeWinner(prizeName) {
  return GachaPrizes.findOneAndUpdate(
    { prizeName, $expr: { $lt: ['$currentWinners', '$maxWinners'] } },
    { $inc: { currentWinners: 1 } },
    { new: true }
  );
}

async function initializePrizes(prizes) {
  const operations = prizes.map((prize) => ({
    updateOne: {
      filter: { prizeName: prize.prizeName },
      update: { $setOnInsert: prize },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await GachaPrizes.bulkWrite(operations);
  }
}

async function getAllWinningPulls() {
  return GachaPulls.find({ prize: { $ne: null } }).sort({ pulledAt: -1 });
}

module.exports = {
  getTodayPullCount,
  createPull,
  getHistoryByUserId,
  getAllPrizes,
  getPrizeByName,
  incrementPrizeWinner,
  initializePrizes,
  getAllWinningPulls,
};
