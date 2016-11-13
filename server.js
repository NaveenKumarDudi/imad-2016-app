var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');


app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var config = {
	user:'naveenkumardudi',
	database:'naveenkumardudi',
	host:'db.imad.hasura-app.io',
	port:'5432',
	password: "db-naveenkumardudi-66779"
	
};
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

var pool = new Pool(config);
app.get('/test-db',function(req,res){
	pool.query('select * from users',function(err,result){
		if(err){
			res.status(500).send(err.toString());
		}
		else{
			res.send(JSON.stringify(result));
		}
	});
});

function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return  ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

//-------------Post Request Part ---- ////


app.post('/contact',function(){
	var name = req.body.name;
	var mail = req.body.mail;
	var web = req.body.web;
	var msg = req.body.msg;

	pool.query('INSERT INTO "contact" VALUES($1, $2, $3, $4)',[name, mail, web, msg], function(err, result){
		if(err){
			re.status(500).send(err.toString());
		}
		else{
			res.send("Success");
		}
	})
});

app.post('/register', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "users" (uname, upass) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send("Success");
      }
   });
});


//-------Login----------//
app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;

   pool.query('SELECT * FROM "users" WHERE uname = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].upass;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {

                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}

                res.send('credentials correct!');

              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});
app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

app.get('/check', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "users" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].uname);
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/index',function(req, res){
	pool.query('select * from users',function(err,result){
		if(err){
			res.status(500).send(err.toString());
		}
		else{
			res.send(JSON.stringify(result));
		}
	});
});


app.get('/resume.pdf',function(req,res){
	res.sendFile(path.join(__dirname,'ui/resume','resume.pdf'));
});
// footer link

app.get('/http://naveenkumardudi.imad.hasura-app.io',function(req,res){
	res.sendFile(path.join(__dirname,'ui','index.html'));
});

//To get index page
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'ui','index.html'));
});

app.get('/index.html',function(req,res){

	res.sendFile(path.join(__dirname,'ui','index.html'));
});

app.get('/skills.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','skills.html'));
});

app.get('/work.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','work.html'));
});

app.get('/resume.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','resume.html'));
});

app.get('/skills.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','skills.html'));
});

//to include css file

app.get('/style.css',function(req,res){
	res.sendFile(path.join(__dirname,'ui/css','style.css'));
});


// to include javascript files

app.get('/main.js',function(req,res){
	res.sendFile(path.join(__dirname,'ui/js','main.js'));
});

// to include images from image folder



app.get('/logo.png',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images','logo.png'));
});


// Profile page images inlude path

app.get('/nav.jpg',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','nav.jpg'));
});

// profile page response

app.get('/profile.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','profile.html'));
});

app.get('/login.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','login.html'));
});

app.get('/register.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','register.html'));
});

app.get('/test.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','test.html'));
});


//To run Server on following Port
var port = 8080;
app.listen(8080,function(){
	console.log(`Server Running on port ${port}`);
});