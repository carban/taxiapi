const express = require('express');
const Router = express.Router();
const db = require('../config/db.js');


Router.get('/api/map/info', async (req, res) => {
  const myquery = {
    text: "select (select ST_AsGeoJSON(coordenada)::json) as geom from conductor natural join (select * from variante_conduce natural join (select * from taxi natural join infocarro) as foo) as goo where fecha=current_date and estado='disponible'"
    //select driver_serial, first_name, last_name, phone, (select ST_AsGeoJSON(coor)::json) as geom from drivers
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
