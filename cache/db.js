import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("little-lemon-app.db");

db.execSync(`
  PRAGMA journal_mode = WAL;
  
  CREATE TABLE IF NOT EXISTS profile_details (
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NULL,
    orderStatus BOOLEAN NOT NULL DEFAULT FALSE,
    passwordChanges BOOLEAN NOT NULL DEFAULT FALSE,
    specialOffers BOOLEAN NOT NULL DEFAULT FALSE,
    newsletter BOOLEAN NOT NULL DEFAULT FALSE
  )`);

db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);

export default db;
