import './css/styles.css';
import {getAll, postData} from './apiCalls';
import Traveler from './Traveler';
import Destination from './Destination';

// ****** Global Variables ******
var travelerData;
var tripsData;
var destinationData;
var currentTraveler;
var newTrip;
var userId;
var todayDate;

// // ****** query selector ******
const welcomeGreeting = document.getElementById('welcome');
const totalSpent = document.getElementById('totalSpent');
const tripCards = document.getElementById('tripsCards');
const inputDate = document.getElementById('inputDate');
const inputDuration = document.getElementById('inputDuration');
const inputTravelers = document.getElementById('inputTravelers');
const inputDestination = document.getElementById('inputDestination');
const formButton = document.getElementById('formButton');
const newTripContainer = document.getElementById('newTripContainer');
const newTripCard = document.getElementById('newTripCard');
const confirmButton = document.getElementById('submitNewTrip');
const cancelButton = document.getElementById('cancelButton');
const errorMessage = document.getElementById('errorMessage');
const loginPage = document.getElementById('loginPage');
const topMainPage = document.getElementById('topPage');
const bottomMainPage = document.getElementById('bottomPage');
const inputUsername = document.getElementById('inputUsername');
const inputPassword = document.getElementById('inputPassword');
const loginButton = document.getElementById('loginButton');
const errorLogin = document.getElementById('errorLogin');

// ****** functions ******
const displayData = () => {
    getAll()
    .then(data => {
        tripsData = data[0].trips;
        travelerData = data[1].travelers;
        destinationData = data[2].destinations;
        createTraveler(1);
    })
    .catch((error) => console.log(`There has been an error! ${error}`));
}

export const updateData = () => {
    getAll()
    .then(data => {
        tripsData = data[0].trips;
        travelerData = data[1].travelers;
        destinationData = data[2].destinations;
        clearNewTripForm();
        updateTotalSpentOnTripsNewTrip();
    })
    .catch((error) => console.log(`There has been an error! ${error}`));
}

const createTraveler = (id) => {
    const traveler = travelerData.find(traveler => traveler.id === id);
    currentTraveler = new Traveler(traveler);
    greetUser();
    displayTrips();
    populateOptions();
    currentTraveler.findLastTripId(tripsData);
}

const greetUser = () => {
    const traveler = currentTraveler.displayFirstName();
    welcomeGreeting.innerText = `Welcome ${traveler}! Where do you want to go next?`;
    let date = new Date();
    todayDate = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
    updateTotalSpentOnTrips();
}

const getCurrentYearTrips = () => {
  const yearStart = `20${todayDate[2] + todayDate[3]}/01/01`;
  const yearEnd = `20${todayDate[2] + todayDate[3]}/12/31`;
  return currentTraveler.getTripsBetweenDates(yearStart, yearEnd);
}

const updateTotalSpentOnTrips = () => {
  currentTraveler.getUserTrips(tripsData);
  let dest = new Destination(destinationData);
  const tripsInCurrentYear = getCurrentYearTrips();
  let total = (dest.getTotalCost(tripsInCurrentYear)).toLocaleString("en-US");
  totalSpent.innerText = `You've spent $${total} on trips this year!`;
}

const updateTotalSpentOnTripsNewTrip = () => {
  currentTraveler.getUserTrips(tripsData);
  let dest = new Destination(destinationData);
  const tripsInCurrentYear = getCurrentYearTrips();
  let total = dest.getTotalCost(tripsInCurrentYear);
  const newTripTotal = dest.getTotalCost(currentTraveler.newTrip);
  let totalAfterNewTrip = (total + newTripTotal).toLocaleString("en-US");
  totalSpent.innerText = `You've spent $${totalAfterNewTrip} on trips this year!`;
}

const displayTrips = () => {
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

const populateOptions = () => {
    inputDestination.innerHTML = `<option value="" disabled selected>Select a destination</option>`;
    destinationData.forEach((place) => {
      inputDestination.innerHTML += `<option value="${place.id}">${place.destination}</option>`;
    });
}

const createNewTrip = () => {
    let date = inputDate.value;
    const duration = inputDuration.value;
    const travelers = inputTravelers.value;
    const destination = inputDestination.value;
    const id = currentTraveler.findLastTripId(tripsData) + 1;
    date = date.split('-').join('/');
    var info = {
        id: parseInt(id),
        userID: parseInt(userId),
        destinationID: parseInt(destination),
        travelers: parseInt(travelers),
        date: date,
        duration: parseInt(duration),
        status: "pending",
        suggestedActivities: []
        };
    newTrip = info;
}

const showNewTripRequest = () => {
    displayNewTripContainer();
    createNewTripCard();
}

const displayNewTripCost = () => {
    return currentTraveler.createNewTripValue(newTrip, destinationData);
}

const displayNewTripContainer = () => {
    tripCards.classList.add('hidden');
    newTripContainer.classList.remove('hidden');
}

const displayCardsContainer = () => {
    tripCards.classList.remove('hidden');
    newTripContainer.classList.add('hidden');
}

const createNewTripCard = () => {
    destinationData.forEach((place) => {
        if (newTrip.destinationID === place.id) {
          let color = newTrip.status === "approved" ? "teal" : "pink";
          const cost = displayNewTripCost();
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

const postNewTrip = () => {
    postData(newTrip);
    currentTraveler.trips.push(newTrip);
    displayTrips();
    displayCardsContainer();
}

const cancelNewTrip = () => {
    clearNewTripForm();
    displayCardsContainer();
}

const clearNewTripForm = () => {
    inputDate.value = '';
    inputDuration.value = 1;
    inputTravelers.value = 1;
    inputDestination.value ='';
}

const displayMainPage = () => {
    loginPage.classList.add('hidden');
    topMainPage.classList.remove('hidden');
    bottomMainPage.classList.remove('hidden');
}

const validateLogin = () => {
    let user = inputUsername.value;
    userId = parseInt(user[8]+user[9]);
    if(inputPassword.value === "travel" && 0 < userId && userId < 51 &&  inputUsername.value === `traveler${userId}`){
      event.preventDefault();
      createTraveler(userId);
      displayMainPage();
    } else if (inputPassword.value === '' || inputUsername.value === '') {
      errorLogin.innerText = "Please fill out all the fields."
    } else {
      event.preventDefault();
      errorLogin.innerText = "Incorrect Username or Password! Try again!"
    }
}


// ****** event listener ******
window.addEventListener('load', displayData);
formButton.addEventListener('click', (event) => {
  if(inputDate.value === '' || inputDestination.value === ''){
      errorMessage.innerText = 'Fill all the spaces!';
  } else{
      event.preventDefault();
      createNewTrip();
      showNewTripRequest(newTrip);
      errorMessage.innerText = '';
  }
});
confirmButton.addEventListener('click', postNewTrip);
cancelButton.addEventListener('click', cancelNewTrip);
loginButton.addEventListener('click', validateLogin);