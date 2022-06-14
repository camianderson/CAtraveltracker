import { expect } from 'chai';
import Traveler from '../src/Traveler';
import travelersData from '../test/data/Traveler-sample-data.js';
import destinationData from '../test/data/Destination-sample-data.js';
import tripsData from '../test/data/Trip-sample-data.js';

describe('Traveler', () => {
    let traveler1;
    let traveler2;
    let traveler3;
    let traveler4;
    beforeEach(() => {
      traveler1 = new Traveler(travelersData[0]);
      traveler2 = new Traveler(travelersData[2]);
      traveler3 = new Traveler(travelersData[5]);
      traveler4 = new Traveler(travelersData[6]);
    });
    it('should be a function', function () {
        expect(Traveler).to.be.a('function');
    });
    it('should have an id', function () {
        expect(traveler1.id).to.be.a("number");
        expect(traveler1.id).to.equal(1);
        expect(traveler2.id).to.equal(3);
    });
    it('should have a name', function () {
        expect(traveler1.name).to.be.a("string");
        expect(traveler1.name).to.equal("Ham Leadbeater");
        expect(traveler2.name).to.equal("Sibby Dawidowitsch");
    });
    it('should have a traveler type', function () {
        expect(traveler1.travelerType).to.be.a("string");
        expect(traveler1.travelerType).to.equal("relaxer");
        expect(traveler2.travelerType).to.equal("shopper");
    });
    it("should start with travelers trips as an empty array", () => {
        expect(traveler1.trips).to.deep.equal([]);
        expect(traveler2.trips).to.deep.equal([]);
    });
    it("should start with travelers new trips as an empty array", () => {
        expect(traveler1.newTrip).to.deep.equal([]);
        expect(traveler2.newTrip).to.deep.equal([]);
    });
    it('should display first name', function () {
        expect(traveler1.displayFirstName()).to.be.a("string");
        expect(traveler1.displayFirstName()).to.equal("Ham");
        expect(traveler2.displayFirstName()).to.equal("Sibby");
    });
    it('should get all users trips', function () {
        traveler1.getUserTrips(tripsData);
        traveler2.getUserTrips(tripsData);
        expect(traveler1.trips).to.be.an("array");
        expect(traveler1.trips).to.deep.equal([{
            "id": 5,
            "userID": 1,
            "destinationID": 29,
            "travelers": 3,
            "date": "2022/04/30",
            "duration": 18,
            "status": "pending",
            "suggestedActivities": []
            }]);
        expect(traveler2.trips).to.deep.equal([]);
    });
    it('should get new trip value', function () {
        traveler3.getUserTrips(tripsData);
        traveler4.getUserTrips(tripsData);
        expect(traveler3.createNewTripValue(traveler3.trips[0], destinationData)).to.be.a("string");
        expect(traveler3.createNewTripValue(traveler3.trips[0], destinationData)).to.equal("21450.00");
        expect(traveler4.createNewTripValue(traveler4.trips[0], destinationData)).to.equal("11715.00");
    });
    it("should have a new trip in the array", () => {
        traveler3.getUserTrips(tripsData);
        traveler4.getUserTrips(tripsData);
        traveler3.createNewTripValue(traveler3.trips[0], destinationData);
        traveler4.createNewTripValue(traveler4.trips[0], destinationData);
        expect(traveler3.newTrip).to.deep.equal([traveler3.trips[0]]);
        expect(traveler4.newTrip).to.deep.equal([traveler4.trips[0]]);
    });
    it('should find last trip id', function () {
        traveler3.getUserTrips(tripsData);
        traveler4.getUserTrips(tripsData);
        expect(traveler3.findLastTripId(traveler3.trips)).to.be.a("number");
        expect(traveler3.findLastTripId(traveler3.trips)).to.equal(13);
        expect(traveler4.findLastTripId(traveler4.trips)).to.equal(16);
    });
    it('should get trips in between dates', function () {
        traveler3.getUserTrips(tripsData);
        traveler4.getUserTrips(tripsData);
        expect(traveler3.getTripsBetweenDates("2022/05/31", "2022/06/31")).to.be.an("array");
        expect(traveler3.getTripsBetweenDates("2022/05/31", "2022/06/31")).to.deep.equal([traveler3.trips[1]]);
        expect(traveler4.getTripsBetweenDates("2022/05/31", "2022/06/31")).to.deep.equal([traveler4.trips[0]]);
    });
})