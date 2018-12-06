function DadosDAO(connection){
	this._connection = connection;
}


DadosDAO.prototype.createTablesFromExcel = function(tablename, callback){
	
	var sql="";
	console.log("tablenames", tablename);
	for(var i = 0 ; i < tablename.length ; i ++){
		console.log("tablename", tablename[i]);
		sql+=" DROP TABLE IF EXISTS `"+tablename[i]+"`;"+
			" CREATE TABLE `"+tablename[i]+"`"+
			"(`id` int(10) NOT NULL AUTO_INCREMENT,"+
				"`tratamento` varchar(100) NULL,"+
				"`nome` varchar(150) NULL,"+
				"`cargo` varchar(100) NULL,"+
				"`telefone` varchar(50) NULL,"+
				"`email` varchar(100) NULL,"+
				"`cep` varchar(30) NULL,"+
				"`endereco` varchar(500) NULL,"+
				"`sexo` varchar(10) NULL,"+
				"`situacao` varchar(100) NULL,"+
				"`tipo` varchar(255) NULL,"+
				" PRIMARY KEY (`id`));";
	}
	console.log("sql", sql);
	this._connection.query(sql, callback);
}
DadosDAO.prototype.values_to_insert = function(tbn,pessoas,callback){
	return pessoas;

	//this._connection.query('insert into '+tbn+' set ? ', pessoas, callback)
	//this._connection.query("select * from "+tablename+" where tipo = ? " + " order by id desc ", tablename, callback);
}


DadosDAO.prototype.getTable = function(tablename, callback){
	this._connection.query("select * from "+tablename+" where tipo = ? " + " order by id desc ", tablename, callback);
}

DadosDAO.prototype.buscar = function(form, callback){
	this._connection.query("select * from "+form["tipo"]+" where tipo like '%"+form["buscanome"]+"%' order by id desc ", callback);
}


DadosDAO.prototype.getTupla = function(id, tablename, callback){
	this._connection.query("select id, tratamento, nome, cargo, email, telefone, cep, endereco, sexo, situacao from "+ tablename +" where id = " + id , callback);
}

DadosDAO.prototype.getSelecionaveis = function(id, tablename, idselecionado, callback){
	var sql = "select * from SELECIONADOS_EVENTOS where idevento = "+id+" and tablename like "+tablename+" and idselecionado = "+idselecionado ;
	this._connection.query(sql , callback);
}

DadosDAO.prototype.getConvidados = function(ids, tablename, callback){
	this._connection.query("select id, tratamento, nome, cargo, email, telefone, cep, endereco, sexo, situacao from "+ tablename +" where id in ?",id , callback);
}


DadosDAO.prototype.getTipos = function(callback){
	var sql = "select TABLE_NAME from information_schema.tables WHERE TABLE_SCHEMA = 'amaerj' and TABLE_NAME not in('DOCUMENTOS','EVENTOS','SELECIONADOS_EVENTOS')";
	//this._connection.query('SELECT distinct tipo FROM ASSOCIACOES UNION SELECT distinct tipo FROM AUTORIDADES_ESPECIAIS', callback);
	this._connection.query(sql, callback);
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
	this._connection.query('delete from '+tablename+' where id='+id, callback);

}

DadosDAO.prototype.eventos = function(callback){
	
	this._connection.query('SELECT id, nome, data, hora, endereco FROM EVENTOS ORDER BY DATE(data) ASC ',callback);
}

DadosDAO.prototype.salvarevento = function(evento, callback){
	
	this._connection.query('insert into EVENTOS set ? ', evento, callback);
}


DadosDAO.prototype.salvarObservacaoDetalhesEvento = function(eventoId, obs, callback){
	var sql = 'UPDATE EVENTOS SET observacao =\''+obs+'\'  WHERE id = '+eventoId;
	this._connection.query(sql, callback);
}

DadosDAO.prototype.alterarevento = function(evento, callback){
	var sql = 'UPDATE EVENTOS SET nome =\''+evento["nome"]+'\', data = \''+evento["data"]+'\',hora=\''+evento["hora"]+'\',endereco=\''+evento["endereco"]+'\' WHERE id = '+evento["id"];
	this._connection.query(sql, callback);
}

DadosDAO.prototype.removerevento = function(id, callback){
	this._connection.query('delete from EVENTOS where id= ? ', id, callback)
}

DadosDAO.prototype.buscarevento = function(id, callback){
	this._connection.query('SELECT * FROM EVENTOS WHERE id='+id, callback);
}

DadosDAO.prototype.criarlistaconvidados2evento = function(linhas, callback){
	var sql = "INSERT INTO SELECIONADOS_EVENTOS (idselecionado,idevento,tablename,enviado,confirmado) values "+linhas;
	console.log("sql",sql);
	this._connection.query(sql, callback);
}

DadosDAO.prototype.getlistaconvidados2evento = function(id, callback){

	this._connection.query("SELECT * FROM SELECIONADOS_EVENTOS WHERE idevento = ?",id, callback);
}

DadosDAO.prototype.getTodosSelecionaveisByEventoId = function(idevento, tablename, callback){
	
	console.log("idevento ", idevento);
	console.log("tablename ", tablename);
	this._connection.query("SELECT idselecionado FROM SELECIONADOS_EVENTOS WHERE idevento ="+idevento+" and tablename like ?",tablename,callback);
}

DadosDAO.prototype.buscarTodosConvidados = function(sql, callback){
	this._connection.query(sql,callback);
}

DadosDAO.prototype.removerConvidado = function(id_pessoa,id_evento, tbn, callback){
	console.log("removerConvidado ");
	var sql = "delete from SELECIONADOS_EVENTOS where idselecionado="+id_pessoa+" and idevento="+id_evento+" and tablename='"+tbn+"'";
	console.log("sql",sql);
	this._connection.query(sql, callback);
	
}
DadosDAO.prototype.saveDocumento = function(nomeoriginal,idevento,nomegerado,caminho,callback){
	var json={"nomeoriginal":nomeoriginal, "idevento":idevento, "nomegerado":nomegerado, "caminho":caminho};
	console.log("json",json);
	this._connection.query("INSERT INTO DOCUMENTOS set ?",json, callback);
}

DadosDAO.prototype.removerDocumento = function(nomeGerado,idEvento,callback){
	var sql="DELETE FROM DOCUMENTOS WHERE idevento ="+idEvento+" AND nomegerado like '"+nomeGerado+"'";
	console.log("sql",sql);
	this._connection.query(sql,callback);
}


//(nomeoriginal,idevento,nomegerado,caminho) values
DadosDAO.prototype.buscardocumentos = function(idevento,callback){
	this._connection.query("SELECT * FROM DOCUMENTOS WHERE idevento = ?",idevento, callback);
}


module.exports = function(){
	return DadosDAO;
}


