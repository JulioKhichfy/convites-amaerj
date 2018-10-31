module.exports = function(application){

	application.post('/update', function(req, res){
		application.app.controllers.home.update(application, req, res);
	});

	application.get('/show', function(req, res){
		application.app.controllers.home.show(application, req, res);
	});

	application.post('/filtrar', function(req, res){
		application.app.controllers.home.filtrar(application, req, res);
	});

	application.get('/filtrar', function(req, res){
		application.app.controllers.home.filtrar(application, req, res);
	});

	application.get('/editar', function(req, res){
		application.app.controllers.home.editar(application, req, res);
	});
	
	application.get('/novo', function(req, res){
		application.app.controllers.home.novo(application, req, res);
	});
	
	application.post('/salvar', function(req, res){
		application.app.controllers.home.salvar(application, req, res);
	});
	
	application.get('/remover', function(req, res){
		application.app.controllers.home.remover(application, req, res);
	});

	application.get('/eventos', function(req, res){
		application.app.controllers.home.eventos(application, req, res);
	});

	application.get('/eventos/novo', function(req, res){
		application.app.controllers.home.novoevento(application, req, res);
	});

	application.post('/eventos/salvar', function(req, res){
		application.app.controllers.home.salvarevento(application, req, res);
	});

	application.post('/eventos/remover', function(req, res){
		application.app.controllers.home.removerevento(application, req, res);
	});

	application.post('/eventos/editar', function(req, res){
		application.app.controllers.home.novoevento(application, req, res);
	});

	application.post('/selecionar', function(req, res){
		application.app.controllers.home.selecionar2evento(application, req, res);
	});

	application.post('/convidados', function(req, res){
		console.log("alouuuuuu");
		application.app.controllers.home.gerenciarconvidado(application, req, res);
	});

	application.post('/excluir-convidado', function(req, res){
		application.app.controllers.home.excluirconvidado(application, req, res);
	});
	
}