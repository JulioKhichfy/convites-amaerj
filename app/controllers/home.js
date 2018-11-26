
/*BASE DE DADOS*/
var hasValue = require('has-values');
//var HashTable = require('hashtable');
//var Map = require('hashtable/es6-map');

module.exports.show = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	var eventoscadastrados;
	var listagem=null;
	
	dadosModel.eventos(function(error,result){
		if(error){
			connection.end();
		 	throw error;	
		}
		//aninhando callbacks
		eventoscadastrados = result;
		dadosModel.getTipos(function(error,result){
			if(error){
				connection.end();
			 	throw error;	
			}

			res.render("home/lista", {listagem:listagem, tables:parser_table_name(result),eventoscadastrados:eventoscadastrados, tbn:null});
		});
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

		var eventoscadastrados;
		dadosModel.eventos(function(error,result){
			if(error){
				connection.end();
			 	throw error;
			}
			
			eventoscadastrados = result;
			dadosModel.getTable(tbn, function(error, result){
				if(error){
					connection.end();
				 	throw error;
				}
				res.render("home/lista", {listagem : result, tables : tipos, eventoscadastrados : eventoscadastrados, tbn:tbn_selecionada});
			});
		});
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

		//pega as linhas(pessoas) de determinada tabela
		dadosModel.getTable(tupla["tablename"], function(error, result){
			if(error){
				connection.end();
			 	throw error;
			}
			dadosByTableName=result;

			var eventoscadastrados;
			dadosModel.eventos(function(error,result){
				if(error){
					connection.end();
				 	throw error;
				}
				eventoscadastrados = result;

				dadosModel.getTipos(function(error,result){
					if(error){
						connection.end();
						throw error;
					}
					tipos=parser_table_name(result);
					connection.end();
					res.render("home/lista", {listagem:dadosByTableName, tables:tipos, eventoscadastrados : eventoscadastrados, tbn:tupla["tablename"]});
				});
			});
		});
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
		dadosModel.getTable(form["tipo"], function(error, result){
			if(error){
				connection.end();
			 	throw error;
			}
			dadosByTableName=result;
			var eventoscadastrados;
			dadosModel.eventos(function(error,result){
				if(error){
					connection.end();
				 	throw error;
				}
				eventoscadastrados = result;
				var tbn = form["tipo"].replace("_", " "); 
				dadosModel.getTipos(function(error,result){
					tipos=parser_table_name(result);
					connection.end();
					res.render("home/lista", {listagem:dadosByTableName, tables:tipos, eventoscadastrados:eventoscadastrados, tbn:tbn});
				});	
			});
		});
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
	console.log("id",id);
	console.log("tablename",tablename);
	dadosModel.remover(id, tablename, function(error, result){
		if(error){
		 	connection.end();
		 	throw error;
		}
		res.send("removido");
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
	var id = req.query["id"];
	console.log(">>>id",id);
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
	console.log("evento",evento);
	if(evento["id"] === undefined){
		eventosModel.salvarevento(evento, function(error, result){
			if(error){
				connection.end();
		 		throw error;
			}
			res.redirect("/eventos");
		});	
	}else{
		console.log("alterando");
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
	var eventoId = req.query["id"];
	console.log("eventoId",eventoId);
	eventosModel.removerevento(eventoId, function(error, result){
		if(error){
			connection.end();
	 		throw error;
		}
		res.redirect("/eventos");
	});
}
function populaListaConvidadosMap(convidados){
	var map_convidados = new Map();
	for(var i = 0; i < convidados.length; i++ )
	{
	 	map_convidados[convidados[i].tablename] = map_convidados[convidados[i].tablename] || [];
	 	map_convidados[convidados[i].tablename].push(convidados[i].idselecionado);
	}
	return map_convidados;
}

function construirQueryByConvidadosMap(convidados_map){
	var tableNames = Object.keys(convidados_map);
	var resultTotal = new Array();
	var sql=[];
	
	if(tableNames.length > 0)
	{
		for(var i = 0 ; i < tableNames.length ; i++)
		{
			if(i == tableNames.length-1){
				sql.push("select * from "+tableNames[i]+" where id in ("+convidados_map[tableNames[i]]+")" );
			}else{
				sql.push("select * from "+tableNames[i]+" where id in ("+convidados_map[tableNames[i]]+") union ");
			}
		}
	}
	var sql_str="";
	for(var i = 0; i < sql.length ; i ++)
	{
		sql_str += sql[i];	
	}
	return sql_str;
}


module.exports.salvarObservacaoDetalhesEvento = function(application, req, res){

	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var idevento = req.body["idevento"];
	var observacao = req.body["observacao"];

	eventosModel.salvarObservacaoDetalhesEvento(idevento,observacao,function(error,result)
	{
		if(error)
		{
	 		res.send("Erro ao salvar observação");
		}
		else
		{
			res.send("Observação Salva com sucesso");
		}
	});

}

module.exports.detalhesevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var idevento = req.body["ideventoclicado"];

	eventosModel.getlistaconvidados2evento(idevento,function(error,result){
		if(error){
			connection.end();
	 		throw error;
		}
		var map_convidados =  populaListaConvidadosMap(result);
		var sql_str = construirQueryByConvidadosMap(map_convidados);
		if(sql_str!=""){
			eventosModel.buscarTodosConvidados(sql_str,function(error,result){
				if(error){
					connection.end();
			 		throw error;
				}
				var convidados = result;
				eventosModel.buscarevento(idevento,function(error,result){
					if(error){
						connection.end();
				 		throw error;
					}
					res.render("home/eventos/detalhes",{evento:result[0], selecionaveis:convidados});
				});
			});	
		}
		else
		{
			console.log("sem convidados");
			eventosModel.buscarevento(idevento,function(error,result){
				if(error){
					connection.end();
			 		throw error;
				}
				res.render("home/eventos/detalhes",{evento:result[0], selecionaveis:[] });
			});
		}
	});
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
			connection.end();
			throw error;
		}
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

module.exports.removerdalista = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);

	var idselecionado = req.query["id_pessoa"];
	var idevento = req.query["id_evento"];
	var tbn = req.query["tbn"];
	
	eventosModel.removerConvidado(idselecionado,idevento,tbn,function(error,result){		
		if(error){
			connection.end();
	 		throw error;
		}
		res.send("removido");
	});
}


