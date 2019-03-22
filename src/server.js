//Requires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//Settings
const app = express();
app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));

//Middlewares

//Routes
app.use(require('./routes/index.js'));
app.use(require('./routes/map.js'));
app.use(require('./routes/profile.js'));
app.use(require('./routes/service.js'));

//global variables

//static files

//listening
app.listen(app.get('port'), function(){
  console.log("Server on port", app.get('port'));
})
