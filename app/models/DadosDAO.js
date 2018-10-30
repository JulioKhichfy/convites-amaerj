function DadosDAO(connection){
	this._connection = connection;
}

DadosDAO.prototype.getTable = function(tablename, callback){
	console.log("no model tbn "+ tablename);
	this._connection.query("select * from "+tablename+" where tipo = ? " + " order by id desc ", tablename, callback);
}

DadosDAO.prototype.buscar = function(form, callback){
	
	this._connection.query("select * from "+form["tipo"]+" where tipo like '%"+form["buscanome"]+"%' order by id desc ", callback);
}


DadosDAO.prototype.getTupla = function(id, tablename, callback){
	this._connection.query("select id, tratamento, nome, cargo, email, telefone, cep, endereco, sexo, situacao from "+ tablename +" where id = " + id , callback);
}


DadosDAO.prototype.getTipos = function(callback){
	this._connection.query('SELECT distinct tipo FROM ASSOCIACOES UNION SELECT distinct tipo FROM AUTORIDADES_ESPECIAIS', callback);
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

DadosDAO.prototype.salvar = function(form, callback){
	this._connection.query('insert into '+form["tipo"]+' set ? ', form, callback)
}

DadosDAO.prototype.remover = function(form, callback){
	this._connection.query('delete from '+form["tipo"]+' where id= ? ', form["id"], callback)
}

DadosDAO.prototype.eventos = function(callback){
	this._connection.query('SELECT * FROM EVENTOS', callback);
}

DadosDAO.prototype.salvarevento = function(evento, callback){
	this._connection.query('insert into EVENTOS set ? ', evento, callback);
}

DadosDAO.prototype.alterarevento = function(evento, callback){
	var sql = 'UPDATE eventos SET nome =\''+evento["nome"]+'\', data = \''+evento["data"]+'\',hora=\''+evento["hora"]+'\',endereco=\''+evento["endereco"]+'\' WHERE id = '+evento["id"];
	console.log(">>>> sql ", sql);
	this._connection.query(sql, callback);
}

DadosDAO.prototype.removerevento = function(id, callback){
	this._connection.query('delete from eventos where id= ? ', id, callback)
}

DadosDAO.prototype.buscarevento = function(id, callback){
	this._connection.query('select * from eventos where id= ? ', id, callback);
}

DadosDAO.prototype.selecionar2evento = function(selecionado, callback){
	this._connection.query('insert into selecionaveis set ?', selecionado, callback);
}

DadosDAO.prototype.getSelecionaveisFromTbn = function(selecionado, callback){
	var sql= 'select * from selecionaveis where id_evento='+selecionado["idEvento"]+' and id_pessoa='+selecionado["idPessoa"]+' and tipo_tbn=\''+selecionado["tablename"]+'\'' ;
	console.log("GET SELECIONAVEIS ", sql);
	this._connection.query(sql, callback);
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