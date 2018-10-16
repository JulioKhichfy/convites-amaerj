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
	var tipo = req.body;
	console.log("tipo a ser filtrado " + req.body);
	dadosModel.getAssociacoes(tipo, function(error, result){
		res.render("home/lista", {listagem : result});
		//res.send(result);
	});

}

module.exports.show = function(application, req, res){
	var listagem=null;
	res.render("home/lista", {listagem:listagem});
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