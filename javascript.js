var msInSec = 1000;
var msInMin = msInSec * 60;
var msInHour = msInMin * 60;
var msInDay = msInHour * 24;

var lifespan = 80; // in years
var tickLength = 25; // in ms

var clock = setInterval(function(){ tick() }, tickLength);
function tick(){
	var x = isFormComplete();
	if(x){
		showClock();
		var month = x[0];
		var day = x[1]; 
		var year = x[2];

		var birthDate = new Date(year, month, day);
		var deathDate = new Date(year + lifespan, month, day);
		var ms = deathDate - new Date(); // total milliseconds between now and most certain death

		var days = Math.floor(ms / msInDay);
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
	}else{
		showPrompt();
	}
	return false;
}

function showPrompt(){
	document.getElementById('prompt').style.display = 'block';
	document.getElementById('inputBoxes').style.display = 'block';
	document.getElementById('clock').style.display = 'none';
	document.getElementById('explanation').style.display = 'none';
}
function showClock(){
	document.getElementById('clock').style.display = 'block';
	//setTimeout(function(){
		document.getElementById('explanation').style.display = 'block';
	//}, 2000);
	document.getElementById('prompt').style.display = 'none';
	document.getElementById('inputBoxes').style.display = 'none';
}

function addDigits(num, numDigits){
	num = num.toString();
	while(num.length < numDigits){ num = "0" + num };
	if(num.length > 3){ }
	return num;
}

function isFormComplete(){
	var values = [];
	var month = parseInt(document.getElementsByName('month')[0].value) - 1;
	var day = parseInt(document.getElementsByName('day')[0].value);
	var year = parseInt(document.getElementsByName('year')[0].value);
	values = [month,day,year];
	if((month >= 0) && (month < 12) && (day >= 1) && (day <= 31) && (year > 999)){ return values; };
	return false;
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