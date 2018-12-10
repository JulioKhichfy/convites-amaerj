module.exports = function(application){

	//var multer  = require('multer');
	//var upload = multer({ dest: './app/uploads'});

	application.get('/index', function(req, res){
		application.app.controllers.home.index(application, req, res);
	});

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

	application.get('/administrar', function(req, res){
		application.app.controllers.home.administrar(application, req, res);
	});

	/*application.post('/upload',  upload.single('avatar'), function (req, res, next) {
		application.app.controllers.home.upload(application, req, res);
	});*/


	application.get('/remover-arquivo', function(req, res){
		application.app.controllers.home.removerArquivo(application, req, res);
	});

	application.post('/upload', function(req, res) {
		application.app.controllers.home.upload(application, req, res);
  	});
	
	application.get('/download', function(req, res){
		var path_and_file = req.query["path"];
  		var file = path_and_file;
  		res.download(file); // Set disposition and send it.
	});

	
	application.post('/administrar/bd', function(req, res) {
		application.app.controllers.home.importarTodaBaseDados(application, req, res);
  	});

  	application.post('/administrar/update/table', function(req, res) {
		application.app.controllers.home.updateTableFromExcel(application, req, res);
  	});

  	application.post('/administrar/create/table', function(req, res) {
		application.app.controllers.home.createTableFromExcel(application, req, res);
  	});

  	application.post('/administrar/create/only/table', function(req, res) {
		application.app.controllers.home.createOnlyTable(application, req, res);
  	});
  	

	

	/***EVENTOS***/

	application.get('/eventos', function(req, res){
		application.app.controllers.home.eventos(application, req, res);
	});

	application.get('/eventos/novo', function(req, res){
		application.app.controllers.home.novoevento(application, req, res);
	});

	application.get('/eventos/detalhes', function(req, res){
		application.app.controllers.home.detalhesevento(application, req, res);
	});

	application.post('/eventos/detalhes/salvar-observacao', function(req, res){
		application.app.controllers.home.salvarObservacaoDetalhesEvento(application, req, res);
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
		application.app.controllers.home.getConvidadosFromSelectEventos(application, req, res);
	});

	application.get('/eventos/removerdalista', function(req, res){
		application.app.controllers.home.removerdalista(application, req, res);
	});

}