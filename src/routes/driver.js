const express = require('express');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const cors = require('cors');

Router.post('/api/driver/loginDriver', async (req, res) => {

    const {phone, password} = req.body;

    var errors = [];

    if (phone=='' || password =='') {
      errors.push({text: 'Please write all inputs'});
      res.status(400).json({errors});
    }
    //CHECK IF PHONE EXIST ON DB
    const myquery ={
      // text: 'SELECT password, id_serial FROM client WHERE phone=$1',
      text: 'SELECT password, phone FROM drivers WHERE phone=$1',
      values: [phone]
    }
    await db.query(myquery)
    .then(dbres => {
      if (dbres.rows.length>0) {
        if (password==dbres.rows[0].password) {
          const obj_user = dbres.rows[0];
          console.log(obj_user);
          // const token = jwt.sign({id_serial: obj_user.id_serial}, 'aSuperSecretKey');
          const token = jwt.sign({phone: obj_user.phone}, 'aSuperSecretKey');
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

module.exports = Router;
