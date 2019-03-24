//Settings
const express = require('express');
const Router = express.Router();
const db = require('../config/db.js');
const cors = require('cors');

//Settings
Router.use(cors());

Router.post('/api/profile', async (req, res) => {
  const {phone} = req.body;
  const myquery = {
    text: 'SELECT first_name, last_name, phone, email, credit_card, image FROM client WHERE phone=$1',
    values: [phone]
  }
  await db.query(myquery)
    .then(dbres => {
      res.json(dbres.rows[0]);
    })
    .catch(err => {

    })
});

Router.post('/api/update-profile', async (req, res) => {
  const {newProfile, phone} = req.body;
  const myquery = {
    text: 'UPDATE client SET first_name=$1, last_name=$2, email=$3, credit_card=$4 WHERE phone=$5',
    values: [newProfile.first_name, newProfile.last_name, newProfile.email, newProfile.credit_card, phone]
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

    text: 'SELECT favid, title, (select ST_AsGeoJSON(coor)::json) as geom FROM client NATURAL JOIN favorites where phone = $1',
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
    text: 'INSERT INTO favorites (phone, title, coor) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))',
    values: [phone, f_item.title, f_item.coor[0], f_item.coor[1]]
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
    text: 'DELETE FROM favorites WHERE favid=$1',
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
    text: 'UPDATE favorites SET title=$1 WHERE favid=$2',
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
