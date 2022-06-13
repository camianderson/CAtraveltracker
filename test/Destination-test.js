import { expect } from 'chai';
import Destination from '../src/Destination';
import destinationData from '../test/data/Destination-sample-data.js';
import tripsData from '../test/data/Trip-sample-data.js';
import Traveler from '../src/Traveler';
import travelersData from '../test/data/Traveler-sample-data.js';

describe('Destination', () => {
    let destination;
    beforeEach(() => {
        destination = new Destination(destinationData);
    });
    it('should be a function', function () {
        expect(Destination).to.be.a('function');
    });
    it('should be able to have destinations', function () {
        expect(destination.destinations).to.equal(destinationData);
    });
    it('should get a yearly total cost of trips', function () {
        const traveler1 = new Traveler(travelersData[5]);
        const traveler2 = new Traveler(travelersData[6]);
        traveler1.getUserTrips(tripsData);
        traveler2.getUserTrips(tripsData);
        expect(destination.getTotalCost(traveler1.trips)).to.be.a("number");
        expect(destination.getTotalCost(traveler1.trips)).to.equal(30338);
        expect(destination.getTotalCost(traveler2.trips)).to.equal(20262);
    });
    it('should get destination by id', function () {
        expect(destination.getDestinationByID(1)).to.be.an("object");
        expect(destination.getDestinationByID(8)).to.equal(destinationData[7]);
        expect(destination.getDestinationByID(2)).to.equal(destinationData[1]);
    });
    it('should get destination by name', function () {
        expect(destination.getDestinationByName("Stockholm, Sweden")).to.be.an("object");
        expect(destination.getDestinationByName("Stockholm, Sweden")).to.equal(destinationData[1]);
        expect(destination.getDestinationByName("Toronto, Canada")).to.equal(destinationData[9]);
    });
})