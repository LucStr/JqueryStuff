
/*Neue Funktionen:
- Besammlungszeit bestimmen können
- Einheiten bestimmen für Besammlung
- Zeit beachten für Besammlung
*/

window.setInterval(evaluateRaubzug, 7000)

function evaluateRaubzug(){
  var activatedScavenges = $("[name^=startScavenge]:checked");
  if(activatedScavenges.length == 0)
    return;
  for (var i = 0; i < activatedScavenges.length; i++) {
    executeScavenge($(activatedScavenges[i]).attr("name").split("startScavenge")[1]);
  }

}

function executeScavenge(lootingType){
  if(!checkIfScavengeTimelyActivated(lootingType))
    return;
  var optionsContainer = $(".options-container").first()
  var smartSammler = $(optionsContainer.children()[lootingType]).first()
  var lootingButton = smartSammler.find("a").first() //The Free Looting Button
  if(!lootingButton.hasClass("btn-disabled")){
    insertTroops(lootingType);
    console.log("attack");
    //lootingButton.click();
  }
}

function insertTroops(lootingType){
  var inputsToFill = $(".candidate-squad-widget").find("td input");
  for (var i = 0; i < inputsToFill.length; i++) {
    var inputToFill = $(inputsToFill[i]);
    var name = inputToFill.attr("name");
    var value = $("[name=troop" + lootingType + name + "]").val();
    if(value == "a"){
      value = inputToFill.parent().html().match(/\(([^)]+)\)/)[1];
    }
    inputToFill.val(value);
    inputToFill.change();
  }
}


function checkIfScavengeTimelyActivated(lootingType){
  var fromHHval = $('[name=scavengeScheduleFromHH' + lootingType + ']').val();
  var frommmval = $('[name=scavengeScheduleFrommm' + lootingType + ']').val();
  var toHHval = $('[name=scavengeScheduleToHH' + lootingType + ']').val();
  var tommval = $('[name=scavengeScheduleTomm' + lootingType + ']').val();

  if(fromHH == "" || frommmval == "" || toHHval == "" || tommval == "")
    return true;

  var fromHH = Number(fromHHval);
  var frommm = Number(frommmval);
  var toHH = Number(toHHval);
  var tomm = Number(tommval);

  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var totalMinutes  = hour * 60 + minute;
  var fromMinutes = fromHH * 60 + frommm;
  var toMinutes = toHH * 60 + tomm;

  //If EndTime is before startTime
  if(fromMinutes > toMinutes)
  {
    toMinutes += 24 * 60;
  }

  return fromMinutes <= totalMinutes && totalMinutes <= toMinutes;
}

function loadUI(){
  loadUICss();
  loadUILootingTypes();
}

function loadUISendTypes(){
  var inputs = $(".candidate-squad-widget").find("td input")
  for (var i = 0; i < inputs.length; i++) {
    var input = $(inputs[i]);
    var name = input.attr("name");
    if(name !== undefined){
      input.parent().append('<input type="checkbox" name="send' + name + '" checked>')
    }
  }
}

function loadUILootingTypes(){
  var actionContainers = $(".action-container").parent().parent();
  var unittd = $(".candidate-squad-widget").find("td input").parent();
  var unitth = $(".candidate-squad-widget").find("th a").parent();
  var units = $(".candidate-squad-widget").find("td input").map(function(){return $(this).attr("name");}).get();
  for (var i = 0; i < actionContainers.length; i++) {
    loadUIActionContainer($(actionContainers[i]), units, i);
  }
}

function loadUIActionContainer(actionContainer, units, id){
  var count = units.length;
  for(var i = 0; i < count / 3; i++){
    var finish = (i+1) * 3;
    if(finish > count)
      finish = count;
    actionContainer.append(createTableFromTo(units, id, i * 3, finish));
  }
  actionContainer.append(createScheduler(id));
  actionContainer.append('<br><b>Start:</b><input type="checkbox" name="startScavenge' + id + '"><div style="height:50px;"></div>')
}

function createTableFromTo(units, id, start, finish){
  var thspearTemplate = "<th>" + $(".candidate-squad-widget").find("th a[data-unit^=spear]")[0].outerHTML + "</th>";
  var tdspearTemplate = '<td><input type="text" class="unitsInput" name="troop' + id + 'spear" /></td>';
  var temp = '<table><tr>';
  for(var i = start; i < finish; i++){
      temp += thspearTemplate.replace("spear", units[i]).replace("spear.", units[i] + ".");
  }
  temp += "</tr><tr>";
  for(var i = start; i < finish; i++){
    temp += tdspearTemplate.replace("spear", units[i]);
  }
  temp += "</table>";
  return temp;
}

function createScheduler(id){
  var temp = '<h3>Aktiv</h3>'
  temp += '<b>von:</b><input style="width:50px;" type="text" placeholder="HH" name="scavengeScheduleFromHH' + id + '" />';
  temp += '<input style="width:50px;" type="text" placeholder="mm" name="scavengeScheduleFrommm' + id + '" />';
  temp += '<br><b>bis:</b><input style="width:50px;" type="text" placeholder="HH" name="scavengeScheduleToHH' + id + '" />';
  temp += '<input style="width:50px;" type="text" placeholder="mm" name="scavengeScheduleTomm' + id + '" />';
  return temp;
}

function loadUICss(){
  $("body").append("<style>.status-specific{height: auto !important;}</style>");
}

loadUI();
