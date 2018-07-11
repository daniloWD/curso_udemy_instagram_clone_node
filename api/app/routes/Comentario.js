module.exports = function (application) {
    application.put('/api/:id', function (req, res) {
        application.app.controllers.Comentario.alterar_comentario(application, req, res);
    });
    
    application.delete('/api/:id', function (req, res) {
        application.app.controllers.Comentario.deletar_comentario(application, req, res);
    });
}