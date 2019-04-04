const express = require('express');
const Router = express.Router();
const db = require('../config/db.js');


Router.post('/api/near-taxi', async (req, res) => {

  const {coordenada} = req.body;
  const myquery = {
    //text: 'SELECT first_name, last_name, phone, ST_Distance(ST_SetSRID(ST_MakePoint($1, $2), 4326), coor) AS dists from drivers ORDER BY dists LIMIT 1',
   // text: 'SELECT * FROM distance_between_point_taxis($1, $2)',
   text: "SELECT telefonoconductor, nombreconductor, apellidoconductor, placa, marca, modelo, coordenada, ST_Distance(ST_SetSRID(ST_MakePoint($1, $2), 4326), coordenada) AS dists from conductor natural join (select * from variante_conduce natural join (select * from taxi natural join infocarro) as foo) as goo where fecha=current_date and estado='disponible' ORDER BY dists LIMIT 1",
   values: coordenada
  }
  await db.query(myquery)
    .then(dbres => {
      //console.log(dbres.rows);
      res.json(dbres);
    })
    .catch(err => {
       console.log(err);
    })
});

module.exports = Router;
