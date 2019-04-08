//Settings
const express = require('express');
const Router = express.Router();
const db = require('../config/db.js');
const cors = require('cors');

//Settings
Router.use(cors());

Router.post('/api/profile', async (req, res) => {
  const {phone} = req.body;
  //'
  const myquery = {
    text: 'SELECT telefonocliente, nombrecliente, apellidocliente, emailcliente, tarjetacliente, direccioncliente, imagencliente FROM cliente WHERE telefonocliente=$1',
    values: [phone]
  }
  const travelsInfo = {
    text: 'SELECT * FROM consultarViajesyDistancia($1)',
    values: [phone]
  }
  await db.query(myquery)
    .then(prof => {
      db.query(travelsInfo)
        .then(travels => {
          res.json({'profileInfo':prof.rows[0], 'travelsInfo': travels.rows[0]});
        })
        .catch(err => {

        })
    })
    .catch(err => {

    })
});

Router.post('/api/update-profile', async (req, res) => {
  const {newProfile, phone} = req.body;
  const myquery = {
    text: 'UPDATE cliente SET nombrecliente=$1, apellidocliente=$2, emailcliente=$3, direccioncliente=$4, tarjetacliente=$5 WHERE telefonocliente=$6',
    values: [newProfile.nombrecliente, newProfile.apellidocliente, newProfile.emailcliente, newProfile.direccioncliente, newProfile.tarjetacliente, phone]
  }
  await db.query(myquery)
    .then(dbres => {
      console.log('Profile Updated');
      res.json({msg: 'Profile Updated'});
    })
    .catch(err => {
       console.log();
    })
});

Router.post('/api/profile/favorites', async (req, res) => {
  const {phone} = req.body;
  const myquery = {

    text: 'SELECT id_favorito, titulo, (select ST_AsGeoJSON(coordenada)::json) as geom FROM cliente NATURAL JOIN favorito where telefonocliente = $1 ORDER BY id_favorito',
    values: [phone]
  }
  await db.query(myquery)
    .then(dbres => {
      res.json(dbres.rows);
    })
    .catch(err => {

    })
});

Router.post('/api/profile/new-favorite', async (req, res) => {
  const {f_item, phone} = req.body;
  const myquery = {
    text: 'INSERT INTO favorito (telefonoCliente, titulo, direccion, coordenada) VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))',
    values: [phone, f_item.title, "NoDirection", f_item.coor[0], f_item.coor[1]]
  }
  await db.query(myquery)
    .then(dbres => {
      res.status(200).json('Inserted favorite');
    })
    .catch(err => {
      console.log(err);
    })
});

Router.post('/api/profile/delete-favorite', async (req, res) => {
  const {fav, phone} = req.body;
  const myquery = {
    text: 'DELETE FROM favorito WHERE id_favorito=$1',
    values: [fav]
  }
  await db.query(myquery)
    .then(dbres => {
      res.status(200).json('Deleted favorite');
    })
    .catch(err => {
      console.log(err);
    })
});

Router.post('/api/profile/update-favorite', async (req, res) => {
  const {fav, phone, newTitle} = req.body;
  const myquery = {
    text: 'UPDATE favorito SET titulo=$1 WHERE id_favorito=$2',
    values: [newTitle, fav]
  }
  await db.query(myquery)
    .then(dbres => {
      res.status(200).json('Updated favorite');
    })
    .catch(err => {
      console.log(err);
    })
});

module.exports = Router;
