module.exports.index = function(application, req, res){

	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	/*noticiasModel.get5UltimasNoticias(function(error, result){
		res.render("home/index", {associacoes : result});	
	});*/
	
	dadosModel.getAssociacoes(function(error, result){
		res.render("home/index", {associacoes : result});
	});

}