var Time = {
  localToServerDifference: Timing.getCurrentServerTime() - new Date(),
  getServerTime: function(){
    return new Date(new Date().getTime() + localToServerDifference);
  },
  milisecondsUntil: function (date){
    var now = Time.getServerTime();
    var millisUntil = date.getTime() - now.getTime();
    return millisUntil;
  },
};

var UserInterface = {
  initialize : function(){
    UserInterface.clearArea();
    //title
    $("#content_value").append("<h1>Lucas Mansion :D</h1>");

    //Welcome Text
    $("#content_value").append("<p>Bitte nicht erschrecken, dieses UI ist für dich, um dir Stämme zu erleichtern alle Grundfunktionen "
      + "wurden entfernt, damit auch nichts schlimmes passieren kann. Wenn du die Seite neu lädst(F5) sind alle deine Einstellungen weg. "
      + "Ich wünsche dir viel Spass :)</p>");

    //Navigation
    $("#content_value").append("<div id='navigation'><h2>Navigation</h2>" +
      "<a class='btn' href='javascript:void(0)' onclick='UserInterface.loadMain()'>Hauptgebäude</a>" +
      "<a class='btn' href='javascript:void(0)' onclick='UserInterface.loadPlace()'>Versammlungsplatz</a>" +
      "</div>");

    //create gameData
    $("#content_value").append("<div id='gameData'></div>");

    //neu laden verhindern
    window.onbeforeunload = function (e) {
      return 'Bist du dir Sicher? Dein ganzer Spielstand geht verloren.';
    };
  },
  clearArea: function(){
    $("#questlog").html("");
    $("#header_info").html("");
    $("#topContainer").html("");
    $("#quickbar_outer").html("");
    $("#content_value").html("");
  },
  loadMain : function(){
    $.ajax({
      type: "GET",
      url: "/game.php?screen=main",
      success: function(e){
        $("#gameData").html($(e).find("#content_value").html());
      }
    });
  },
  loadPlace: function(){
    $.ajax({
      type: "GET",
      url: "/game.php?screen=place",
      success: function(e){
        $("#gameData").html($(e).find("#content_value").html());
        $("#command_target > table").html("<div id='coordinates'><div>");
        var x = $("#inputx").detach();
        var y = $("#inputy").detach();
        $("#coordinates").append("<label>x:</label>")
        $("#coordinates").append(x.show());
        $("#coordinates").append("<label>y:</label>")
        $("#coordinates").append(y.show());
      }
    });
  }
};

var TroopMovementManager = {
  sendAttack: function (villageId, time, x, y, spear, sword, axe, archer, spy, light, marcher, heavy, ram, catapult, knight, snob){
    var form;
    //Access Place
    $.ajax({
      url: "/game.php?village="+ villageId +"&screen=place",
      type: "GET",
      success: function(e){
        form = $(e).find('#command-data-form');
      },
      async: false
    });

    //Data Creation of serialized attack
    var strange = form.find('> input[type="hidden"]:nth-child(1)');
    var data = strange.attr("name") + "=" + strange.attr("value") + "&source_village="+ villageId +"&spear="+ spear +
      "&sword="+ sword +"&axe="+ axe +"&archer="+ archer +"&spy="+ spy +"&light="+ light +"&marcher="+ marcher +
      "&heavy="+ heavy +"&ram="+ ram +"&catapult="+ catapult +"&knight="+ knight +"&snob="+ snob +"&x="+ x +"&y="+ y +
      "&target_type=coord&input=&attack=Agriffe";

    (function(form, data){
      setTimeout(function(){
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
        Handler.addAjax(time, ajaxData);
      }, 500);
    })(form, data);
  },
};

var Handler = {
  ajaxToExecute: new Array(),
  handle: function (){
    ajaxSoonToBeExecutet = Handler.ajaxToExecute.filter(function(i){
      return new Date()  - i.time < 10000
    });

    for (var i = 0; i < ajaxSoonToBeExecutet.length; i++) {
      var miliSecondsUntil = TWBot.timing.milisecondsUntil(ajaxSoonToBeExecutet[i].time);
      (function(e){
        setTimeout(function(){
          $.ajax(e);
        }, miliSecondsUntil);
      })(ajaxSoonToBeExecutet[i].ajaxData);
      Handler.ajaxToExecute.splice(ajaxSoonToBeExecutet[i]);
    }
  },
  initialize: function(){
    setInterval(function(){
      Handler.handle();
    }, 5000);
  },
  addAjax: function(time, ajaxData){
    Handler.ajaxToExecute.push({time, ajaxData});
  }
};

var TWBot = {
  initialize: function(){
    Handler.initialize();
    UserInterface.initialize();
  }
};

TWBot.initialize();
