var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');


app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var config = {
	user:'naveenkumardudi',
	database:'naveenkumardudi',
	host:'db.imad.hasura-app.io',
	port:'5432',
	password: 'db-naveenkumardudi-66779'
};

var pool = new Pool(config);
app.get('/test-db',function(req,res){
	pool.query('select * from user',function(err,result){
		if(err){
			res.status(500).send(err.toString());
		}
		else{
			res.send(JSON.stringify(result));
		}
	});
});

function hash(input,salt){
	var hashed = crypto.pbkdf2Sync(input,salt, 10000, 512, 'sha512');
	return ['pbkdf2Sync','10000',salt,hashed.toString('hex')].join('$');
}

// for Login page Post request

app.get('/hash/:input',function(req,res){
	var hashString = hash(req.params.input,'salt');
	res.send(hashString);
});


app.post('/register', function (req, res) {
	var user = req.body.username;
	var pass = req.body.password;
	var error = req.body.error;
	var salt = crypto.randomBytes(128).toString('hex');
  	var dbString = hash(pass, salt);
   	pool.query('INSERT INTO "users" (uname, upass) VALUES ($1, $2)', [user, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.redirect('Login.html');
      }
   });
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

//To run Server on following Port
var port = 8080;
app.listen(8080,function(){
	console.log(`Server Running on port ${port}`);
});