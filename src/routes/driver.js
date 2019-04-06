const express = require('express');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const cors = require('cors');

Router.post('/api/driver/signup', async (req, res) => {

  const {fname, lname, phone, email, credit_card, direction, password, passConf} = req.body;
  console.log(phone);
  var errors = [];

  if (fname==null || lname==null || phone==null || password==null || passConf==null || email==null || credit_card==null || direction==null) {
    errors.push({text: 'Please write all inputs'});
  }

  if (password!=passConf) {
    errors.push({text: 'Confirm Password'});
  }

  if (errors.length > 0) {
    console.log(errors);
    res.status(406).json({errors});
  }else {
    //CHECK IF PHONE EXIST ON DB/////////////////////////////////////////////////////////
    const myquery ={
      text: 'SELECT telefonoconductor FROM conductor WHERE telefonoconductor=$1',
      values: [phone]
    }
    await db.query(myquery)
    .then(dbres => {
      console.log(dbres.rows);
      if (dbres.rows.length>0) {
        errors.push({text: 'The phone '+dbres.rows[0].phone+' Exists in our DB, try with an other number'});
        res.status(400).json({errors});
      }else{
        const myquery2 ={
          text: 'INSERT INTO conductor (telefonoconductor, nombreconductor, apellidoconductor, emailconductor, tarjetaconductor, direccionconductor, passwordconductor) values($1, $2, $3, $4, $5, $6, $7)',
          values: [phone, fname, lname, email, credit_card, direction, password]
        }
        db.query(myquery2)
        .then(dbres => {
          console.log('REGISTERED');
          res.status(200).json({msg: 'Registered'});
        })
        .catch(error => {
          console.log("Error Processing\n");
          res.status(500).json({msg2:"Error Processing"});
        });
      }
    })
    .catch(error => {
      console.log("Error Processing\n");
      res.status(500).json({msg1:"Error Processing"});
    });
  }
})

Router.post('/api/driver/login', async (req, res) => {

    const {phone, password} = req.body;

    var errors = [];

    if (phone=='' || password =='') {
      errors.push({text: 'Please write all inputs'});
      res.status(400).json({errors});
    }
    console.log(phone);
    //CHECK IF PHONE EXIST ON DB
    const myquery ={
      // text: 'SELECT password, id_serial FROM client WHERE phone=$1',
      text: 'SELECT passwordconductor, telefonoconductor FROM conductor WHERE telefonoconductor=$1',
      values: [phone]
    }
    await db.query(myquery)
    .then(dbres => {
      if (dbres.rows.length>0) {
        if (password==dbres.rows[0].passwordconductor) {
          const obj_user = dbres.rows[0];
          console.log(obj_user);
          // const token = jwt.sign({id_serial: obj_user.id_serial}, 'aSuperSecretKey');
          const token = jwt.sign({phone: obj_user.telefonoconductor}, 'aSuperSecretKey');
          console.log('LOGUEADO');
          res.status(200).json(token);
        }else{
          errors.push({text: 'Incorrect Password'});
          res.status(401).json({errors});
        }
      }else{
        errors.push({text: 'The phone '+phone+' DOESNT Exists in our DB'});
        res.status(403).json({errors});
      }
    })
    .catch(error => {
      console.log(error);
      console.log("Error Processing\n");
      res.status(500).json({msg:"Error Processing"});
    });
    //console.log(errors);
});

Router.post('/api/driver/profile', async (req, res) => {
  const {phone} = req.body;
  const myquery = {
    text: 'SELECT * FROM conductor WHERE telefonoconductor=$1',
    values: [phone]
  }
  await db.query(myquery)
    .then(dbres => {
      res.json(dbres.rows[0]);
    })
    .catch(err => {

    })
});

Router.post('/api/driver/update-profile', async (req, res) => {
  const {newProfile, phone} = req.body;
  const myquery = {
    text: 'UPDATE conductor SET nombreconductor=$1, apellidoconductor=$2, emailconductor=$3, direccionconductor=$4, tarjetaconductor=$5 WHERE telefonoconductor=$6',
    values: [newProfile.first_name, newProfile.last_name, newProfile.email, newProfile.direction, newProfile.credit_card, phone]
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

Router.post('/api/driver/cars', async (req, res) => {
  const {phone} = req.body;
  const myquery = {

    text: 'select placa, marca, modelo, soat, anho from taxiconductor natural join (select * from taxi natural join infocarro) as foo where telefonoconductor=$1;',
    values: [phone]
  }
  await db.query(myquery)
    .then(dbres => {
      res.json(dbres.rows);
    })
    .catch(err => {

    })
});

Router.post('/api/driver/new-car', async (req, res) => {
  const phone = req.body.phone;
  const {plate, brand, model, soat, year} = req.body.carInfo;
  const myquery = {
    text: 'SELECT * FROM insertartaxi($1, $2, $3, $4, $5, $6)',
    values: [phone, plate, brand, model, soat, year]
  }
  await db.query(myquery)
    .then(dbres => {
      res.status(200).json('Inserted favorite');
    })
    .catch(err => {
      console.log(err);
    })
});

Router.post('/api/profile/delete-car', async (req, res) => {
  const {plate, phone} = req.body;
  const myquery = {
    text: 'select * from borrartaxi($1, $2)',
    values: [phone, plate]
  }
  await db.query(myquery)
    .then(dbres => {
      res.status(200).json('Deleted car');
    })
    .catch(err => {
      console.log(err);
    })
});

Router.post('/api/driver/my-services', async (req, res) => {
  const {phone} = req.body;
  //console.log(phone);
  const myquery = {
    text: "select id_servicio, telefonocliente, telefonoconductor, placa, id_tarifa, distancia, precio, calificacion, s_estado, (select ST_AsGeoJSON(origen_coor)::json) as origen_geom, (select ST_AsGeoJSON(destino_coor)::json) as destino_geom from servicio where telefonoconductor=$1 and s_estado='nueva' order by id_servicio desc limit 1",
    values: [phone]
  }
  await db.query(myquery)
    .then(dbres => {
      if (dbres.rows.length == 0) {
        res.json({msg: 'No services'});
      }else{
        res.json(dbres);
      }
    })
    .catch(err => {
       console.log(err);
    })
});

Router.post('/api/driver/ok-service', async (req, res) => {
  const {phone} = req.body;
  //console.log(phone);
  const myquery = {
    text: "update servicio set s_estado='vieja' where telefonoconductor=$1",
    values: [phone]
  }
  await db.query(myquery)
    .then(dbres => {
      res.json({msg: 'Accepted'});
    })
    .catch(err => {
       console.log(err);
    })
});

Router.post('/api/driver/new-position', async (req, res) => {
  const {phone, coordenada, taxi} = req.body;
  console.log(phone, coordenada, taxi);
  const myquery = {
    text: 'select insertarVariante($1, $2, $3, $4)',
    values: [phone, taxi, coordenada[0], coordenada[1]]
  }
  await db.query(myquery)
    .then(dbres => {
      res.json({msg: "New Variant"});
    })
    .catch(err => {
       console.log(err);
    })
});

module.exports = Router;
