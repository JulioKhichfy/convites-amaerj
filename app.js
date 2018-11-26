//modularizing configuration and importing modules in config/server.js 
console.log("Iniciando app convites");
var app = require('./config/server');
console.log("Express executado");

var porta = process.env.PORT_APP || 3001
console.log("tentativa de subir o servidor");
console.log("porta: " + porta);

app.listen(porta, function(){
	console.log("Servidor Express ON!!!");
});
console.log("aguardando...");

 
/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node\n');
}).listen(process.env.PORT_APP);
console.log('Server running at :'+process.env.PORT_APP);
*/