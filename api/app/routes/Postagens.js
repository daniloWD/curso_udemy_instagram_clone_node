module.exports = function (application) {
    application.get('/imagens/:imagem', function (req, res) {
        application.app.controllers.Postagens.postagensImg(application, req, res);
    });



    application.get('/api', function (req, res) {
        application.app.controllers.Postagens.postagens(application, req, res);
    });
}

