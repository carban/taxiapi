const express = require('express');
const Router = express.Router();
const db = require('../config/db.js');


Router.get('/api/map/info', async (req, res) => {
  const myquery = {
    text: "select driver_serial, first_name, last_name, phone, (select ST_AsGeoJSON(coor)::json) as geom from drivers"
  }
  await db.query(myquery)
  .then(dbres => {
    console.log('Drivers consulted');
    res.json({mapdata: dbres.rows});
  })
  .catch(err => {
    console.log(err);
  })
})

module.exports = Router;
