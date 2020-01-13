
state = {
	selected : false,
	enteredGame : "",
	playername : "",
	playerid : 0,
	gameStarted : false,
};

result = undefined;
myvar = 0;

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


$(document).ready(function() {
    
    $("#enterNameBlock").fadeOut();

	$("#readyBlock").fadeOut();
	$("#gameBlock").fadeOut();
	$("#readyMsg").fadeOut();

	loadGames();
	
	$("#choosegameform [name=choose]").click(function() {
		state.enteredGame = $("#choosegameform [name=selectGame]").val();
		result = sendGame();
		if (result =="success"){
			$("#gamename").append("<h3>"+state.enteredGame+"</h3><br>")
		}
		return false;
	});

	$("#enterNameBlock [name=joinGame]").click(function (){
		state.playername = $("#enterNameBlock [name=name]").val();
	 	state.playerid = $("#enterNameBlock [name=id]").val();
	 	result = sendJoin(state.playername,state.playerid);
	 	if (result =="success"){
			$("#gamename").append("<h5>"+ "Hi, " +state.playername+"</h5>");
		}
		return false;
	});

	$("#readyBlock [name=readyOk]").click( function(){
		$("#readyBlock").fadeOut();
		result = sendReady();
		$("#readyMsg").fadeIn();
		$("#readyMsg").append("<h3>You are ready, "+state.playername+". Game will start if all players became ready!</h3>");
		myvar = setInterval(function(){
			result = checkReady();
			if (result == "yes"){
				return;
			}
		},500);
	});

	if(state.gameStarted){
		$("#readyMsg").html("");
		$("#readyMsg").append("<h3>Nice</h3>");
		$("#gameBlock").fadeIn();		
	}

	 
	//if choosen enterNameBlock will fade in
});

function sendReady(){
	$.getJSON(state.enteredGame + "/" + state.playerid + "/start", function (data){
		return;
	});
	return "success";
}

function checkReady(){
	var result;
	$.getJSON(state.enteredGame + "/" + state.playerid + "/checkready", function (data){
		if (data.result == "yes"){
			result = "yes";
			clearInterval(myvar);
			state.gameStarted = true;
		}
		else{
			result = "no";
		}
	});
	return result;
}


function sendJoin(name, id){
	$.ajaxSetup({beforeSend: function(xhr, settings) {
			xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
			}});
	$.post(state.enteredGame + "/" + "ready",{'playername':name, 'playerid':id}, function (data){
		$("#enterNameBlock").fadeOut();
		$("#readyBlock").fadeIn();
		return;
	});
	return "success";		
}

function sendGame(){
	$.ajaxSetup({beforeSend: function(xhr, settings) {
			xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
			}});
	$.post(state.enteredGame,{'game':state.enteredGame}, function (data){
		$("#chooseBlock").fadeOut();
		$("#enterNameBlock").fadeIn();
		return;
	});
	return "success";
}

function loadGames() {
	// body...
	$.get('/rulebasedgame/loadgames',function(data) {
		// body...
		for (var i = data.obj.length - 1; i >= 0; i--) {
			$("#choosegameform [name=selectGame]").append("<option value='" +data.obj[i] +"'>"+data.obj[i] +"</option>");
		}
		
	});
}