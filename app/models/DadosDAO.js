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
	console.log("no dao getTupla ", id, tablename);
	this._connection.query("select id, tratamento, nome, cargo, email, telefone, cep, endereco, sexo, situacao from "+ tablename +" where id = " + id , callback);
}

DadosDAO.prototype.getSelecionaveis = function(id, tablename, idselecionado, callback){
	console.log("no dao getSelecionaveis ", id, tablename, idselecionado);
	var sql = "select * from SELECIONADOS_EVENTOS where idevento = "+id+" and tablename like "+tablename+" and idselecionado = "+idselecionado ;
	console.log("no dao getSelecionaveis sql", sql);
	this._connection.query(sql , callback);
}

DadosDAO.prototype.getConvidados = function(ids, tablename, callback){
	this._connection.query("select id, tratamento, nome, cargo, email, telefone, cep, endereco, sexo, situacao from "+ tablename +" where id in ?",id , callback);
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

DadosDAO.prototype.remover = function(id, tablename, callback){
	this._connection.query('delete from '+tablename+' where id='+id, callback)
}

DadosDAO.prototype.eventos = function(callback){
	this._connection.query('SELECT * FROM EVENTOS', callback);
}

DadosDAO.prototype.salvarevento = function(evento, callback){
	this._connection.query('insert into EVENTOS set ? ', evento, callback);
}

DadosDAO.prototype.alterarevento = function(evento, callback){
	var sql = 'UPDATE eventos SET nome =\''+evento["nome"]+'\', data = \''+evento["data"]+'\',hora=\''+evento["hora"]+'\',endereco=\''+evento["endereco"]+'\' WHERE id = '+evento["id"];
	this._connection.query(sql, callback);
}

DadosDAO.prototype.removerevento = function(id, callback){
	this._connection.query('delete from eventos where id= ? ', id, callback)
}

DadosDAO.prototype.buscarevento = function(id, callback){
	
	this._connection.query("SELECT * FROM EVENTOS WHERE id="+id, callback);
}

DadosDAO.prototype.criarlistaconvidados2evento = function(linhas, callback){

	console.log("linhas" + linhas);
	this._connection.query('insert into SELECIONADOS_EVENTOS (idselecionado,idevento,tablename,enviado,confirmado) values '+linhas, callback);
}

DadosDAO.prototype.getlistaconvidados2evento = function(id, callback){

	this._connection.query("SELECT * FROM SELECIONADOS_EVENTOS WHERE idevento = ?",id, callback);
}

DadosDAO.prototype.getTodosSelecionadosEvento = function(map, callback){

	console.log("no DAO ", map);
	//this._connection.query("SELECT * FROM SELECIONADOS_EVENTOS WHERE idevento = ?",id, callback);
}




module.exports = function(){
	return DadosDAO;
}


