/*module.exports.associacoes = function(application, req, res){

	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	dadosModel.getAssociacoes(function(error, result){
		res.render("home/associacoes", {associacoes : result});
		//res.send()
	});

}*/

module.exports.filtrar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var tipos;
	console.log("tipo a ser filtrado " + req.body['tipos']);
	dadosModel.getTipos(function(error,result){
		tipos=result;
	});

	dadosModel.getAssociacoes(req.body['tipos'], function(error, result){
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
	console.log("EDITANDO....");
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	var id = req.query;

	dadosModel.getAssociacao(id, function(error, result){
		//res.render("home/index", {associacao : result});
		res.send(result);
	});	
}