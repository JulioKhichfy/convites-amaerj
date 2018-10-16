module.exports = function(application){

	/*application.get('/associacoes', function(req, res){
		application.app.controllers.home.associacoes(application, req, res);
	});*/

	application.get('/show', function(req, res){
		application.app.controllers.home.filtrar(application, req, res);
	});

	application.post('/filtrar', function(req, res){
		application.app.controllers.home.filtrar(application, req, res);
	});

	application.get('/editar', function(req, res){
		application.app.controllers.home.editar(application, req, res);
	});
}