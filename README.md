# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.

# Endpoint yang Diimplementasikan

- POST /api/gacha/pull
  Endpoint untuk melakukan gacha (maksimal 5 kali dalam 1 hari untuk setiap user, serta memastikan jumlah pemenang tidak melebihi kuota hadiah).
  Body Request: userId dan userName

- GET /api/gacha/history/:userId
  Endpoint untuk melihat histori gacha yang telah dilakukan oleh user beserta hadiah yang dimenangkan (jika ada).
  Parameter: userId → :userId

- GET /api/gacha/prizes
  Endpoint untuk menampilkan daftar hadiah beserta sisa kuota pemenang untuk setiap hadiah.

- GET /api/gacha/winners
  Endpoint untuk menampilkan daftar user yang memenangkan hadiah dengan nama yang disamarkan.
