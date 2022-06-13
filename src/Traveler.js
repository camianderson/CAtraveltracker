class Traveler{
    constructor(travelersData){
        this.id = travelersData.id;
        this.name = travelersData.name;
        this.travelerType = travelersData.travelerType;
        this.trips = [];
        this.newTrip = [];
    }

    displayFirstName(){
        const firstName = this.name.split(" ");
        return firstName[0];
    }

    getUserTrips(tripsData) {
        this.trips = tripsData.filter((trip) => trip.userID === this.id);
    }

    createNewTripValue(newTripInfo, destinationData) {
        this.newTrip.push(newTripInfo);
        let subTotal = destinationData.reduce((sum, place) => {
          if (newTripInfo.destinationID === place.id) {
            let lodging = place.estimatedLodgingCostPerDay * newTripInfo.travelers * newTripInfo.duration;
            let flights = (place.estimatedFlightCostPerPerson * newTripInfo.travelers) * 2;
            sum += lodging + flights;
          }
          return sum;
        }, 0);
        let result = subTotal * 1.1;
        return result.toFixed(2);
    }

    findLastTripId(tripsData){
        const sortedTripData = tripsData.sort((lower, higher) => higher.id - lower.id);
        return sortedTripData[0].id;
    }
}

export default Traveler;