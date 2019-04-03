//Requires
const express = require('express');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('../config/db.js');

//Settings
Router.use(cors());

///////////////////////////////////POST SIGNUP ///////////////////////////////

Router.post('/api/signup', async (req, res) => {

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
      text: 'SELECT telefonocliente FROM cliente WHERE telefonocliente=$1',
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
          text: 'INSERT INTO cliente (telefonocliente, nombrecliente, apellidocliente, emailcliente, tarjetacliente, direccioncliente, passwordcliente) values($1, $2, $3, $4, $5, $6, $7)',
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

///////////////////////////////////POST LOGIN ///////////////////////////////

Router.post('/api/login', async (req, res) => {

  const {phone, password} = req.body;

  var errors = [];

  if (phone=='' || password =='') {
    errors.push({text: 'Please write all inputs'});
    res.status(400).json({errors});
  }
  //CHECK IF PHONE EXIST ON DB
  const myquery ={
    // text: 'SELECT password, id_serial FROM client WHERE phone=$1',
    text: 'SELECT passwordcliente, telefonocliente FROM cliente WHERE telefonocliente=$1',
    values: [phone]
  }
  await db.query(myquery)
  .then(dbres => {
    if (dbres.rows.length>0) {
      if (password==dbres.rows[0].passwordcliente) {
        const obj_user = dbres.rows[0];
        console.log(obj_user);
        // const token = jwt.sign({id_serial: obj_user.id_serial}, 'aSuperSecretKey');
        const token = jwt.sign({phone: obj_user.telefonocliente}, 'aSuperSecretKey');
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
})

//Export object
module.exports = Router;
