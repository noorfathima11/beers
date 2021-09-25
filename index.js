var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var db = new sqlite3.Database('./database/beers.db');

var bodyParser = require("body-parser");

server.listen(3000, function () {
    console.log("Server listening on port: 3000")
});

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.run('CREATE TABLE IF NOT EXISTS beers(id INTEGER, name TEXT, image_url TEXT, description TEXT)');

app.get('/', function (req, res) {
    res.send("<h3> Welcome to beers page <h3>");
});

// Read the entry

app.get('/beer/:id', function (req, res) {
    db.serialize(() => {
        db.each('SELECT id ID, name NAME FROM beers WHERE id =?', [req.params.id], function (err, row) {
            if (err) {
                res.send("Error encountered while displaying");
                return console.error(err.message);
            }
            res.send(` ID: ${row.ID},    Name: ${row.NAME}`);
            console.log("Entry displayed successfully");
        });
    });
});

// Create entry post request

app.post("/api/beer/", (req, res, next) => {
    var data = {
        id: req.body.id,
        name: req.body.name,
        image_url: req.body.image_url,
        description : req.body.description
    }
    var sql ='INSERT INTO beers (id, name, image_url, description) VALUES (?,?,?, ?)'
    var params =[data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// Create entry usign URL params

// app.get('/add/:id/:name/:image_url/:description', function (req, res) {
//     db.serialize(() => {
//         db.run('INSERT INTO beers(id,name,image_url,description) VALUES(?,?,?,?)', [req.params.id, req.params.name, req.params.image_url, req.params.description], function (err) {
//             if (err) {
//                 return console.log(err.message);
//             }
//             console.log("New employee has been added");
//             res.send("New employee has been added into the database with ID = " + req.params.id + " and Name = " + req.params.name);
//         });
//     });
// });


// Update entry, can be extended for dexcription and imag_url

app.get('/update/:id/:name', function(req,res){
    db.serialize(()=>{
      db.run('UPDATE beers SET name = ? WHERE id = ?', [req.params.name,req.params.id], function(err){
        if(err){
          res.send("Error encountered while updating");
          return console.error(err.message);
        }
        res.send("Entry updated successfully");
        console.log("Entry updated successfully");
      });
    });
  });

// Delete

app.get('/del/:id', function(req,res){
    db.serialize(()=>{
      db.run('DELETE FROM beers WHERE id = ?', req.params.id, function(err) {
        if (err) {
          res.send("Error encountered while deleting");
          return console.error(err.message);
        }
        res.send("Entry deleted");
        console.log("Entry deleted");
      });
    });
  });


