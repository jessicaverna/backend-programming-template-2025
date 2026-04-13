module.exports = (db) =>
  db.model(
    'GachaPulls',
    db.Schema(
      {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        prize: { type: String, default: null },
        pulledAt: { type: Date, default: Date.now },
      },
      { timestamps: true }
    )
  );
