module.exports = (db) =>
  db.model(
    'GachaPrizes',
    db.Schema(
      {
        prizeName: { type: String, required: true },
        maxWinners: { type: Number, required: true },
        currentWinners: { type: Number, default: 0 },
      },
      { timestamps: true }
    )
  );
