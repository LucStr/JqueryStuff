//Constants
var postponedBuildings = [];
var maxQueue = game_data.player.premium ? 4 : 1;

function updateQueue() {
  for (var i = 0; i < postponedBuildings.length; i++) {
    var building = postponedBuildings[i];
    var buildingrow = $("#main_buildrow_" + building);
    var image = buildingrow.find("img").first();
    var title = image.attr("title");

    $("#preprodTable").find("tr").last().after('<tr><td class="lit-item"><img src="' + image.attr("src") + '" title="' + title +'" alt="" class="bmain_list_img">' + title + '<br>Stufe ' + getBuildingLevel(i) + '</td><td></td><td></td><td></td><td><button onclick=\'abortBuild("' + i + '")\'>Abbrechen</button></td></tr>');

  }



/*
  var now = new Date();
  var neededTime = new Date();
  var neededWood = buildingrow.children(".cost_wood").attr("data-cost") - game_data.village.wood;
  var neededWoodTime = neededTime.setSeconds(now.getSeconds() + neededWood / game_data.village.wood_prod);
  var neededTime =  neededWood > 0 ? neededWoodTime : neededTime;
  console.log(neededTime);
  var neededStone = buildingrow.children(".cost_stone").attr("data-cost") - game_data.village.stone;
  console.log(neededStone);
  var neededStoneTime = neededTime.setSeconds(now.getSeconds() + neededStone / game_data.village.stone_prod);
  console.log(neededStoneTime);
  var neededTime =  neededStone > 0  && neededStoneTime > neededTime ? neededStoneTime : neededTime;
  console.log(neededTime);
  var neededIron = buildingrow.children(".cost_stone").attr("data-cost") - game_data.village.iron;
  var neededIronTime = neededTime.setSeconds(now.getSeconds() + neededStone / game_data.village.iron_prod);
  var neededTime =  neededStone > 0  && neededIronTime > neededTime ? neededIronTime : neededTime;
  console.log(neededTime);
*/

  //postponedBuildings.push(building);
}

function addToQueue(building){
  postponedBuildings.push(building);
  loadUI();
}

function abortBuild(id){
  postponedBuildings.splice(id, 1);
  loadUI();
}

function getBuildingLevel(buildingId){
  var building = postponedBuildings[buildingId];
  var levelCount = $(".buildorder_" + building).length + parseInt(game_data.village.buildings[building]);
  var filtered = $.grep(postponedBuildings, function(e, i){
    return e == building && i < buildingId;
  }, false );
  return levelCount + filtered.length + 1;
}

function loadUI(){
  $(".buildingBot").remove();
  $("#content_value").find("table").first().after('<div class="buildingBot" id="preprod"><h1>Warte-Warteschlange</h1><table class="vis" id="preprodTable" style="width: 100%"><tbody><tr><th style="width: 23%">Bou</th><th>Dur</th><th>Vorussichtliche Uftrag</th><th>Fertigstellig</th><th style="width: 15%">Abbruch</th><th style="background:none !important;"></th></tr></tbody></table></div>')
  $("#buildings").find("tr").not(":eq(0)").each(function(){
    var building = $(this).children(".build_options").children("a").attr("data-building");
    if(building !== undefined){
      $(this).children().last().after('<td class="buildingBot"><button onclick=\'addToQueue("' + building + '")\'>upgrade</button></td>"')
    } else{
      $(this).children().last().after('<td class="buildingBot">Voll ausgebaut</td>')
    }
  });
  $("#buildings").find("tr").first().children().last().after('<th class="buildingBot">Verschobener Bau</th>');
  updateQueue();
}

window.setInterval(function(){
  console.log("entered");
  var buildingToBuild = postponedBuildings[0];
  var buildingrow = $("#main_buildrow_" + buildingToBuild);
  if(game_data.village.res[8] - game_data.village.res[7] - game_data.village.res[8] / 10 > 0 || buildingToBuild == "farm" || $("#buildqueue").find(".buildorder_farm").length > 0){
    var neededWood = $(buildingrow.children().get(1)).attr("data-cost");
    var neededStone = $(buildingrow.children().get(2)).attr("data-cost");
    var neededIron = $(buildingrow.children().get(3)).attr("data-cost");
    if(buildingToBuild != undefined){
      if((game_data.village.res[6] > neededWood && game_data.village.res[6] > neededStone && game_data.village.res[6] > neededIron) ||  buildingToBuild == "storage" || $("#buildqueue").find(".buildorder_storage").length > 0){
        if(neededWood < game_data.village.wood && neededStone < game_data.village.stone && neededIron < game_data.village.iron && $("[id*=buildorder_]").length < maxQueue){
          var level = $(".buildorder_" + buildingToBuild).length + parseInt(game_data.village.buildings[buildingToBuild]) + 1;
          var upgradlink = $("#main_buildlink_" + buildingToBuild + "_" + level);
          if(upgradlink != undefined){
            upgradlink.click();
            postponedBuildings.splice($.inArray(buildingToBuild, postponedBuildings),1);
          }
        }
      } else {
        console.log("unshift storage");
        postponedBuildings.unshift("storage");
      }
    }
  } else{
    postponedBuildings.unshift("farm");
  }
  loadUI();
}, 5000);

loadUI();
