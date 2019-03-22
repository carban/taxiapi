const express = require('express');
const Router = express.Router();
const db = require('../config/db.js');


Router.post('/api/service', async (req, res) => {

  const {coordenada} = req.body;
  const myquery = {
    text: 'SELECT first_name, last_name, phone, ST_Distance(ST_SetSRID(ST_MakePoint($1, $2), 4326), coor) AS dists from drivers ORDER BY dists LIMIT 1',
    values: coordenada
  }
  await db.query(myquery)
    .then(dbres => {
      res.json(dbres);
    })
    .catch(err => {
       console.log(err);
    })
});

module.exports = Router;
