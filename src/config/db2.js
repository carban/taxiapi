const { Pool, Client } = require('pg');
const connectionString = 'postgresql://postgres:lordpostgres123@localhost:5432/gis';

const pool = new Pool({
  connectionString: connectionString,
  max: 20
})

console.log("Connected to db2");

module.exports = pool;
