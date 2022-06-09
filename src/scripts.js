import './css/styles.css';
import './images/turing-logo.png'
import {getData} from './apiCalls';
import Traveler from './Traveler';
import Trip from './Trip';
import Destination from './Destination';

// ****** Global Variables ******
var travelerData;
var tripsData;
var destinationData;
var currentTraveler;

// ****** event listeners ******
window.addEventListener('load', loadData);
var welcomeGreeting = document.getElementById('welcome');
var totalSpent = document.getElementById('totalSpent');


// ****** fetch GET ******
function loadData () {
    Promise.all([getData('travelers'), getData('trips'), getData('destinations')]).then(data => {
        travelerData = data[0].travelers;
        tripsData = data[1].trips;
        destinationData = data[2].destinations;
        createTraveler(50);
    });
}

// ****** functions ******

function createTraveler(id){
    const traveler = travelerData.find(traveler => traveler.id === id);
    currentTraveler = new Traveler(traveler);
    greetUser();
}

function greetUser(){
    const traveler = currentTraveler.displayFirstName();
    welcomeGreeting.innerText = `Welcome ${traveler}! Where do you want to go next?`;
    updateTotalSpentOnTrips('2022/12/05');
}

function updateTotalSpentOnTrips(date){
    currentTraveler.getUserTrips(tripsData);
    let dest = new Destination(destinationData);
    let total = dest.getTotalCost(currentTraveler.trips);
    // let total = currentTraveler.getTotalSpentTrips(destinationData, date);
    console.log(currentTraveler.trips)
    totalSpent.innerText = `You've spent $${total} on trips this year!`
}