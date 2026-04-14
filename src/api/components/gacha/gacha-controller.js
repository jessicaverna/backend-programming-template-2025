const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function pull(request, response, next) {
  try {
    const { userId, userName } = request.body;

    if (!userId || !userName) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'userId dan userName wajib diisi'
      );
    }

    const result = await gachaService.pull(userId, userName);

    if (!result.success) {
      throw errorResponder(errorTypes.FORBIDDEN, result.error);
    }

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const { userId } = request.params;

    if (!userId) {
      throw errorResponder(errorTypes.VALIDATION, 'userId wajib diisi');
    }

    const history = await gachaService.getHistory(userId);

    return response.status(200).json({
      userId,
      totalPulls: history.length,
      history: history.map((h) => ({
        prize: h.prize || 'Tidak ada hadiah',
        pulledAt: h.pulledAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

async function getPrizeList(request, response, next) {
  try {
    const prizes = await gachaService.getPrizeList();

    return response.status(200).json({
      prizes,
    });
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinners();

    return response.status(200).json({
      winners,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  pull,
  getHistory,
  getPrizeList,
  getWinners,
};
