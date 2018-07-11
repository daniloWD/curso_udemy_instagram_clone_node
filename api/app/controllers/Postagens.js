fs = require('fs'),

module.exports.postagens = function (application, req, res) {
    var connection = application.config.dbConnection();

        connection.open(function (err, mongoclient) {
            mongoclient.collection('postagens', function (err, collection) {
                collection.find().toArray(function (err, results) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(results);
                    }
                    mongoclient.close();
                });
            });
        });

    


}

module.exports.postagensImg = function (application, req, res) {
   
        var img = req.params.imagem;

        fs.readFile('./uploads/' + img, function (err, content) {
            if (err) {
                res.status(400).json(err);
                return;
            }

            res.writeHead(200, {
                'content-type': 'image/jpg'
            });
            res.end(content);
        });

    
}