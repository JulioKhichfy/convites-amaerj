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

DadosDAO.prototype.update = function(body,callback){
	var tablename = body["tablename"].replace(" ","");
	var id = body["id"];
	var tratamento = body["tratamento"];
	var nome = body["nome"]; 
	var cargo = body["cargo"];
	var email = body["email"];
	var telefone = body["telefone"];
	var cep = body["cep"];
	var endereco = body["endereco"];
	var situacao = body["situacao"];
	var sexo = body["sexo"];
	var sql = 'UPDATE '+tablename+' SET tratamento =\''+tratamento+'\', nome = \''+nome+'\',cargo=\''+cargo+'\',email=\''+email+'\',telefone=\''+telefone+'\',cep=\''+cep+'\',endereco=\''+endereco+'\',situacao=\''+situacao+'\',sexo=\''+sexo+'\' WHERE id = '+id;
	console.log("SQL " + sql);
	this._connection.query(sql,callback);
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