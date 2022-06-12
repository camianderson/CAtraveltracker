import './css/styles.css';
import {getData, postData} from './apiCalls';
import Traveler from './Traveler';
import Trip from './Trip';
import Destination from './Destination';

// ****** Global Variables ******
var travelerData;
var tripsData;
var destinationData;
var currentTraveler;
var newTrip;
var userId;

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
var newTripContainer = document.getElementById('newTripContainer');
var newTripCard = document.getElementById('newTripCard');
var confirmButton = document.getElementById('submitNewTrip');
var cancelButton = document.getElementById('cancelButton');
var errorMessage = document.getElementById('errorMessage');
var loginPage = document.getElementById('loginPage');
var topMainPage = document.getElementById('topPage');
var bottomMainPage = document.getElementById('bottomPage');
var inputUsername = document.getElementById('inputUsername');
var inputPassword = document.getElementById('inputPassword');
var loginButton = document.getElementById('loginButton');

// ****** event listener ******
formButton.addEventListener('click', (event) => {
  if(inputDate.value === '' || inputDestination.value === ''){
    errorMessage.innerText = 'Fill all the spaces!';
  } else{
    event.preventDefault();
    createNewTrip();
    showNewTripRequest(newTrip);
    errorMessage.innerText = '';
  }
})
confirmButton.addEventListener('click', postNewTrip);
cancelButton.addEventListener('click', cancelNewTrip);
loginButton.addEventListener('click', validateLogin);

// ****** fetch GET ******
function loadData () {
    Promise.all([getData('travelers'), getData('trips'), getData('destinations')]).then(data => {
        travelerData = data[0].travelers;
        tripsData = data[1].trips;
        destinationData = data[2].destinations;
        createTraveler(1);
    });
}

// ****** functions ******

function createTraveler(id){
    const traveler = travelerData.find(traveler => traveler.id === id);
    currentTraveler = new Traveler(traveler);
    greetUser();
    displayTrips();
    populateOptions();
    currentTraveler.findLastTripId(tripsData);
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
    let date = inputDate.value;
    const duration = inputDuration.value;
    const travelers = inputTravelers.value;
    const destination = inputDestination.value;
    const id = currentTraveler.findLastTripId(tripsData) + 1;
    date = date.split('-').join('/');
    var info = {
        id: parseInt(id),
        userID: parseInt(50),
        destinationID: parseInt(destination),
        travelers: parseInt(travelers),
        date: date,
        duration: parseInt(duration),
        status: "pending",
        suggestedActivities: []
        };
    newTrip = info;
  }

  function showNewTripRequest() {
    displayNewTripContainer()
    createNewTripCard()
  }

  function displayNewTripCost() {
    return currentTraveler.createNewTripValue(newTrip, destinationData);
  }

  function displayNewTripContainer(){
    tripCards.classList.add('hidden');
    newTripContainer.classList.remove('hidden');
  }

  function displayCardsContainer(){
    tripCards.classList.remove('hidden');
    newTripContainer.classList.add('hidden');
  }

  function createNewTripCard(){
    destinationData.forEach((place) => {
        if (newTrip.destinationID === place.id) {
          let color = newTrip.status === "approved" ? "teal" : "pink";
          const cost = displayNewTripCost()
          newTripCard.innerHTML = `
          <div class="card-no-hover" tabindex="0" id="${newTrip.id}">
            <div class="card-header">
              <img src=${place.image} alt=${place.alt}/>
            </div>
            <div class="card-body">
              <p>Estimated Cost: $${cost}</p>
              <p class="tag tag-${color}" >${newTrip.status}</p>
              <p>${place.destination}</p>
              <p>Date: ${newTrip.date}</p>
              <p># of Travelers: ${newTrip.travelers}</p>
              <p># of Days: ${newTrip.duration}</p>
          </div>`;
        }
    })
  }

  function postNewTrip(){
    postData("trips", newTrip);
    currentTraveler.trips.push(newTrip);
    displayTrips();
    greetUser();
    clearNewTripForm();
    displayCardsContainer();
  }

  function cancelNewTrip(){
    clearNewTripForm();
    displayCardsContainer();
  }

  function clearNewTripForm(){
    inputDate.value = '';
    inputDuration.value = 1;
    inputTravelers.value = 1;
    inputDestination.value ='';
  }

  function displayMainPage(){
    loginPage.classList.add('hidden');
    topMainPage.classList.remove('hidden');
    bottomMainPage.classList.remove('hidden');
  }

  function validateLogin(){
    let user = inputUsername.value;
    user = parseInt(user[8]+user[9]);
    console.log(user)
    if(inputPassword.value === "travel" && inputUsername.value === `traveler${user}`){
      event.preventDefault();
      createTraveler(user);
      displayMainPage();
    } else{
      window.alert("Incorrect Username or Password! Try again")
    }
  }
