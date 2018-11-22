
module.exports.show = function(application, req, res){
	var listagem=null;
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var eventoscadastrados;
	
	dadosModel.eventos(function(error,result){
		if(error){
			connection.end();
		 	throw error;	
		}
		eventoscadastrados = result;
	});

	dadosModel.getTipos(function(error,result){
		if(error){
			connection.end();
		 	throw error;	
		}
		res.render("home/lista", {listagem:listagem, tables:parser_table_name(result),eventoscadastrados:eventoscadastrados, tbn:null});
	});
}

module.exports.mostrarTelaParaEdicaoDePessoa = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	var id = req.query['id'];
	var tablename = req.query['tablename'];
	
	dadosModel.getTupla(id, tablename,function(error, result){
		if(error){
			connection.end();
		 	throw error;	
		}
		res.render("home/editar", {tupla : result, tablename : tablename});
	});	
}

module.exports.update = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var tupla=req.body;
	var dadosByTableName;
	var tipos;

	dadosModel.update(tupla, function(error,result){
		if(error){
			connection.end();
		 	throw error;	
		}
	});

	//pega as linhas(pessoas) de determinada tabela
	dadosModel.getTable(tupla["tablename"], function(error, result){
		if(error){
			connection.end();
		 	throw error;
		}
		dadosByTableName=result;
	});

	var eventoscadastrados;
	dadosModel.eventos(function(error,result){
		if(error){
			connection.end();
		 	throw error;
		}
		eventoscadastrados = result;
	});

	dadosModel.getTipos(function(error,result){
		if(error){
			connection.end();
			throw error;
		}
		tipos=parser_table_name(result);
		connection.end();
		res.render("home/lista", {listagem:dadosByTableName, tables:tipos, eventoscadastrados : eventoscadastrados, tbn:tupla["tablename"]});
	});
}

module.exports.mostrarTelaParaNovaPessoa = function(application, req, res){
	res.render("home/novo", {tablename : req.query['tablename']});
}

module.exports.salvarPessoa = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var form=req.body;
	var dadosByTableName;
	var tipos;

	dadosModel.salvar(form, function(error, result){
		if(error){
			connection.end();
		 	throw error;
		}
	});
	dadosModel.getTable(form["tipo"], function(error, result){
		if(error){
			connection.end();
		 	throw error;
		}
		dadosByTableName=result;
	});

	var eventoscadastrados;
	dadosModel.eventos(function(error,result){
		if(error){
			connection.end();
		 	throw error;
		}
		eventoscadastrados = result;
	});

	var tbn = form["tipo"].replace("_", " "); 
	dadosModel.getTipos(function(error,result){
		tipos=parser_table_name(result);
		connection.end();
		res.render("home/lista", {listagem:dadosByTableName, tables:tipos, eventoscadastrados:eventoscadastrados, tbn:tbn});
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
		if(error){
			connection.end();
		 	throw error;
		}
	});

	dadosModel.getTable(tablename, function(error, result){
		if(error){
			connection.end();
		 	throw error;
		}
		dados=result;
	});

	var eventoscadastrados;
	dadosModel.eventos(function(error,result){
		if(error){
			connection.end();
		 	throw error;
		}
		eventoscadastrados = result;
	});

	dadosModel.getTipos(function(error,result){
		if(error){
			connection.end();
		 	throw error;
		}
		tipos=parser_table_name(result);
		res.render("home/lista", {listagem:dados, tables:tipos, eventoscadastrados:eventoscadastrados,tbn:tablename});
	});
}

module.exports.filtrar = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	var tbn = req.body['tables'];


	if(tbn===undefined){
		return res.redirect('/show');
	}
	var tbn_selecionada = tbn;
	tbn = tbn.replace(" ","_");

	var tipos;
	dadosModel.getTipos(function(error,result){
		if(error){
			connection.end();
		 	throw error;
		}
		tipos=parser_table_name(result);
	});

	var eventoscadastrados;
	dadosModel.eventos(function(error,result){
		if(error){
			connection.end();
		 	throw error;
		}
		eventoscadastrados = result;
	});
	
	dadosModel.getTable(tbn, function(error, result){
		if(error){
			connection.end();
		 	throw error;
		}
		res.render("home/lista", {listagem : result, tables : tipos, eventoscadastrados : eventoscadastrados, tbn:tbn_selecionada});
	});
}

function parser_table_name(result){
	var to_select = new Array();
	for(var s=0;s<result.length;s++){
		to_select.push((result[s].tipo).replace("_", " "));
	}
	return to_select;
}




/***EVENTOS****/

