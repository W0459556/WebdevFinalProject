// number formatting method from https://www.tutorialrepublic.com/faq/how-to-replace-character-inside-a-string-in-javascript.php
const countryInfoArray = [[],[],[]];
const totalPop = 0;
function  parseCountryJSON(responseRaw){
    var countryHtml = "";
    var countryInfos = JSON.parse(responseRaw);
        for (let i=0; i<countryInfos.length; i++){
            // creates entries for the drop-down countries menu
            countryHtml = `${countryHtml} \n <option value = "${[i]}" id="countrycode-${countryInfos[i].Name}">${countryInfos[i].Name}</option>`; // returns the index for the value, and pushes the name, population, and area to a 2d array that's a const outside of any function to be accessed later.

            // pushes info into array for later use
            countryInfoArray[0].push(countryInfos[i].Name);
            countryInfoArray[1].push(parseInt(countryInfos[i].Population));
            countryInfoArray[2].push(parseInt(countryInfos[i].Area));
        }  
        //insert the creates entry into the dropdown
        document.getElementById("countryNameList").innerHTML = `<option disabled selected value> -- select an option -- </option>` + countryHtml;
}


// im going to be real i dont know what a lot of this does, i just copied it from the sample you gave us. 
function readTextFile(file) {
    var rawFile = new XMLHttpRequest(); // create new XMLHttpRequest object, assigns this to the variable rawFile
    rawFile.overrideMimeType("application/json"); // force stream to be treated, parsed as "application/json"
    rawFile.open("GET", file, true); // uses http request method GET, uses url to file given to func (countries.json), perform the operation asynchronously
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200"){ // Ajax http request has 5 states, 4 being the final one that signifies completion of the operation; the HTTP status 200 means OK (the request has succeded. suceded. something like that this isnt english class)
            parseCountryJSON(rawFile.responseText); // sends it to above function
        }
    }
    rawFile.send(null); // null included for support of legacy browsers
}


//usage:
readTextFile("countries.json"); // calls the readtextfile function

// define countryNameList and add event listners that activate displaycountrydata and displaypopulationdata functions respectively
const countryNameList = document.getElementById("countryNameList"); // defines countryNameList as the drop-down of the same name in the index
countryNameList.addEventListener('change', DisplayCountryData, false); // event listner- listens to countryNameList, detects when it changes, and activates the DisplayCountryData function when it does. the false argument is for support of legacy browsers, look at me researching things. isn't this fun.
countryNameList.addEventListener('change', DisplayPopulationData, false); // event listner- listens to countryNameList, detects change, activates DisplayPopulationData function


// -Print all given values (sans those displayed with the following function) to the screen
// -Display the flag
// -Change the wikipedia button link
function DisplayCountryData()
{
    // change the photo of the flag
    var selectedLink = (countryInfoArray[0][parseInt(countryNameList.value)]).replace(/ /g, "_"); // make the link, also to be used for wikipedia
    document.getElementById("selectedFlag").src = (`flags/${selectedLink}.png`); // replace the src of the image with the given country's link


    // change inner HTML of the selectedCountry element using the countryInfoArray created in the parseCountryJSON array (aka display country name)
    document.getElementById("selectedCountry").innerHTML = countryInfoArray[0][parseInt(countryNameList.value)];


    // display the population data
    DisplayPopulationData();


    // define unit of measurement
    var areaSelector = document.getElementById("areaMeasurement"); 


    // define countryMiles & countryKilometres via the function below
    var countryMiles = countryInfoArray[2][parseInt(countryNameList.value)];
    var countryKilometres = CalculateAreaInKM(countryMiles);


    // change value of area upon selection of different country
    if(areaMeasurement.value=="miles"){
        document.getElementById("selectedArea").innerHTML = new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format(countryMiles); // gets int from 2d array formats it to have commas
    }
    else if(areaMeasurement.value=="kilometres"){
        document.getElementById("selectedArea").innerHTML = new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format(countryKilometres); // gets int from 2d array formats it to have commas and two decimal places max 
    }


    // change area when the dropdown is used
    // add event listner for the selection between sqkm and sqmi
    areaSelector.addEventListener('change', areaMeasurementSelection, false);
    function areaMeasurementSelection(){
        if(areaMeasurement.value=="miles"){
            document.getElementById("selectedArea").innerHTML = new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format(countryMiles); // gets int from 2d array formats it to have commas
        }
        else if(areaMeasurement.value=="kilometres"){
            document.getElementById("selectedArea").innerHTML = new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format(countryKilometres); // gets int from 2d array formats it to have commas and two decimal places max 
        }
    }


    // radio buttons
    // event listners
    document.getElementById('milesPopDense').addEventListener('change', popDenseMeasurementSelection, false);
    document.getElementById('kilometresPopDense').addEventListener('change', popDenseMeasurementSelection, false);

    // on initial selection of country
    if(document.getElementById('milesPopDense').checked){
        document.getElementById("selectedDensity").innerHTML = new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format((countryInfoArray[1][parseInt(countryNameList.value)])/(countryMiles));
    }
    else if (document.getElementById('kilometresPopDense').checked){
        document.getElementById("selectedDensity").innerHTML = (new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format((countryInfoArray[1][parseInt(countryNameList.value)])/countryKilometres));
    }

    // on change of selection while country is loaded
    function popDenseMeasurementSelection(){
        if(document.getElementById('milesPopDense').checked){
            document.getElementById("selectedDensity").innerHTML = new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format((countryInfoArray[1][parseInt(countryNameList.value)])/(countryMiles));
        }
        else if (document.getElementById('kilometresPopDense').checked){
            document.getElementById("selectedDensity").innerHTML = new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format((countryInfoArray[1][parseInt(countryNameList.value)])/countryKilometres);
        }
    }


    // change the wiki link
    // https://en.wikipedia.org/wiki/Andorra <- example link
    document.getElementById("selectedLink").href = (`https://en.wikipedia.org/wiki/${selectedLink}`);
}


// -Print all given values (sans those displayed with the following function) to the screen
// -Display the flag
// -Change the wikipedia button link
function DisplayPopulationData(){
    var countryPopulation = countryInfoArray[1][parseInt(countryNameList.value)]; // assign the variable
    document.getElementById("selectedPopulation").innerHTML = new Intl.NumberFormat().format(countryPopulation); // display in proper format
    var percentPop = CalculateTotalWorldPopulation(countryPopulation);
    document.getElementById("selectedPercentage").innerHTML = new Intl.NumberFormat("en", {maximumFractionDigits: 5, minimumFractionDigits: 5}).format(percentPop) + "%"; // display population percent w/ % symbol n everything
}


// -Calculate the given value in KM when given in miles
// -Return this value as a float
function CalculateTotalWorldPopulation(countryPopulation){
    // find the population of the whole world
    var totalPop = 0;
    for(var i = 0; i < countryInfoArray[1].length; i++){
        totalPop += countryInfoArray[1][i];
    }
    return((countryPopulation/totalPop)*100); // return the percentage of the population which the given country represents

}


// -Calculate the given value in KM when given in miles
// -Return this value as a float
function CalculateAreaInKM(countryAreaInMiles){
    return countryAreaInMiles*2.58999; //guess what this does. you wont believe it.
}