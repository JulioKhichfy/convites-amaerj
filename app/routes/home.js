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

	application.get('/editar', function(req, res){
		application.app.controllers.home.editar(application, req, res);
	});
	
	application.get('/novo', function(req, res){
		application.app.controllers.home.novo(application, req, res);
	});
	
	application.post('/salvar', function(req, res){
		application.app.controllers.home.salvar(application, req, res);
	});
	
	application.post('/remover', function(req, res){
		application.app.controllers.home.remover(application, req, res);
	});

	application.get('/eventos', function(req, res){
		application.app.controllers.home.eventos(application, req, res);
	});

	application.get('/eventos-novo', function(req, res){
		console.log(">>> ROUTER");
		application.app.controllers.home.novoevento(application, req, res);
	});
	
}