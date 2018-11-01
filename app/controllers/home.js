
module.exports.filtrar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	var tbn = req.body['tables'];
	console.log(">>>>>>>>>>>>>" + tbn);
	
	
	if(tbn===undefined){
		return res.redirect('/show');
	}
	
	tbn = tbn.replace(" ","_");

	var tipos;
	dadosModel.getTipos(function(error,result){
		tipos=parser_table_name(result);
	});

	var eventoscadastrados;
	dadosModel.eventos(function(error,result){
		eventoscadastrados = result;
	});

	/*var selecionaveis;
	dadosModel.getSelecionaveisFromTbn(tbn, function(error,result){
		selecionaveis = result;
	});*/
	
	dadosModel.getTable(tbn, function(error, result){
		res.render("home/lista", {listagem : result, tables : tipos, eventoscadastrados : eventoscadastrados, tbn:req.body['tables']});
		//res.send(result);
	});
}

module.exports.show = function(application, req, res){
	var listagem=null;
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var eventoscadastrados;
	
	dadosModel.eventos(function(error,result){
		eventoscadastrados = result;
	});

	dadosModel.getTipos(function(error,result){
		res.render("home/lista", {listagem:listagem, tables:parser_table_name(result),eventoscadastrados:eventoscadastrados, tbn:null});
		//res.send(result);
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

	var eventoscadastrados;
	dadosModel.eventos(function(error,result){
		eventoscadastrados = result;
	});

	dadosModel.getTipos(function(error,result){
		tipos=parser_table_name(result);
		res.render("home/lista", {listagem:dados, tables:tipos, eventoscadastrados:eventoscadastrados});
	});	
}

module.exports.remover = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	//var form=req.body;
	var dados;
	var tipos;
	
	var id = req.query['id'];
	var tablename = req.query['tablename'];

	dadosModel.remover(id, tablename, function(error, result){
		console.log("callback do update ERROR " + error);
		console.log("callback do update RESULT " + result);
	});

	dadosModel.getTable(tablename, function(error, result){
		dados=result;
	});

	var eventoscadastrados;
	dadosModel.eventos(function(error,result){
		eventoscadastrados = result;
	});

	dadosModel.getTipos(function(error,result){
		tipos=parser_table_name(result);
		res.render("home/lista", {listagem:dados, tables:tipos, eventoscadastrados:eventoscadastrados});
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
	var id = req.body["id"];
	if(id===undefined){
		res.render("home/eventos/novo",{evento:[]});
	}else{
		var connection = application.config.dbConnection();
		var eventosModel = new application.app.models.DadosDAO(connection);
		eventosModel.buscarevento(id, function(error, result){
			res.render("home/eventos/novo",{evento:result});
		});
	}
}

module.exports.salvarevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var evento = req.body;
	if(evento["id"] === undefined){
		console.log("salvando evento ", evento);
		eventosModel.salvarevento(evento, function(error, result){
			res.redirect("/eventos");
		});	
	}else{
		eventosModel.alterarevento(evento, function(error, result){
			res.redirect("/eventos");
		});	
	}
	
}



module.exports.removerevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var evento = req.body;
	eventosModel.removerevento(evento["id"], function(error, result){
		res.redirect("/eventos");
	});
}

module.exports.editarevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var evento = req.body;
	eventosModel.buscarevento(evento["id"], function(error, result){
		//res.send(result);
		res.render("home/eventos/novo",{evento:result});
	});
}
/*module.exports.detalhesevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);

	eventosModel.getlistaconvidados2evento(dados_selecionados,function(error,result){
		console.log("callback do criarlistaconvidados2evento ERROR " + error);
		console.log("callback do criarlistaconvidados2evento RESULT " + result);
		res.render("home/eventos/detalhes");
	});
	
}*/

module.exports.gerenciarconvidado = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	
	var dados_selecionados = req.body;
		
	eventosModel.criarlistaconvidados2evento(dados_selecionados,function(error,result){
		console.log("callback do criarlistaconvidados2evento ERROR " + error);
		console.log("callback do criarlistaconvidados2evento RESULT " + result);
		res.redirect("/eventos");
	});
	//Error: ER_DUP_ENTRY: Duplicate entry '51-1-ASSOCIACOES' for key 'PRIMARY'
}