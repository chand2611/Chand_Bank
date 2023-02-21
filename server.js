const express = require('express');
const path = require("path")
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.urlencoded());
app.use(express.json());
const mysql = require('mysql');

const {
    forEach
} = require('lodash');



var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: 'ayanbank'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "views")));


app.listen(4000);


app.get('/', (req, res) => {
    res.render('index');
});
app.get('/index', (req, res) => {
    res.render('index');
});


app.get('/viewtransaction', function (req, res) {

    var sql = "SELECT * FROM transaction";
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {

            res.render('viewtransaction', {
                trns: result
            });



        }
    });
});

app.get('/transfermoney', async function (req, res) {

    var sql = "SELECT * FROM customers";

    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {

            res.render('transfermoney', {
                Allo: result
            });

        }

    });

});


app.post('/action', function (req, res) {

    const amount = req.body.Amount;
    const to = req.body.too;
    const from = req.body.frm;

    var qe = "INSERT INTO `transaction`(`from`,`to`, `tamount`)VALUES(?,?,?)";
    const VALUES = [from, to, amount];


    con.query(qe, VALUES, function (err, result) {
        if (err) {
            throw err;
        } else {

            console.log("Transaction updated successfully");

        }
    });

    var sql = "SELECT * FROM transaction";
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {

            res.render('viewtransaction', {
                trns: result
            });

        }
    });

    var updt1 = "UPDATE customers SET Amount=Amount+? WHERE Name=?";

    const VAL = [parseInt(amount), to];
    con.query(updt1, VAL, function (err, result) {
        if (err) {
            throw err;
        } else {

            console.log("Amount Updated");

        }
    });

    var updt2 = "UPDATE customers SET Amount=Amount-? WHERE Name=?";

    const VAL2 = [parseInt(amount), from];
    con.query(updt2, VAL2, function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log("Amount Updated");
        }
    });




});
