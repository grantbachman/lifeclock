if(window.location.pathname == '/')
{
	function validateBirth(e){
		var month = document.getElementsByName('month')[0].value
		var day = document.getElementsByName('day')[0].value		
		var year = document.getElementsByName('year')[0].value	

		if(month.length == 2 && day.length == 2 && year.length == 4 &&
			month >= "01" && month <= "12" &&
			day >= "01" && day <= "31" &&
			year >= "1000") {
			return true;
		} return false;
	}
}



if(window.location.pathname.match(/\d{8}/)){
	var msInSec = 1000;
	var msInMin = msInSec * 60;
	var msInHour = msInMin * 60;
	var msInDay = msInHour * 24;

	var lifespan = 78 // in years

	window.onload = function(){
		var values = getValues();
		var month = values[0] - 1, day = values[1], year = values[2];
		var birthDate = new Date(year, month, day)
		var deathDate = new Date(parseInt(year) + lifespan, month, day)
		window.clock = setInterval(function(){ tick(deathDate) }, 25); 	
	};

	function validateReaction(e){
		var reaction = document.getElementById('reactionText').value
		if(/[a-zA-Z]/.test(reaction)){
			return true; } return false;
	}

}

function tick(deathDate){
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


	if(ms < 0){
		// Ensure digits display zero for dates entered that would make the timer negative 
		printValues(0,0,0,0);
		window.clearInterval(clock);
		document.getElementById('explanation').style.display = 'none';
		document.getElementById('deathExplanation').style.display = 'block';
	}else{
		printValues(days, hours, minutes, seconds);
		insertDays(days);
	}
	return false;
}

// regex copied from Stack Overflow: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function addCommas(num){ return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

function addDigits(num, numDigits){
	num = num.toString();
	while(num.length < numDigits){ num = "0" + num };
	return num;
}

function getValues(){
	var path = window.location.pathname
	var month = path.slice(1,3)
	var day = path.slice(3,5)
	var year = path.slice(5,9)
	return new Array(month, day, year);
}

function printValues(days, hours, minutes, seconds){
	document.getElementById('days').getElementsByClassName('value')[0].innerHTML = days;
	document.getElementById('hours').getElementsByClassName('value')[0].innerHTML = hours;
	document.getElementById('minutes').getElementsByClassName('value')[0].innerHTML = minutes;
	document.getElementById('seconds').getElementsByClassName('value')[0].innerHTML = seconds;
}

function insertDays(days){
	document.getElementById('explanation').getElementsByClassName('explanationDays')[0].innerHTML = days;
	document.getElementById('formDays').value = days;	
}