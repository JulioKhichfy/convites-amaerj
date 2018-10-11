var mysql = require('mysql');

var connMySQL = function(){
	return mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root',
		database : 'premiopatrici'
	});
}

module.exports = function () {
	return connMySQL;
}