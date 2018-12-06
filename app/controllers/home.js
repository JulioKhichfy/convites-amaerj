
/*BASE DE DADOS*/
//var hasValue = require('has-values');
//var HashTable = require('hashtable');
//var Map = require('hashtable/es6-map');

module.exports.index = function(application, req, res){
	res.render("home/index");
}

module.exports.show = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);

	dadosModel.getTipos(function(error,result){
		if(error)throw error;	
		res.render("home/lista", {listagem:null, tables:parser_table_name(result),eventoscadastrados:null, tbn:null});
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
		if(error)throw error;
		tipos=parser_table_name(result);
		var eventoscadastrados;
		dadosModel.eventos(function(error,result){
			if(error)throw error;
			eventoscadastrados = result;
			dadosModel.getTable(tbn, function(error, result){
				if(error)throw error;
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
		if(error)throw error;	
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
		if(error)throw error;	
		//pega as linhas(pessoas) de determinada tabela
		dadosModel.getTable(tupla["tablename"], function(error, result){
			if(error)throw error;
			dadosByTableName=result;
			var eventoscadastrados;
			dadosModel.eventos(function(error,result){
				if(error)throw error;
				eventoscadastrados = result;
				dadosModel.getTipos(function(error,result){
					if(error)throw error;
					tipos=parser_table_name(result);
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
		if(error)throw error;
		dadosModel.getTable(form["tipo"], function(error, result){
			if(error)throw error;
			dadosByTableName=result;
			var eventoscadastrados;
			dadosModel.eventos(function(error,result){
				if(error)throw error;
				eventoscadastrados = result;
				var tbn = form["tipo"].replace("_", " "); 
				dadosModel.getTipos(function(error,result){
					tipos=parser_table_name(result);
					res.render("home/lista", {listagem:dadosByTableName, tables:tipos, eventoscadastrados:eventoscadastrados, tbn:tbn});
				});	
			});
		});
	});
}

module.exports.remover = function(application, req, res){
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	var dados;
	var tipos;
	var id = req.query['id'];
	var tablename = req.query['tablename'];
	dadosModel.remover(id, tablename, function(error, result){
		if(error)throw error;
		res.send("removido");
	});
}

module.exports.administrar = function(application, req, res){
	res.render("admin/importar");
}


module.exports.importarTodaBaseDados = function(application, req, res){
	
	var removeAccents = require('remover-acentos');
	var Excel = require('exceljs');
	Excel.config.setValue('promise', require('bluebird'));
	var connection = application.config.dbConnection();
	var dadosModel = new application.app.models.DadosDAO(connection);
	
	if (Object.keys(req.files).length == 0) {
		res.render("admin/importar");
	}
	
	let filexlxs = req.files.base;
	
	var TRATAMENTO;
	var  NOME;
	var  SEXO;
	var  CARGO;
	var  EMAIL;
	var  TELEFONE;
	var  ENDERECO;
	var  CEP;
	var  SITUACAO;

	filexlxs.mv('./app/uploads/'+filexlxs["name"], function(error) 
	{
		if (error){
			console.log("erro no MV do arquivo");
			throw error;
		}
		console.log("arquivo gravado em uploads");
		var workbook = new Excel.Workbook();
		workbook.xlsx.readFile('./app/uploads/'+filexlxs["name"])
	    .then(function() 
	    {	
	    	var tbn_temp=[];
	    	var valuesGeneral=new Map();
	    	console.log("INICIANDO CAPTURA DOS NOMES DAS SHEETS");
	    	workbook.eachSheet(function(worksheet, sheetId) 
	        {
	        	var tbn_str = removeAccents(((worksheet["name"].toUpperCase()).trim()).replace(new RegExp(" ", 'g'), "_"));
	        	valuesGeneral[tbn_str] = valuesGeneral[tbn_str] || [];

	        	tbn_temp.push(tbn_str);//nome da tabela
	        	var valuesToInsertTableSpecific=[];
		        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) 
		        {
		        	row.eachCell({ includeEmpty: false }, function(cell, colNumber) 
		        	{
	        			if(rowNumber==1)
	        			{
		        			var c = removeAccents((((cell.value).toUpperCase()).replace("-", "")).trim());
		        			console.log("nome da coluna",c);
		        			switch(c) 
		        			{
							    case "TRATAMENTO":
							        TRATAMENTO=colNumber;
							        break;
							    case "NOME":
							       	NOME=colNumber;
							        break;
							    case "SEXO":
							        SEXO=colNumber;
							        break;
							    case "CARGO":
							        CARGO=colNumber;
							        break;
							    case "EMAIL":
							        EMAIL=colNumber;
							        break;
							    case "TELEFONE":
							        TELEFONE=colNumber;
							        break;
							    case "ENDERECO":
							        ENDERECO=colNumber;
							        break;
							    case "CEP":
							        CEP=colNumber;
							        break;
							    case "SITUACAO":
							        SITUACAO=colNumber;
							        break;                                
							    default:
							        console.log("lixo", c);
							}
						}
	       	 		});
		        	if(rowNumber>1){
						var trat_ = (row.getCell(TRATAMENTO).value == null || row.getCell(TRATAMENTO).text == "")?"":row.getCell(TRATAMENTO).text;//.replace(new RegExp(",", 'g'), " ");
						console.log("trat_",trat_);
						var nome_ = (row.getCell(NOME).value == null || row.getCell(NOME).text == "")?"":row.getCell(NOME).text;//.replace(new RegExp(",", 'g'), " ");
						console.log("nome_",nome_);
						var cargo_ = (row.getCell(CARGO).value == null || row.getCell(CARGO).text == "")?"":row.getCell(CARGO).text;//.replace(new RegExp(",", 'g'), " ");
						console.log("cargo_",cargo_);
						var telefone_ = (row.getCell(TELEFONE).value == null || row.getCell(TELEFONE).text == "")?"":row.getCell(TELEFONE).text;//.replace(new RegExp(",", 'g'), " ");
						console.log("telefone_",telefone_);
						var email_ = (row.getCell(EMAIL).value == null || row.getCell(EMAIL).text == "")?"":row.getCell(EMAIL).text;//.replace(new RegExp(",", 'g'), " ");
						console.log("email_",email_);
						var cep_ = (row.getCell(CEP).value == null || row.getCell(CEP).text == "")?"":row.getCell(CEP).text;//.replace(new RegExp(",", 'g'), " ");
						console.log("cep_",cep_);
						var endereco_ = (row.getCell(ENDERECO).value == null || row.getCell(ENDERECO).text == "")?"":(row.getCell(ENDERECO).text).replace(new RegExp(",", 'g'), " ");
						console.log("endereco_",endereco_);
						var sexo_ = (row.getCell(SEXO).value == null || row.getCell(SEXO).text == "")?"":row.getCell(SEXO).text;//.replace(new RegExp(",", 'g'), " ");
						console.log("trat_",trat_);
						var situacao_ = (row.getCell(SITUACAO).value == null || row.getCell(SITUACAO).text == "")?"":row.getCell(SITUACAO).text;//.replace(new RegExp(",", 'g'), " ");
						console.log("trat_",trat_);
						valuesGeneral[tbn_str].push('INSERT INTO '+tbn_str+' VALUES('+trat_+','+nome_+','+cargo_+','+telefone_+','+email_+','+cep_+','+endereco_+','+sexo_+','+situacao_+','+tbn_str+');');
					}
	        	});
	    		
			});
			dadosModel.createTablesFromExcel(tbn_temp, function(error, result)
    		{
    			if (error){
					console.log("erro no createTablesFromExcel");
					throw error;
				}
    			console.log("SUCESSO NO CALLBACK PARA CRIAÇÃO DE TABELAS");
    			for(var i  = 0 ; i < valuesGeneral.length ; i++){
    				//console.log("GERAL>>>>>",valuesGeneral[i]);
    			}
    			//dadosModel.values_to_insert(values_to_insert, function(error, result){
				// olha isso:connection.destroy();
    			res.send(valuesGeneral);
    			//res.send("ok");

    			//});
    		});
		});
	});
}


module.exports.upload = function(application, req, res){
	var idevento = req.body["eventoid"];
	if (Object.keys(req.files).length == 0) {
		//return res.status(400).send("nenhum arquivo selecionado");
		res.redirect("eventos/detalhes?ideventoclicado="+idevento+"&erros=Nenhum arquivo escolhido");
	}
	
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let sampleFile = req.files.sampleFile;
	console.log("sampleFile",sampleFile["name"]);
	// Use the mv() method to place the file somewhere on your server
	sampleFile.mv('./app/uploads/'+"evento_"+idevento+"_"+sampleFile["name"], function(err) {
		if (err){
			//return res.status(500).send(err);
			res.redirect("eventos/detalhes?ideventoclicado="+idevento+"&erros=O arquivo não foi salvo. Entrar em contato com o programador");
		}
		var connection = application.config.dbConnection();
		var eventosModel = new application.app.models.DadosDAO(connection);
		eventosModel.saveDocumento(sampleFile["name"],idevento,"evento_"+idevento+"_"+sampleFile["name"],"./app/uploads/",function(error, result){
			if(error) throw error;
			res.redirect("eventos/detalhes?ideventoclicado="+idevento);
		});
	});
}

module.exports.removerArquivo = function(application, req, res){
	var path = req.query["path"];
	var id = req.query["id"];
	var nomeGerado = req.query["nomegerado"];
	console.log("path",path);
	console.log("id",id);
	console.log("nomegerado",nomeGerado);

	const fs = require('fs');
	const filePath = path;
		fs.access(filePath, error => {
		    if (!error) {
		        fs.unlinkSync(filePath);
		        var connection = application.config.dbConnection();
				var eventosModel = new application.app.models.DadosDAO(connection);
		        eventosModel.removerDocumento(nomeGerado,id,function(error, result){
					if(error) throw error;
					res.redirect("eventos/detalhes?ideventoclicado="+id);
				});
		    } else {
		        console.log(error);
		        res.redirect("eventos/detalhes?ideventoclicado="+id+"&erros=O arquivo não foi Excluído. Entrar em contato com o programador");
		    }
		});

}


/***EVENTOS****/

module.exports.eventos = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	eventosModel.eventos(function(error, result){
		if(error){
			//throw error;
			res.redirect("show");
		}
		res.render("home/eventos/lista", {listagem:result});
	});

}

module.exports.novoevento = function(application, req, res){
	var id = req.query["id"];
	if(id===undefined){
		res.render("home/eventos/novo",{evento:[]});
	}else{
		var connection = application.config.dbConnection();
		var eventosModel = new application.app.models.DadosDAO(connection);
		eventosModel.buscarevento(id, function(error, result){
			if(error)throw error;
			res.render("home/eventos/novo",{evento:result});
		});
	}
}

module.exports.salvarevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var evento = req.body;
	console.log("evento",evento);
	var d = req.body["data"];
	console.log(d instanceof Date);


	if(evento["id"] === undefined){
		eventosModel.salvarevento(evento, function(error, result){
			if(error)throw error;
			res.redirect("/eventos");
		});	
	}else{
		eventosModel.alterarevento(evento, function(error, result){
			if(error)throw error;
			res.redirect("/eventos");
		});	
	}
}

//atenção: ao remover evento devemos analisar a lista de selecionaveis pendurado a esse evento
module.exports.removerevento = function(application, req, res){
	var connection = application.config.dbConnection();
	var eventosModel = new application.app.models.DadosDAO(connection);
	var eventoId = req.query["id"];
	eventosModel.removerevento(eventoId, function(error, result){
		if(error)throw error;
		res.redirect("/eventos");
	});
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
	var idevento = req.query["ideventoclicado"];
	var erros = req.query["erros"];
	if(erros===undefined){
		erros="";
	}
	var evento;
	eventosModel.buscarevento(idevento,function(error,result){
		if(error) throw error;
	 	evento=result;
	 	eventosModel.getlistaconvidados2evento(idevento,function(error,result){
			if(error) throw error;
			if(result.length > 0){
				var map_convidados =  populaListaConvidadosMap(result);
				var sql_str = construirQueryByConvidadosMap(map_convidados);
				eventosModel.buscarTodosConvidados(sql_str,function(error,result){
					if(error) throw error;
			 		var convidados = result;
			 		eventosModel.buscardocumentos(idevento,function(error,result){
						if(error) throw error;
						if(result.length > 0)
							res.render("home/eventos/detalhes",{evento:evento[0], selecionaveis:convidados, arquivos:result, erros:erros});
						else
							res.render("home/eventos/detalhes",{evento:evento[0], selecionaveis:convidados, arquivos:[],erros:erros});
					});
			 	});
			}else{
				map_convidados = new Map();
				eventosModel.buscardocumentos(idevento,function(error,result){
					if(error) throw error;
					if(result.length > 0)
						res.render("home/eventos/detalhes",{evento:evento[0], selecionaveis:[], arquivos:result,erros:erros});
					else
						res.render("home/eventos/detalhes",{evento:evento[0], selecionaveis:[], arquivos:[],erros:erros});
				});
				
			}
		});
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
		if(error)throw error;
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
		if(error)throw error;
		res.send("removido");
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

function parser_table_name(result){
	

	var to_select = new Array();
	for(var s=0;s<result.length;s++){
		to_select.push((result[s].TABLE_NAME).replace("_", " "));
	}
	return to_select;
	//res.send(result);
}


