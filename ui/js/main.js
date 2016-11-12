/*$(document).ready(function(){
	var cname = $('#name').val();
	var cmail = $('#mail').val();
	var cweb = $('#web').val();
	var cmsg = $('#msg').val();
	$("#contSubmit").onclick(function(){
	$.post('/contact',{
		name: "cname",
		mail: "cmail",
		web: "cweb",
		msg: "cmsg"
	},
	function(data,status){
		alert("Messege Sent Successful");
	});
});
});*/
var sub = document.getElementById('contSubmit');
sub.onclik(function(){
var res = new XMLHttpRequest();
res.onredystatechange = function(){
		if(this.readyState === 4 && this.status === 200){
			alert("Messege Sent Successful");
		}
		else(this.status === 403){
			alert("error in sending Try again");
		}
		else(this.status === 500){
			alert("Server Error");
		}
	};
	var cname = document.getElementById('name').value;
	var cmail = document.getElementById('mail').value;
	var cweb  = document.getElementById('web').value;
	var cmsg =  document.getElementById('messege').value;
	res.open("POST","http://localhost:8080/contact",true);
	res.send(JSON.stringify({name:cname,mail:cmail,web:cweb,msg:cmsg}));
});

