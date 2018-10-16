function DadosDAO(connection){
	this._connection = connection;
}

DadosDAO.prototype.getAssociacoes = function(tipos, callback){
	console.log(">>>> tipos " + tipos);
	var tableName = tipos.replace(' ', '');
	console.log(">>>> tableName " + tableName);
	this._connection.query("select * from "+tableName+" where tipo = ?", tipos, callback);
}

DadosDAO.prototype.getAssociacao = function(id, callback){
	this._connection.query('select * from ASSOCIACOES where id= ' + id.id, callback);
}

DadosDAO.prototype.getTipos = function(callback){
	this._connection.query('select distinct tipo from associacoes union select distinct tipo from autoridadesespeciais', callback);
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