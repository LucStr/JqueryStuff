const fakeLimit = "FAKE_CALC_LIMIT";
const fixSize = "FAKE_CALC_FIXSIZE";
const fixUnit = "FAKE_CALC_FIXUNIT";
const isRam = "FAKE_CALC_ISRAM";

function setFakeLimit(limit){
	localStorage[fakeLimit] = limit;
}

function calculateFakeAmount(unitsize){
	let amount = Math.ceil(game_data.village.points * localStorage[fakeLimit] / unitsize) - localStorage[fixSize]
	return amount > 0 ? amount : 0;
}

function setFixSize(size){
	localStorage[fixSize] = size;
}

function getRamAmount(){
	if(localStorage[isRam]){
		return 1;
	}
	return 0;
}

function getCataAmount(){
	if(localStorage[isRam]){
		return 0;
	}
	return 1;
}
