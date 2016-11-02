var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var app = express();
app.use(morgan('combined'));

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


//To get index page



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

//To run Server on following Port
var port = 8080;
app.listen(8080,function(){
	console.log(`Server Running on port ${port}`);
});