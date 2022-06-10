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
var newTrip;

// ****** query selector ******
window.addEventListener('load', loadData);
var welcomeGreeting = document.getElementById('welcome');
var totalSpent = document.getElementById('totalSpent');
var tripCards = document.getElementById('tripsCards');
var inputDate = document.getElementById('inputDate');
var inputDuration = document.getElementById('inputDuration');
var inputTravelers = document.getElementById('inputTravelers');
var inputDestination = document.getElementById('inputDestination');
var formButton = document.getElementById('formButton');

// ****** event listener ******
formButton.addEventListener('click', (event) => {
    event.preventDefault();
    createNewTrip();
    showNewTripRequest(newTrip);
})

// ****** fetch GET ******
function loadData () {
    Promise.all([getData('travelers'), getData('trips'), getData('destinations')]).then(data => {
        travelerData = data[0].travelers;
        tripsData = data[1].trips;
        destinationData = data[2].destinations;
        createTraveler(2);
    });
}

// ****** functions ******

function createTraveler(id){
    const traveler = travelerData.find(traveler => traveler.id === id);
    currentTraveler = new Traveler(traveler);
    greetUser();
    displayTrips();
    populateOptions();
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

function displayTrips() {
    tripCards.innerHTML = "";
    const sortedTrips = currentTraveler.trips.sort(
      (first, last) => new Date(last.date) - new Date(first.date)
    );
    sortedTrips.forEach((trip) => {
        destinationData.forEach((location) => {
        if (trip.destinationID === location.id) {
          let color = trip.status === "approved" ? "teal" : "pink";
          tripCards.innerHTML += `
          <div class="card" tabindex="0" id="${trip.id}">
            <div class="card-header">
              <img src=${location.image} alt=${location.alt}/>
            </div>
            <div class="card-body">
              <p class="tag font-med tag-${color}" >${trip.status}</p>
              <p>${location.destination}</p>
              <p>Date: ${trip.date}</p>
              <p># of Travelers: ${trip.travelers}</p>
              <p># of Days: ${trip.duration}</p>
            </div>
          </div>`;
        }
      });
    });
  }

  function populateOptions() {
    inputDestination.innerHTML = `<option value="" disabled selected>Select a destination</option>`;
    destinationData.forEach((place) => {
      inputDestination.innerHTML += `<option value="${place.id}" >${place.destination}</option>`;
    });
  }

  function createNewTrip(){
    const date = inputDate.value;
    const duration = inputDuration.value;
    const travelers = inputTravelers.value;
    const destination = inputDestination.value;
    var info = {
        id: parseInt(204),
        userID: parseInt(50),
        destinationID: parseInt(destination),
        travelers: parseInt(travelers),
        date: date,
        duration: parseInt(duration),
        status: "pending",
        suggestedActivities: []
        };
    newTrip = new Trip(info)
  }

  function showNewTripRequest(newTrip) {
    destinationData.forEach((place) => {
      if (newTrip.destinationID === location.id) {
        let color = newTrip.status === "approved" ? "teal" : "pink";
        const cost = displayNewTripCost()
        // newTrip.innerHTML = `
        // <p>Estimated Cost: ${cost}</p>
        // <div class="card-no-hover" tabindex="0" id="${newTrip.id}">
        //   <div class="card-header">
        //     <img src=${place.image} alt=${place.alt}/>
        //   </div>
        //   <div class="card-body">
        //     <p class="tag tag-${color}" >${newTrip.status}</p>
        //     <p>${place.destination}</p>
        //     <p>Date: ${newTrip.date}</p>
        //     <p># of Travelers: ${newTrip.travelers}</p>
        //     <p># of Days: ${newTrip.duration}</p>
        //   </div>
        // </div>`;
      }
    });
  }

  function displayNewTripCost() {
    return currentTraveler.createNewTripValue(newTrip, destinationData);
  }
