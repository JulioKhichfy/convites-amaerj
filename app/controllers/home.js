
module.exports.filtrar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var tbn = req.body['tables'].replace(" ","_");
	if(tbn==undefined){
		return res.redirect('/show');
	}
	
	var tipos;
	dadosModel.getTipos(function(error,result){
		tipos=parser_table_name(result);
	});

	dadosModel.getTable(tbn, function(error, result){
		res.render("home/lista", {listagem : result, tables : tipos});
		//res.send(result);
	});
}

module.exports.show = function(application, req, res){
	var listagem=null;
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	dadosModel.getTipos(function(error,result){
		res.render("home/lista", {listagem:listagem, tables:parser_table_name(result)});
		//res.send(to_select);
	});
}

function parser_table_name(result){
	var to_select = new Array();
	for(var s=0;s<result.length;s++){
		to_select.push((result[s].tipo).replace("_", " "));
	}
	return to_select;
}


module.exports.editar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	var id = req.query['id'];
	var tablename = req.query['tablename'];
	
	dadosModel.getTupla(id, tablename,function(error, result){
		res.render("home/editar", {tupla : result, tablename : tablename});
		//res.send(result);
	});	

}

module.exports.update = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	
	var tupla=req.body;
	console.log(">>>>> tupla " + tupla["tablename"]);

	var dados;
	var tipos;
	

	dadosModel.update(tupla, function(error,result){
		console.log("callback do update ERROR " + error);
		console.log("callback do update RESULT " + result);
		
	});

	dadosModel.getTable(tupla["tablename"], function(error, result){
		dados=result;
	});

	dadosModel.getTipos(function(error,result){
		tipos=parser_table_name(result);
		console.log(">>>>> tipos " + tipos);
		res.render("home/lista", {listagem:dados, tables:tipos});
	});
	
	//res.render("home/lista", {listagem:dados, tables:tipos});
		//res.send(result);
	
	
}