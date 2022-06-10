import Destination from '../src/Destination';

class Traveler{
    constructor(travelersData){
        this.id = travelersData.id;
        this.name = travelersData.name;
        this.travelerType = travelersData.travelerType;
        this.trips = [];
        this.newTrip = [];
    }

    getUser(travelerData, userID) {
        const user = travelerData.find((traveler) => traveler.id === userID);
        return user;
    }

    displayFirstName(){
        const firstName = this.name.split(" ");
        return firstName[0];
    }

    getUserTrips(tripsData) {
        this.trips = tripsData.filter((trip) => trip.userID === this.id);
    }

    getCurrentTrips(date) {
        const currentTrips = this.trips.filter((trip) => {
            return trip.date === date;
        });
        return currentTrips;
    }

    getPastTrips(date) {
        const todayDate = new Date(date);
        const pastTrips = this.trips.filter((trip) => {
            let dateOfTrip = new Date(trip.date);
            return dateOfTrip < todayDate;
        });
        return pastTrips;
    }

    getFutureTrips(date) {
        const todayDate = new Date(date);
        const futureTrips = this.trips.filter((trip) => {
            let dateOfTrip = new Date(trip.date);
            return dateOfTrip > todayDate;
        });
        return futureTrips;
    }

    getPendingTrips() {
        const pendingTrips = this.trips.filter((trip) => {
            return trip.status === 'pending';
        });
        const sortPendingTrips = pendingTrips.sort((trip1, trip2) => {
            let trip1Date = new Date(trip1.date);
            let trip2Date = new Date(trip2.date);
            if(trip1Date > trip2Date) {
                return -1;
            }
        });
        return sortPendingTrips;
    }

    getTripsBetweenDates(date1, date2) {
        const start = new Date(date1);
        const end = new Date(date2);
        const tripsBetweenDates = this.trips.filter((trip) => {
            let tripDate = new Date(trip.date);
            return tripDate > start && tripDate < end;
        });
        return tripsBetweenDates;
    }

    getTotalSpentTrips(destinationData, date) {
        const currentDate = new Date(date);
        const yearStart = `${currentDate.getFullYear()}/01/01`;
        const yearEnd = `${currentDate.getFullYear()}/12/31`;
        const tripsInOneYear = this.getTripsBetweenDates(yearStart, yearEnd);
        const destination = new Destination(destinationData);
        return destination.getTotalCost(tripsInOneYear);
    }

    createNewTripValue(newTripInfo, destinationData) {
        console.log(newTripInfo)
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
}

export default Traveler;