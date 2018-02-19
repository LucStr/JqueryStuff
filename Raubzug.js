window.setInterval(evaluateRaubzug, 1000)

function evaluateRaubzug(){
  if($("[name=botStarted]:checked").length != 1)
    return;
  var optionsContainer = $(".options-container").first()
  var checkedLootingType = $("[name=lootingType]:checked").val();
  var smartSammler = $(optionsContainer.children()[checkedLootingType]).first()
  var lootingButton = smartSammler.find("a").first() //The Free Looting Button
  if(!lootingButton.hasClass("btn-disabled")){
    insertTroops(evaluateUnits());
    lootingButton.click();
    reloadUILootingType(checkedLootingType);
  }
}

function insertTroops(units){
  for (var i = 0; i < units.length; i++) {
    var input = $("[name=" + units[i] + "]");
    input.parent().find("a").click();
  }
}

function evaluateUnits(){
  var checkedUnits = $('[name^=send]:checked');
  var units = [];
  for (var i = 0; i < checkedUnits.length; i++) {
    var name = $(checkedUnits[i]).attr("name");
    units.push(name.split("send")[1]);
  }
  return units;
}

function loadUI(){
  loadUILootingTypes();
  loadUISendTypes();
  loadUIStartButton();
}

function loadUISendTypes(){
  var inputs = $(".candidate-squad-widget").find("td").find("input")
  for (var i = 0; i < inputs.length; i++) {
    var input = $(inputs[i]);
    var name = input.attr("name");
    if(name !== undefined){
      input.parent().append('<input type="checkbox" name="send' + name + '" checked>')
    }
  }
}

function loadUILootingTypes(){
  var actionContainers = $(".action-container");
  for (var i = 0; i < actionContainers.length; i++) {
    //ToDo: Remove Ugly Code Is to Select the third lootingType
    if(i == 2){
      $(actionContainers[i]).append('<input type="radio" name="lootingType" value="' + i + '" checked>');
    } else{
      $(actionContainers[i]).append('<input type="radio" name="lootingType" value="' + i + '">');
    }
  }
}

function loadUIStartButton(){
  $(".candidate-squad-container").append('<b>Bot Started:</b> <input type="checkbox" name="botStarted" />')
}

function reloadUILootingType(type){
  var actionContainer = $($(".action-container")[type])
  actionContainer.append('<input type="radio" name="lootingType" value="' + type + '" checked>');
}

loadUI();
