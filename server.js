var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 8080;
var socket = require('socket.io');
const path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
require('./config/passport')(passport);
var mysql = require('mysql');
var dbconfig = require('./config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database)

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
 extended: true
}));
var crypto = require('crypto');

app.set('view engine', 'ejs');

app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

var server = app.listen(port);
console.log("Port: " + port);


/////////////////////////////////////////////////// 

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


var io = socket(server);

io.on('connection', socket  => {

    console.log('nuevo usuario');
  });


///////////////////////////////////////////////
function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','mAuR1c10***');
    var encrypted = cipher.update(text.toString(),'utf8','hex') + cipher.final('hex');
    return encrypted;
    }

function decrypt(text){
    var decipher = crypto.createDecipher('aes-256-cbc','mAuR1c10***');
    var decrypted = decipher.update(text.toString(),'hex','utf8') + decipher.final('utf8');
    return decrypted ;
    }

//////////////////////////////////////////////////

io.on('connection', async socket => {

    console.log('made socket connection', socket.id);

   
   
    socket.on('chat', function(data){

        var mensajeEncriptado = encrypt(data.message);
        console.log('encriptado: ' + mensajeEncriptado );
        io.sockets.emit('chat', data);
             
    });

   
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    socket.on('notificacion', function(data){
        socket.broadcast.emit('notificacion', data);
    });

    socket.on('desencriptar', function(data){
        try {
            var mensajeDesencriptado = decrypt(mensajeEncriptado);
            socket.broadcast.emit('desencriptar', mensajeDesencriptado);
            
        } catch (error) {
            console.log(error);
        }
       
    });

});