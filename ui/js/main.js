$(document).ready(function () {
    $('.carousel').carousel('cycle');
});

var register = document.getElementById('rsubmit');
    register.onclick = function () {
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
        var username = document.getElementById('register_name');
        var password = document.getElementById('register_password');
        request.open('POST', 'http://localhost:8080/register', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username:username, password:password}));  
        register.value = 'Registering...';
    
};
