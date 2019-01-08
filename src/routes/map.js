const express = require('express');
const Router = express.Router();
const db = require('../config/db2.js');


Router.get('/api/map/info', async (req, res) => {
  const myquery = {
    text: "select id, (select ST_AsGeoJSON(geom)::json) as geom, name, tel from stores"
  }
  await db.query(myquery)
  .then(dbres => {
    console.log('mapdata');
    res.json({mapdata: dbres.rows});
  })
  .catch(err => {
    console.log(err);
  })
})

module.exports = Router;
