//Constants
var ajaxToExecute = new Array();
var localToServerDifference = Timing.getCurrentServerTime() - new Date();
var server = "ch36.staemme.ch";

//AttackManager
function sendAttack(villageId, time){
  var form;

  //Access Place
  $.ajax({
    url: "https://"+ server +"/game.php?village="+ villageId +"&screen=place",
    type: "GET",
    success: function(e){
      form = $(e).find('#command-data-form');
    },
    async: false
  });

  //Data Creation of serialized attack
  var strange = form.find('> input[type="hidden"]:nth-child(1)');
  var data = strange.attr("name") + "=" + strange.attr("value") + "&source_village=1332&spear=10&sword=0&axe=&archer=&spy=&light=&marcher=&heavy=&ram=&catapult=&knight=&snob=&x=537&y=518&target_type=coord&input=&attack=Agriffe";

  //Don't get catched ;P
  sleep(500);

  //Load Confirm Page
  $.ajax({
    url: form.attr("action"),
    type: form.attr("method"),
    data: data,
    success: function(e){
      form = $(e).find('#command-data-form')
    },
    async: false
  });

  //Create Data to Confirm Attack
  var ajaxData = {
    url: form.attr("action"),
    type: form.attr("method"),
    data: form.serialize(),
    async: false
  };

  //Put it to Global Store of Ajax requests
  ajaxToExecute.push({time, ajaxData});
}

//Time
function getServerTime(){
  return new Date(new Date().getTime() + localToServerDifference);
}

function milisecondsUntil(date){
  var now = getServerTime();
  var millisUntil = date.getTime() - now.getTime();
  return millisUntil;
}

function sleep(miliseconds) {
   var currentTime = new Date().getTime();
   while (currentTime + miliseconds >= new Date().getTime()) {
   }
 }

 setInterval(function(){
   handle();
}, 5000);


//Handler
function handle(){
  ajaxSoonToBeExecutet = ajaxToExecute.filter(function(i){
    return new Date()  - i.time < 10000
  });

  for (var i = 0; i < ajaxSoonToBeExecutet.length; i++) {
    var miliSecondsUntil = milisecondsUntil(ajaxSoonToBeExecutet[i].time);
    (function(e){
      setTimeout(function(){
        $.ajax(e);
      }, miliSecondsUntil);
    })(ajaxSoonToBeExecutet[i].ajaxData);
    ajaxToExecute.splice(ajaxSoonToBeExecutet[i]);
  }
}

//Initializing UI For User
function initialize(){
  //Clear Area
  $("#questlog").html("");
  $("#header_info").html("");
  $("#topContainer").html("");
  $("#quickbar_outer").html("");
  $("#content_value").html("");

  //title
  $("#content_value").append("<h1>Lucas Mansion :D</h1>");

  //Welcome Text
  $("#content_value").append("<p>Bitte nicht erschrecken, dieses UI ist für dich, um dir Stämme zu erleichtern alle Grundfunktionen "
    + "wurden entfernt, damit auch nichts schlimmes passieren kann. Wenn du die Seite neu lädst(F5) sind alle deine Einstellungen weg. "
    + "Ich wünsche dir viel Spass :)</p>");

  //mainbuilding
  $("#content_value").append("<div id='mainbuilding'></div>");

  $.ajax({
    type: "GET",
    url: "/game.php?screen=main",
    success: function(e){
      $("#mainbuilding").append($(e).find("#content_value").html());
    }
  });
  sleep(500);

  //modifiedPlace
  $("#content_value").append("<div id='modifiedPlace'></div>");

  $.ajax({
    type: "GET",
    url: "/game.php?screen=place",
    success: function(e){
      $("#modifiedPlace").append($(e).find("#content_value").html());
    }
  });
  sleep(500);




  //neu laden verhindern
  window.onbeforeunload = function (e) {
    return 'Bist du dir Sicher? Dein ganzer Spielstand geht verloren.';
  };
}

//Testing

//Attack
/*
var now = new Date(Timing.getCurrentServerTime());
var timeToSend = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() + 15, 0);
console.log(timeToSend.toJSON());

sendAttack(1332, timeToSend);
*/

//UI
initialize();
