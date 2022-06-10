class Destination {
    constructor(destinationData){
        this.destinations = destinationData
    }

    getTotalCost(trips) {
        const totalCost = trips.reduce((acc, trip) => {
            this.destinations.forEach((destination) => {
                if(destination.id === trip.destinationID) {
                    let totalLodgingCost = trip.duration * trip.travelers * destination.estimatedLodgingCostPerDay;
                    let totalFlightCost = trip.travelers * destination.estimatedFlightCostPerPerson;
                    let agentFee = 1.1;
                    acc += (totalLodgingCost + totalFlightCost)*agentFee;
                }
            });
            return acc;
        }, 0);
        const total = Math.ceil(totalCost,1)
        return total.toLocaleString("en-US");
    }

    getDestinationByID(destinationId) {
        const destination = this.destinations.find((destination) => destination.id === destinationId);
        return destination;
    }

    getDestinationByName(destinationName) {
        const destination = this.destinations.find((destination) => destination.destination === destinationName);
        return destination;
    }
}

export default Destination;