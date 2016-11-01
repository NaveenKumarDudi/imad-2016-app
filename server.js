var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/max.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'max.css'));
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/ui/web.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'web.jpg'));
});
app.get('/ui/web1.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'web1.png'));
});
app.get('/ui/cp.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'cp.png'));
});
app.get('/ui/python.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'python.png'));
});
app.get('/ui/java.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'java.png'));
});
app.get('/ui/cpp.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'cpp.png'));
});
app.get('/ui/wb.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'wb.jpg'));
});

app.get('/ui/c.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'c.jpg'));
});

app.get('/ui/logo.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'logo.png'));
});
app.get('/ui/1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', '1.jpg'));
});
app.get('/ui/resume.jpeg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'resume.jpeg'));
});
app.get('/ui/resume1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'resume1.jpg'));
});
app.get('/ui/nav.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'nav.jpg'));
});
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
