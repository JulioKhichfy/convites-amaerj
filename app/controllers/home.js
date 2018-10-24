
module.exports.filtrar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var tbn = req.body['tables'];
	if(tbn==undefined){
		return res.redirect('/show');
	}
	tbn = tbn.replace(" ","_");
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

module.exports.novo = function(application, req, res){
	res.render("home/novo", {tablename : req.query['tablename']});
}

module.exports.update = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var tupla=req.body;
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
		res.render("home/lista", {listagem:dados, tables:tipos});
	});
}

module.exports.salvar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var form=req.body;
	var dados;
	var tipos;

	dadosModel.salvar(form, function(error, result){
		console.log("callback do update ERROR " + error);
		console.log("callback do update RESULT " + result);
	});
	dadosModel.getTable(form["tipo"], function(error, result){
		dados=result;
	});

	dadosModel.getTipos(function(error,result){
		tipos=parser_table_name(result);
		res.render("home/lista", {listagem:dados, tables:tipos});
	});	
}

module.exports.remover = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var form=req.body;
	var dados;
	var tipos;
	dadosModel.remover(form, function(error, result){
		console.log("callback do update ERROR " + error);
		console.log("callback do update RESULT " + result);
	});
	dadosModel.getTable(form["tipo"], function(error, result){
		dados=result;
	});

	dadosModel.getTipos(function(error,result){
		tipos=parser_table_name(result);
		res.render("home/lista", {listagem:dados, tables:tipos});
	});
}

module.exports.eventos = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	eventosModel.eventos(function(error, result){
		console.log(">>>> result ", result);
		res.render("home/eventos/lista", {listagem:result});
	});

}

module.exports.novoevento = function(application, req, res){
	//var connection = application.config.dbConnection();
	//var eventossModel = new application.app.models.DadosDAO(connection);
	console.log(">>> CONTROLADOR");
	res.render("eventos/novo");
}