module.exports.alterar_comentario = function (application, req, res) {
    var connection = application.config.dbConnection();

    connection.open(function (err, mongoclient) {
        mongoclient.collection('postagens', function (err, collection) {
            collection.update({
                    _id: ObjectID(req.params.id)
                }, {
                    $push: {
                        comentarios: {
                            id_comentario: new ObjectID(),
                            comentario: req.body.comentario
                        }
                    }
                }, {},

                function (err, records) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(records);
                    }
                });
            mongoclient.close();

        });
    });
}

module.exports.deletar_comentario = function (application, req, res) {
    var connection = application.config.dbConnection();
    connection.open(function (err, mongoclient) {
        mongoclient.collection('postagens', function (err, collection) {
            collection.update({}, {
                    $pull: {
                        comentarios: {
                            id_comentario: ObjectID(req.params.id)
                        }
                    }
                },

                {
                    multi: true
                }

                ,



                function (err, records) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(records);
                    }

                    mongoclient.close();
                });


        });
    });
}