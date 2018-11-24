module.exports = function(application){

	application.get('/show', function(req, res){
		application.app.controllers.home.show(application, req, res);
	});

	application.get('/editar', function(req, res){
		application.app.controllers.home.mostrarTelaParaEdicaoDePessoa(application, req, res);
	});

	application.post('/update', function(req, res){
		application.app.controllers.home.update(application, req, res);
	});

	application.get('/novo', function(req, res){
		application.app.controllers.home.mostrarTelaParaNovaPessoa(application, req, res);
	});

	application.post('/salvar', function(req, res){
		application.app.controllers.home.salvarPessoa(application, req, res);
	});
	
	application.get('/remover', function(req, res){
		application.app.controllers.home.remover(application, req, res);
	});

	application.post('/filtrar', function(req, res){
		application.app.controllers.home.filtrar(application, req, res);
	});

	/*application.get('/filtrar', function(req, res){
		application.app.controllers.home.filtrar(application, req, res);
	});*/

	

	/***EVENTOS***/

	application.get('/eventos', function(req, res){
		application.app.controllers.home.eventos(application, req, res);
	});

	application.get('/eventos/novo', function(req, res){
		application.app.controllers.home.novoevento(application, req, res);
	});

	application.post('/eventos/detalhes', function(req, res){
		application.app.controllers.home.detalhesevento(application, req, res);
	});

	application.post('/eventos/salvar', function(req, res){
		application.app.controllers.home.salvarevento(application, req, res);
	});

	application.get('/eventos/remover', function(req, res){
		application.app.controllers.home.removerevento(application, req, res);
	});

	application.post('/eventos/editar', function(req, res){
		application.app.controllers.home.novoevento(application, req, res);
	});

	application.post('/selecionar', function(req, res){
		application.app.controllers.home.selecionar2evento(application, req, res);
	});

	application.post('/convidados', function(req, res){
		application.app.controllers.home.gerenciarconvidado(application, req, res);
	});

	application.post('/excluir-convidado', function(req, res){
		application.app.controllers.home.excluirconvidado(application, req, res);
	});

	application.post('/convidados2evento', function(req, res){
		console.log("convidados2evento alvo");
		application.app.controllers.home.getConvidadosFromSelectEventos(application, req, res);
	});

	application.get('/eventos/removerdalista', function(req, res){
		application.app.controllers.home.removerdalista(application, req, res);
	});

	/*application.get('/eventos/detalhes', function(req, res){
		application.app.controllers.home.detalhesevento(application, req, res);
	});
	*/	
	
}