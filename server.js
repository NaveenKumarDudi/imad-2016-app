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
	password: process.env.DB_PASSWORD
	
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

// ------------ Article page Template ----------///

function template(data){
	var title = data.title;
	var heading = data.heading;
	var content = data.content;
	var comment = data.comment;

	var temp = `
			<div class="col-md-4"><h3 class="display-1" style="color:white">${heading}</h3></div></div>
			<div class="row">
				<div class="col-md-8 col-md-offset-2">${content}</div>
			</div>
			<div class="row">
				<h3 class="display-1" style="color:white;">Comment</h3>
				<div class="col-md-2 col-md-offset-2">

				</div>
				<div class="col-md-6 col-md-offset-2">
				</div>
			</div>

	`;
	return temp;
}


app.get('index.html',function(req, res){

	pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
})  ;



app.get('/resume.pdf',function(req,res){
	res.sendFile(path.join(__dirname,'ui/resume','resume.pdf'));
});
// footer link


//To get index page
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'ui','index.html'));
});

app.get('/index.html',function(req,res){

	res.sendFile(path.join(__dirname,'ui','index.html'));
});

//to include css file

app.get('/style.css',function(req,res){
	res.sendFile(path.join(__dirname,'ui/css','style.css'));
});
app.get('/style1.css',function(req,res){
	res.sendFile(path.join(__dirname,'ui/css','style1.css'));
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


//  prev build

app.get('/ui/style1.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style1.css'));
});
app.get('/max.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'max.css'));
});
app.get('/web.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images/profile', 'web.jpg'));
});
app.get('/web1.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images/profile', 'web1.png'));
});
app.get('/cp.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images/profile', 'cp.png'));
});
app.get('/python.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images/profile', 'python.png'));
});
app.get('/java.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images/profile', 'java.png'));
});
app.get('/cpp.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images/profile', 'cpp.png'));
});
app.get('/wb.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images/profile', 'wb.jpg'));
});

app.get('/c.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images/profile', 'c.jpg'));
});

app.get('/prev.html',function(req, res){
	res.sendFile(path.join(__dirname,'ui','prev.html'));
});
//To run Server on following Port
var port = 8080;
app.listen(8080,function(){
	console.log(`Server Running on port ${port}`);
});