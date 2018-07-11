

var express = require('express'),
bodyParser = require('body-parser'),
multiParty = require('connect-multiparty'),
fs = require('fs'),
cors = require('cors');
ObjectID = require('mongodb').ObjectId,
consign = require('consign');


var app = express();




app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({}));
app.use(multiParty());
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader("Acess-Control-Allow-Origin", "*");
    res.setHeader("Acess-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Acess-Control-Allow-Headers", "content-type");
    res.setHeader("Acess-Control-Allow-Credentials", true);
    
    next();
});

consign()
    .include('app/routes')
    .then('config/dbConnection.js')
    .then('app/models')
    .then('app/controllers')
    .into(app);

var connection = app.config.dbConnection();


app.get('/', function (req, res) {
res.send({
    msg: 'Olá'
})
});

app.route('/api')
// .get(function (req, res) {

//     connection.open(function (err, mongoclient) {
//         mongoclient.collection('postagens', function (err, collection) {
//             collection.find().toArray(function (err, results) {
//                 if (err) {
//                     res.json(err);
//                 } else {
//                     res.json(results);
//                 }
//                 mongoclient.close();
//             });
//         });
//     });

// })
.post(function (req, res) {

    // res.setHeader("Access-Control-Allow-Origin", "*");

    var date = new Date();
    time_stamp = date.getTime();

    var url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;

    var path_origem = req.files.arquivo.path;

    var path_destino = './uploads/' + url_imagem;

    fs.rename(path_origem, path_destino, function (err) {
        if (err) {
            res.status(500).json({
                error: err
            });
            return;
        }

        var dados = {
            url_imagem: url_imagem,
            titulo: req.body.titulo
        }

        connection.open(function (err, mongoclient) {
            mongoclient.collection('postagens', function (err, collection) {
                collection.insert(dados, function (err, records) {
                    if (err) {
                        res.json({
                            'status': 'erro'
                        });
                    } else {
                        res.json({
                            'status': 'inclusão realizada com sucesso'
                        });
                    }
                    mongoclient.close();
                });
            });
        });
    });
});

// app.route('/imagens/:imagem')
// .get(function (req, res) {
//     var img = req.params.imagem;

//     fs.readFile('./uploads/' + img, function (err, content) {
//         if (err) {
//             res.status(400).json(err);
//             return;
//         }

//         res.writeHead(200, {
//             'content-type': 'image/jpg'
//         });
//         res.end(content);
//     });

// });


app.route('/api/:id')
// Get by ID(ready)
.get(function (req, res) {
    connection.open(function (err, mongoclient) {
        mongoclient.collection('postagens', function (err, collection) {
            collection.find(ObjectID(req.params.id)).toArray(function (err, results) {
                if (err) {
                    res.json(err);
                } else {
                    res.status(200).json(results);
                }
                mongoclient.close();
            });


        });
    });
})
// Put by ID(update)
// .put(function (req, res) {
//     connection.open(function (err, mongoclient) {
//         mongoclient.collection('postagens', function (err, collection) {
//             collection.update({
//                     _id: ObjectID(req.params.id)
//                 }, {
//                     $push: {
//                         comentarios: {
//                             id_comentario: new ObjectID(),
//                             comentario: req.body.comentario
//                         }
//                     }
//                 }, {},

//                 function (err, records) {
//                     if (err) {
//                         res.json(err);
//                     } else {
//                         res.json(records);
//                     }
//                 });
//             mongoclient.close();

//         });
//     });
// })
// Delete by ID(update)
// .delete(function (req, res) {


//     connection.open(function (err, mongoclient) {
//         mongoclient.collection('postagens', function (err, collection) {
//             collection.update({}, {
//                     $pull: {
//                         comentarios: {
//                             id_comentario: ObjectID(req.params.id)
//                         }
//                     }
//                 },

//                 {
//                     multi: true
//                 }

//                 ,



//                 function (err, records) {
//                     if (err) {
//                         res.json(err);
//                     } else {
//                         res.json(records);
//                     }

//                     mongoclient.close();
//                 });


//         });
//     });
// })

module.exports = app;