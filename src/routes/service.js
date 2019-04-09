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
  const latarifa = {
    text: "SELECT id_tarifa, preciokm from (SELECT (SELECT mitarifa (current_time)) as id_tarifa) as foo NATURAL JOIN lastarifas;"
  }
  db.query(myquery)
    .then(near => {
      var phonedri = near.rows[0].telefonoconductor;
      const prom = {
        text: "select AVG(calificacion) promedio_cal from servicio where telefonoconductor= $1",
        values: [phonedri]
      }
      db.query(prom)
        .then(promcal => {
          db.query(latarifa)
            .then(rateCost => {
              //console.log({'theNear': near.rows, 'theRateCost': rateCost.rows, 'prom': promcal.rows});
              res.json({'theNear': near.rows, 'theRateCost': rateCost.rows, 'prom': promcal.rows});
            })
            .catch(err => {
               console.log(err);
            })
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
       console.log(err);
    })
});

Router.post('/api/service-notification', async (req, res) => {

  const {telefonocliente, telefonoconductor, placa, id_tarifa, distancia, tiempo, precio, calificacion, origen_coor, destino_coor} = req.body;
  //console.log([telefonocliente, telefonoconductor, placa, id_tarifa, distancia, tiempo, precio, calificacion, origen_coor[0], origen_coor[1], destino_coor[0], destino_coor[1]]);
  const myquery = {
    //text: 'SELECT first_name, last_name, phone, ST_Distance(ST_SetSRID(ST_MakePoint($1, $2), 4326), coor) AS dists from drivers ORDER BY dists LIMIT 1',
   // text: 'SELECT * FROM distance_between_point_taxis($1, $2)',
   text: "INSERT INTO servicio (telefonocliente, telefonoconductor, placa, id_tarifa, distancia, fecha, hora, precio, calificacion, origen_coor, destino_coor, s_estado) VALUES ($1, $2, $3, $4, $5, current_date, current_time, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326), ST_SetSRID(ST_MakePoint($10, $11), 4326), 'nueva')",
   values: [telefonocliente, telefonoconductor, placa, id_tarifa, distancia, precio, calificacion, origen_coor[0], origen_coor[1], destino_coor[0], destino_coor[1]]
  }
  db.query(myquery)
    .then(dbres => {
      res.json({msg: "Service Inserted"});
    })
    .catch(err => {
       console.log(err);
    })
});


Router.post('/api/service-calification', async (req, res) => {

  const {phonecli, phonedri, cali} = req.body;
  console.log(phonecli, phonedri, cali.cal);
  const myquery = {
    text: "update servicio set calificacion = $1 where telefonoconductor = $2 and telefonocliente=$3 and id_servicio = (select max(id_servicio) from servicio group by id_servicio order by id_servicio desc limit 1);",
    values: [cali.cal, phonedri, phonecli]
  }
  db.query(myquery)
    .then(dbres => {
      res.json({msg: "calcification successfully"});
    })
    .catch(err => {
       console.log(err);
    })
});

module.exports = Router;