module.exports.eventos = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	eventosModel.eventos(function(error, result){
		if(error){
			connection.end();
		 	throw error;
		}
		//console.log("EVENTOS ",result);
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
			if(error){
				connection.end();
		 		throw error;
			}
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
			if(error){
				connection.end();
		 		throw error;
			}
			res.redirect("/eventos");
		});	
	}else{
		eventosModel.alterarevento(evento, function(error, result){
			if(error){
				connection.end();
		 		throw error;
			}
			res.redirect("/eventos");
		});	
	}
	
}

//atenção: ao remover evento devemos analisar a lista de selecionaveis pendurado a esse evento
module.exports.removerevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var evento = req.body;
	eventosModel.removerevento(evento["id"], function(error, result){
		if(error){
			connection.end();
	 		throw error;
		}
		res.redirect("/eventos");
	});
}

module.exports.editarevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var evento = req.body;
	eventosModel.buscarevento(evento["id"], function(error, result){
		if(error){
			connection.end();
	 		throw error;
		}
		res.render("home/eventos/novo",{evento:result});
	});
}



module.exports.detalhesevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);

	var idevento = req.body["ideventoclicado"];
	//console.log("id evento clicado ",idevento);

	var map_convidados = new Map();
	

	eventosModel.getlistaconvidados2evento(idevento,function(error,result){
		if(error){
			connection.end();
	 		throw error;
		}

		if(result.length > 0)
		{
			for(var i = 0; i < result.length; i++ )
			{
			 	map_convidados[result[i].tablename] = map_convidados[result[i].tablename] || [];
			 	map_convidados[result[i].tablename].push(result[i].idselecionado);
			}
		}

		//console.log("map_convidados ", map_convidados);
		var tableNames = Object.keys(map_convidados);
		//console.log("tableNames ", tableNames);
		
		var resultTotal = new Array();
		var sql=[];
		
		if(tableNames.length > 0)
		{
			for(var i = 0 ; i < tableNames.length ; i++)
			{
				if(i == tableNames.length-1){
					sql.push("select * from "+tableNames[i]+" where id in ("+map_convidados[tableNames[i]]+")" );
				}else{
					sql.push("select * from "+tableNames[i]+" where id in ("+map_convidados[tableNames[i]]+") union ");
				}
			}
		}

		var sql_str="";
		
		for(var i = 0; i < sql.length ; i ++)
		{
			sql_str += sql[i];	
		}
		console.log("sql_str ", sql_str);
		eventosModel.buscarTodosConvidados(sql_str,function(error,result){
			if(error){
				connection.end();
				console.log("erroooooooooooo");
		 		throw error;
			}
			if(result){
				
				resultTotal = pegaGeral(result);
				
			}
		});	

		//console.log("resultTotal ", resultTotal);
		eventosModel.buscarevento(idevento,function(error,result){
			if(error){
				connection.end();
		 		throw error;
			}
			console.log(">>>>result ", resultTotal);
			res.send(resultTotal);
			//res.render("home/eventos/detalhes",{evento:result[0], selecionaveis:resultTotal});
		});	

	});
}


function pegaGeral(result){
	var geral = new Array();
	geral=result;
	return geral;
}


module.exports.gerenciarconvidado = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	
	var dados = req.body;
	var s = dados["selecionados"];
	var tablename = "'"+dados["idtable"]+"'";
	var idevento = dados["idevento"];
	var linhas="";
		
	if(s instanceof Array)
	{
		for(var i = 0 ; i < s.length ; i++)
		{
			if(i==s.length-1)
				linhas+="("+s[i]+","+idevento+","+tablename+","+0+","+0+");";
			else
				linhas += "("+s[i]+","+idevento+","+tablename+","+0+","+0+"),";
		}
	}
	else
	{
		linhas= "("+s+","+idevento+","+tablename+","+0+","+0+");";
		
	}
	
	eventosModel.criarlistaconvidados2evento(linhas,function(error,result){
		if(error){
			if(error.code == 'ER_DUP_ENTRY' || error.errno == 1062){
				console.log("tentativa de inserir duplicado no BD");
			}
		}
		//connection.end();
		res.redirect("/eventos");
	});
}

module.exports.getConvidadosFromSelectEventos = function(application, req, res){
	
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);

	var eventoSelecionado = req.body;
	var tbn = eventoSelecionado["tbn"];
	var idevento = eventoSelecionado["evento"];

	eventosModel.getTodosSelecionaveisByEventoId(idevento,tbn,function(error,result){
		//console.log("result ", result);
		res.send(result);
	});
	
}

