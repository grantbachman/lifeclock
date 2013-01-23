var msInSec = 1000;
var msInMin = msInSec * 60;
var msInHour = msInMin * 60;
var msInDay = msInHour * 24;

var lifespan = 78 // in years

window.onload = function(){
	toggleState();
	window.clock = setInterval(function(){ tick() }, 25); 	
};

function tick(){
	var values = getValues();
	var month = values[0];
	var day = values[1]; 
	var year = values[2];

	var birthDate = new Date(year, month, day);
	var deathDate = new Date(year + lifespan, month, day);
	var ms = deathDate - new Date(); // number of milliseconds between now and most certain death

	var days = addCommas(Math.floor(ms / msInDay));
	ms %= msInDay;
	var hours = Math.floor(ms / msInHour);
	hours = addDigits(hours, 2);
	ms %= msInHour;
	var minutes = Math.floor(ms / msInMin);
	minutes = addDigits(minutes, 2);
	ms %= msInMin;
	var seconds = (ms / msInSec).toFixed(2);
	seconds = addDigits(seconds, 5);

	printValues(days, hours, minutes, seconds);
	insertDays(days);
	return false;
}

function toggleState(flag){
	var state = ['none', 'block'];
	if(flag == -1){ state[0] = state.splice(1,1,state[0])[0]; } // swap values
	document.getElementById('prompt').style.display = state[0];
	document.getElementById('inputBoxes').style.display = state[0];
	document.getElementById('clock').style.display = state[1];
	document.getElementById('explanation').style.display = state[1];
}

// regex copied from Stack Overflow: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function addCommas(num){ return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

function addDigits(num, numDigits){
	num = num.toString();
	while(num.length < numDigits){ num = "0" + num };
	return num;
}

function getValues(){
	var month = parseInt(document.getElementsByName('month')[0].value) - 1;
	var day = parseInt(document.getElementsByName('day')[0].value);
	var year = parseInt(document.getElementsByName('year')[0].value);
	return new Array(month, day, year);
}
function validate(e){
	var values = getValues();
	var month = values[0], day = values[1], year = values[2];
	if((month >= 0) && (month < 12) && (day >= 1) && (day <= 31) && (year > 999)){	
		// valid
		document.getElementById('submit').classList.add('active');
		if(e.keyCode == 13 || e.srcElement.type == "image"){
			toggleState();
			window.clock = setInterval(function(){ tick() }, 25);	
		}
	}else{
		document.getElementById('submit').classList.remove('active');
	}
}

function printValues(days, hours, minutes, seconds){
	document.getElementById('days').getElementsByClassName('value')[0].innerHTML = days;
	document.getElementById('hours').getElementsByClassName('value')[0].innerHTML = hours;
	document.getElementById('minutes').getElementsByClassName('value')[0].innerHTML = minutes;
	document.getElementById('seconds').getElementsByClassName('value')[0].innerHTML = seconds;
}

function insertDays(days){
	document.getElementById('explanation').getElementsByClassName('explanationDays')[0].innerHTML = days;
}