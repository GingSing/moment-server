const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbFile = "moment.db";
const dbOptions = { verbose: console.log };
const db = new Database(dbFile, dbOptions);

const migrationDirectory = "./migrations";
const migrationFiles = fs
  .readdirSync(migrationDirectory)
  .filter((file) => file.endsWith(".sql"))
  .sort();

for (const migrationFile of migrationFiles) {
  try {
    const migrationPath = path.join(migrationDirectory, migrationFile);
    const migrationSql = fs.readFileSync(migrationPath, "utf8");

    db.transaction(() => {
      db.exec(migrationSql);
    })();
  } catch (err) {
    console.error(`Error applying migration ${migrationFile}:`, err.message);
  }
}

// Optionally set journal mode if needed
// db.pragma("journal_mode = WAL");

module.exports = db;
