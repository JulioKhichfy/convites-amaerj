
module.exports.filtrar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var tipo = req.body['tipos'];
	var tipos;
	dadosModel.getTipos(function(error,result){
		tipos=result;
	});
	var tbnaux = tipo.replace(' ', '');
	var tbn = tbnaux.replace('-', '');
	dadosModel.getTable(tbn, tipo, function(error, result){
		res.render("home/lista", {listagem : result, tipos:tipos});
		//res.send(result);
	});
}

module.exports.show = function(application, req, res){
	var listagem=null;
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	dadosModel.getTipos(function(error,result){
		res.render("home/lista", {listagem:listagem, tipos:result});
		//res.send(result);
	});

	
}

module.exports.editar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	var id = req.query['id'];
	var tablename = req.query['tablename'];
	
	dadosModel.getTupla(id, tablename,function(error, result){
		res.render("home/editar", {tupla : result, tablename:tablename});
		//res.send(result);
	});	
}