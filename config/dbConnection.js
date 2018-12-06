var mysql = require('mysql');

var connMySQL = function(){
	return mysql.createConnection({
		host : 'localhost',
		//host : 'mysql.premio-patricia-acioli.kinghost.net',
		user : 'root',
		multipleStatements:true,
		//user : 'premiopatrici',
		password : 'root',
		//password : 'kkjj00kkjj00',
		database : 'amaerj'
	});
}

module.exports = function () {
	return connMySQL;
}