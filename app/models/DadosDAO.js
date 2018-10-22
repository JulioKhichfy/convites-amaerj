function DadosDAO(connection){
	this._connection = connection;
}

DadosDAO.prototype.getTable = function(tablename,tipo, callback){
	this._connection.query("select * from "+tablename+" where tipo = ?", tipo, callback);
}

DadosDAO.prototype.getTupla = function(id, tablename, callback){
	var table = tablename.replace(" ", "");
	table = table.replace("-", "");
	console.log("no model "+ id, " " + table);
	this._connection.query("select id, tratamento, nome, cargo, email, telefone, cep, endereco, sexo, situacao from "+ table +" where id = " + id, callback);
}


DadosDAO.prototype.getTipos = function(callback){
	this._connection.query('SELECT distinct tipo FROM ASSOCIACOES UNION SELECT  distinct tipo FROM AUTORIDADESESPECIAIS', callback);
}

/*NoticiasDAO.prototype.getNoticia = function(id_noticia, callback){
	console.log(id_noticia.id_noticia);
	this._connection.query('select * from noticias where id_noticia = ' + id_noticia.id_noticia, callback);
}

NoticiasDAO.prototype.salvarNoticia = function(noticia, callback){
	this._connection.query('insert into noticias set ? ', noticia, callback)
}

NoticiasDAO.prototype.get5UltimasNoticias = function(callback){
	this._connection.query('select * from noticias order by data_criacao desc limit 5', callback);
}*/

module.exports = function(){
	return DadosDAO;
}