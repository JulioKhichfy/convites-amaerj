var express = require('express');
var fileUpload = require('express-fileupload');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(fileUpload());


app.use('/images', express.static('./app/public/images'));
app.use('/css', express.static('./app/public/css'));
app.use('/js', express.static('./app/public/js'));
app.use('/js' , express.static('./node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js' , express.static('./node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static('./node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static('./node_modules/@fortawesome/fontawesome-free/css'));
app.use('/js', express.static('./node_modules/@fortawesome/fontawesome-free/js'));
app.use('/svgs', express.static('./node_modules/@fortawesome/fontawesome-free/svgs'));
app.use('/webfonts', express.static('./node_modules/@fortawesome/fontawesome-free/webfonts'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

consign()
	.include('app/routes')
	.then('config/dbConnection.js')
	.then('app/models')
	.then('app/controllers')
	.into(app);

module.exports = app;