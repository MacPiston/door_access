const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: "door_access"
});

connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * from users", function (error, results, fields) {
        if (err) throw err;
        console.log(results);
        //connection.end();
    });
});




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('loginRequest', (data) => {
        console.log("Login user email=" + data.email + " with password=" + data.password);

        var loginQuery = 'SELECT * from door_access.users WHERE email = "' + data.email + '" AND password = "' + data.password + '"';

        console.log(loginQuery);

        connection.query(loginQuery, function (error, result, field) {
            if (error) throw error;
            if (result.length > 0) {
                console.log("Login succes");
                socket.emit('loginRequest', ("true"));
            }
            else {
                console.log("Login not succes");
            }

        });
    });

});