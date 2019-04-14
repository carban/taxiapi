const { Pool, Client } = require('pg');
const connectionString = 'postgresql://postgres:lordpostgres123@localhost:3030/andresmon';
// const connectionString = 'postgresql://postgres:1234@localhost:5433/andresmon';
const pool = new Pool({
  connectionString: connectionString,
  max: 20
})

console.log("Connected to db");

module.exports = pool;
