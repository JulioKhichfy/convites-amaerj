function DadosDAO(connection){
	this._connection = connection;
}

DadosDAO.prototype.getAssociacoes = function(tipo, callback){
	console.log(">>>>", tipo.tipo);
	this._connection.query('select * from ASSOCIACOES where tipo = ?', tipo.tipo, callback);
}

DadosDAO.prototype.getAssociacao = function(id, callback){
	this._connection.query('select * from ASSOCIACOES where id= ' + id.id, callback);
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