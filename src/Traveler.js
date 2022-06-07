class Traveler{
    constructor(id, name, travelerType){
        this.id = id;
        this.name = name;
        this.travelerType = travelerType;
        this.trips = [];
    }

    getUser(travelerData, userID) {
        const user = travelerData.find((traveler) => traveler.id === userID);
        return user;
    }

    displayFirstName(){
        const firstName = this.name.split(" ");
        return fistName[0];
    }

    getUserTrips(trips) {
        this.trips = trips.filter((trip) => trip.userID === this.id);
    }

    getCurrentTrips(date) {
        const currentTrips = this.trips.filter((trip) => {
            return trip.date === date;
        });

        return currentTrips;
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
}

export default Traveler;