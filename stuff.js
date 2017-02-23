/*
stone of village = game_data.village.stone;
wood of village = game_data.village.wood;
iron of village = game_data.village.iron;

Knackpunkte:
- HG
*/

var postponedBuildings = [];

function postponedBuild(building) {
  var buildingrow = $("#main_buildrow_" + building);
  var image = buildingrow.find("img").first();
  var title = image.attr("title");

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

  $("#preprodTable").find("tr").last().after('<tr><td class="lit-item"><img src="' + image.attr("src") + '" title="' + title +'" alt="" class="bmain_list_img">' + title + '<br>Stufe X</td><td></td><td></td><td></td><td><button onclick=\'abortBuild("' + building + '")\'>Abbrechen</button></td></tr>');
  postponedBuildings.push(building);
}

function abortBuild(building){
  postponedBuildings.splice($.inArray(building, postponedBuildings),1);
  loadUI();
}

function loadUI(){
  $(".buildingBot").remove();
  $("#content_value").find("table").first().after('<div class="buildingBot" id="preprod"><h1>Warte-Warteschlange</h1><table class="vis" id="preprodTable" style="width: 100%"><tbody><tr><th style="width: 23%">Bou</th><th>Dur</th><th>Vorussichtliche Uftrag</th><th>Fertigstellig</th><th style="width: 15%">Abbruch</th><th style="background:none !important;"></th></tr></tbody></table></div>')
  $("#buildings").find("tr").not(":eq(0)").each(function(){
    var building = $(this).children(".build_options").children("a").attr("data-building");
    if(building !== undefined){
      $(this).children().last().after('<td class="buildingBot"><button onclick=\'postponedBuild("' + building + '")\'>upgrade</button></td>"')
    } else{
      $(this).children().last().after('<td class="buildingBot">Voll ausgebaut</td>')
    }
  });
  $("#buildings").find("tr").first().children().last().after('<th class="buildingBot">Verschobener Bau</th>');
  var oldPostponedBuildings = postponedBuildings;
  postponedBuildings = [];
  oldPostponedBuildings.forEach(function(e){
    postponedBuild(e);
  });
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
        if(neededWood < game_data.village.wood && neededStone < game_data.village.stone && neededIron < game_data.village.iron && $("[id*=buildorder_]").length < 4){
          var upgradlink = $("[id*=main_buildlink_" + buildingToBuild +"]");
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
