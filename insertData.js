const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Chemin vers votre base de données SQLite
const db = new sqlite3.Database('database.sqlite');

// Lire le fichier input.txt
const inputFile = path.join(__dirname, 'input.txt');
const inputData = fs.readFileSync(inputFile, 'utf-8');

const parseInputData = (data) => {
  const lines = data.split('\n').map(line => line.trim()).filter(line => {
    console.log(`Filtering line: "${line}"`);
    return line.length > 0;
  });
  console.log('Lines:', lines);
  const months = [
    'JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
    'JUILLET', 'AOUT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DECEMBRE'
  ];
  let currentYear = null;
  let currentMonth = null;
  const entries = [];

  const dayTextRegex = /^(\d+)\s*:\s*(.*)$/;

  lines.forEach(line => {
    console.log(`Processing line: "${line}"`);
    if (/^\d{4}$/.test(line)) {
      currentYear = parseInt(line, 10);
      console.log(`Found year: ${currentYear}`);
    } else if (months.includes(line)) {
      currentMonth = months.indexOf(line) + 1;
      console.log(`Found month: ${line} (${currentMonth})`);
    } else {
      const match = line.match(dayTextRegex);
      if (match) {
        const day = parseInt(match[1], 10);
        const text = match[2].trim();
        entries.push({
          year: currentYear,
          month: currentMonth,
          day,
          text
        });
        console.log(`Added entry: ${day} - ${text}`);
      } else {
        console.warn(`Skipping invalid line: "${line}"`);
      }
    }
  });

  console.log('Entries:', entries);
  return entries;
};

const insertValues = (entries) => {
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Diary (id INTEGER PRIMARY KEY, createdDate TEXT, updatedDate TEXT, text TEXT, day INTEGER, month INTEGER, year INTEGER)");

    const stmt = db.prepare("INSERT INTO Diary (createdDate, updatedDate, text, day, month, year) VALUES (datetime('now'), datetime('now'), ?, ?, ?, ?)");
    for (const entry of entries) {
      stmt.run(entry.text, entry.day, entry.month, entry.year);
    }
    stmt.finalize();

    db.each("SELECT id, createdDate, updatedDate, text, day, month, year FROM Diary", (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.id + ": " + row.createdDate + " - " + row.updatedDate + " - " + row.text + " - " + row.day + "/" + row.month + "/" + row.year);
    });
  });

  db.close();
};

const entries = parseInputData(inputData);
insertValues(entries);
