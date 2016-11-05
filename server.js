var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');
app.use(morgan('combined'));
app.use(bodyParser.json());
var config = {
	user:'naveenkumardudi',
	database:'naveenkumardudi',
	host:'db.imad.hasura-app.io',
	port:'5432',
	password: process.env.DB_PASSWORD
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

app.get('/register.html',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var salt = crypto.RandomBytes(128).toString('hex');
	var dbstring = hash(password,salt);
	pool.query('INSERT INTO "user" (username,password) VALUES($1,$2)',[username,dbstring],function(err,result){
		if(err){
			res.status(500).send(err.toString());
		}
		else{
			res.send('Register Successful' + username);
		}
	});
});


// footer link

app.get('/http://naveenkumardudi.imad.hasura-app.io',function(req,res){
	res.sendFile(path.join(__dirname,'ui','index.html'));
});

//To get index page

app.get('/index.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','index.html'));
});

app.get('/login.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','login.html'));
});

app.get('/register.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','register.html'));
});

app.get('/feedback.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','feedback.html'));
});


app.get('/about.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','about.html'));
});

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'ui','index.html'));
});

//to get view article page
app.get('/article.html',function(req,res){
	res.sendFile(path.join(__dirname,'ui','article.html'));
});

//to include css file

app.get('/style.css',function(req,res){
	res.sendFile(path.join(__dirname,'ui/css','style.css'));
});

app.get('/max.css',function(req,res){
	res.sendFile(path.join(__dirname,'ui/css','max.css'));
});

// to include javascript files

app.get('/main.js',function(req,res){
	res.sendFile(path.join(__dirname,'ui/js','main.js'));
});

// to include images from image folder

app.get('/1.jpg',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images','1.jpg'));
});

app.get('/background.png',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images','background.png'));
});

app.get('/logo.png',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images','logo.png'));
});


// Profile page images inlude path

app.get('/1.jpg',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','1.jpg'));
});

app.get('/c.jpg',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','c.jpg'));
});

app.get('/cp.png',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','cp.png'));
});

app.get('/cpp.png',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','cpp.png'));
});

app.get('/java.png',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','java.png'));
});

app.get('/nav.jpg',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','nav.jpg'));
});

app.get('/python.png',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','python.png'));
});

app.get('/wb.jpg',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','wb.jpg'));
});

app.get('/web.jpg',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','web.jpg'));
});

app.get('/web1.png',function(req,res){
	res.sendFile(path.join(__dirname,'ui/images/profile','web1.png'));
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