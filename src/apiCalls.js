import {updateData} from "./scripts.js"
let tripsData, travelerData, destinationData;

export let getData = (dataType) => {
    return fetch(`http://localhost:3001/api/v1/${dataType}`)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export let getAll = () => {
  travelerData = getData("travelers");
  destinationData = getData("destinations");
  tripsData = getData("trips");
  return Promise.all(
    [
      tripsData, 
      travelerData, 
      destinationData
    ]
  );
};

export let postData = (newTrip) => {
    return fetch(`http://localhost:3001/api/v1/trips`, {
    method: "POST",
    body: JSON.stringify(newTrip),
    headers: { "Content-Type": "application/json" },
  }).then(response => {
    if (!response.ok) {
      throw new Error('Please make sure all the fields are filled out.');
    } else {
      return response.json();
    }
  })
  .then(() => updateData())
  .catch((error) => {
    console.warn(error.message);
  });
}