
module.exports.filtrar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	
	var idEvento=req.query.idEvento;
	var idSelecionavel = req.query.idPessoa
	var nomedatabela = req.query.tbn;

	console.log(">>>>>>> idEvento ", idEvento);
	console.log(">>>>>>> idSelecionavel ", idSelecionavel);
	console.log(">>>>>>> nomedatabela ", nomedatabela);


	var tbn = req.body['tables'];
	var selecionaveis;
	
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

	dadosModel.getSelecionaveisFromTbn(tbn, function(error,result){
		selecionaveis = result;
	});
	
	dadosModel.getTable(tbn, function(error, result){
		res.render("home/lista", {listagem : result, tables : tipos, eventoscadastrados : eventoscadastrados});
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
		res.render("home/lista", {listagem:listagem, tables:parser_table_name(result),eventoscadastrados:eventoscadastrados});
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

module.exports.selecionar2evento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var selecionado2evento = req.body;
	eventosModel.selecionar2evento(selecionado2evento, function(error, result){
		//res.send(selecionado2evento);
		//res.render("home/lista",{evento:result});
		res.redirect('/filtrar?idEvento='+selecionado2evento["idEvento"]+'&idPessoa='+selecionado2evento["idPessoa"]+'&tbn='+selecionado2evento["tablename"]);
	});
	//res.send(evento);
}