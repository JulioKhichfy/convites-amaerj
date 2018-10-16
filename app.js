//modularizing configuration and importing modules in config/server.js 
console.log("app convites");
var app = require('./config/server');


var porta = process.env.PORT_APP || 3001
console.log("porta: " + porta);

console.log("tentativa de subir o servidor");
 
app.listen(porta, function(){
	console.log("Servidor Express ON!!!");
});

 
