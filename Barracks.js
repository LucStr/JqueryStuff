var postponedRecruits = [];

window.setInterval(evaluateRecruitment, 32495)

function evaluateRecruitment(){
  cleanUp();
  loadUI();
  var unit = postponedRecruits[0]["unit"];
  var count = postponedRecruits[0]["count"];
  var available = getMaxProducableUnits(unit);
  if($("input[name=" + unit + "]").val() != 0){
    $(".btn-recruit").click();
    return;
  }
  if(available == null || available == 0)
    return;
  if(available >= count){
    insertTroops(unit, count);
    postponedRecruits.shift();
  } else{
    insertTroops(unit, available);
    postponedRecruits[0]["count"] -= available;
  }
  $(".btn-recruit").click();
}

function insertTroops(unit, count){
  $("input[name=" + unit + "]").val(count);
}

function postponedRecruit(unit){
  var value = $("input[name=postponed_" + unit + "]").val();
  if($.isNumeric(value)){
    var combinedValue = [];
    combinedValue["unit"] = unit;
    combinedValue["count"] = value;
    postponedRecruits.push(combinedValue);
    reload();
  }
}

function getAvailableUnits(){
  var availableUnits = [];
  $(".recruit_unit").each(function(){availableUnits.push($(this).attr("name"))})
  return availableUnits;
}

function getUnitPicture(unit){
  return '<div class="unit_sprite unit_sprite_smaller ' + unit + '"></div>';
}

function getMaxProducableUnits(unit){
  return $("#" + unit + "_0_a").text().match(/\(([^)]+)\)/)[1]
}

function loadUI(){
  //loadClusterInput();
  loadRecruitTable();
  loadQueue();
}

function loadRecruitTable(){
  createRecruitTableHeader();
  var units = getAvailableUnits();
  for(var i = 0; i < units.length; i++){
    var row = $("#train_form").find("tr").get(i + 1);
    createRecruitInput(row, units[i]);
  }
}

function createRecruitTableHeader(){
  var headerRow = $("#train_form").find("tr").first();
  headerRow.append('<th class="cleanUp">Rekrutieren</th>');
}

function createRecruitInput(row, unit){
  $(row).append('<td style="width:auto" class="cleanUp"><input style="width:50px;color:black" name="postponed_' + unit + '" /><a href="javascript:postponedRecruit(\'' + unit + '\')" class="btn">Rekrutieren</a></td>');
}

function loadQueue(){
  createQueueTable();
  createQueueValues();
}

function createQueueTable(){
  $("#replace_barracks").prepend('<table class="cleanUp" id="postponedRecruitQueue"><tr><th>Einheit</th></tr></table>');
}

function createQueueValues(){
  var table = $("#postponedRecruitQueue");
  for(var i = 0; i < postponedRecruits.length; i++){
    var recruit = postponedRecruits[i];
    table.append('<tr><td>' + getUnitPicture(recruit["unit"]) + recruit["count"] + ' ' + recruit["unit"] + '</td></tr>')
  }
}

function cleanUp(){
  $(".cleanUp").remove();
}

function reload(){
  cleanUp();
  loadUI();
}

reload();
