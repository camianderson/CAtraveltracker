export let getData = (dataType) => {
    return fetch(`http://localhost:3001/api/v1/${dataType}`)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export let postData = (dataType, newTrip) => {
    return fetch(`http://localhost:3001/api/v1/${dataType}`, {
    method: "POST",
    body: JSON.stringify(newTrip),
    headers: { "Content-Type": "application/json" },
  }).catch((error) => {
    console.warn(error.message);
  });
}