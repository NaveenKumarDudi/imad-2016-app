function loadLoginForm () {
 var loginHtml = `
       <div class="row rowDist">
				<div class="col-md-6 col-md-offset-3">
					<input type="text" id="username" placeholder="Username" class="form-control">
				</div>
			</div>
			<div class="row rowDist">
				<div class="col-md-6 col-md-offset-3">
					<input type="password" id="password" placeholder="Password" class="form-control">
				</div>
			</div>
			<div class="row rowDist">
				<div class="col-md-4 col-md-offset-3">
					<input type="submit" value="Register" id="register_btn" class="btn btn-primary">
					<input type="submit" value="Login" id="login_btn" class="btn btn-primary">
				</div>
			</div>
        `;
        document.getElementById('myform').innerHTML=loginHtml;
        // REgistration code
var register = document.getElementById('register_btn');
    register.onclick = function() {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };

        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        request.open('POST', '/register', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    };

// LOgin code
var submit = document.getElementById('login_btn');
    submit.onclick = function() {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Sucess!';
              } else if (request.status === 403) {
                  alert('Invalid credentials. Try again?');
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    };
    // contact page 
    var contact = document.getElementById('contSubmit');
    contact.onclick = function(){
    	var req = new XMLHttpRequest();

    	req.onreadystatechange = function(){
    		if(req.status === XMLHttpRequest.DONE){
    			if(req.status === 200){
    				alert("Send Successful");
    			}
    			else{
    				alert("ERROR IN SENDING");
    			}
    		}
    	};
    	var name = document.getElementById('name').value;
    	var mail = document.getElementById('mail').value;
    	var web = document.getElementById('web').value;
    	var msg = document.getElementById('messege').value;
    	req.open('POST','/conatct', true);
    	req.setRequestHeader('Content-Type', 'application/json');
    	req.send(JSON.stringify({name: name, mail: mail, web: web, msg: msg}));
    };
}
function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
        <a href="/logout">Logout</a>
    `;
    var submitArticle = document.getElementById('subArticle');
    submitArticle.innerHTML = `
    	<div class="jumbotron" style="margin-top:15px; background-color:rgba(0,0,0,.2);">
		<input type="text" id="title" placeholder="Title" class="form-control"><br/>
		<input type="text" id="heading" placeholder="Heading" class="form-control"><br/>
		<textarea class="form-control" id="content" placeholder="Content"></textarea><br/>
		<input type="submit" class="btn btn-primary" id="subart" value="Submit"><br/>
	</div>
    `;
}


function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check', true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!
loadLogin();
