import { expect } from 'chai';
import Trip from '../src/Trip';
import tripsData from '../test/data/Trip-sample-data.js';

describe('Trip', () => {
    let trip1;
    let trip2
    beforeEach(() => {
      trip1 = new Trip(tripsData[0]);
      trip2 = new Trip(tripsData[2])
    })
    it('should be a function', function () {
      expect(Trip).to.be.a('function');
    });
    it('should have an id', function () {
        expect(trip1.id).to.be.a("number");
        expect(trip1.id).to.equal(1);
        expect(trip2.id).to.equal(3);
    });
    it('should have a user id', function () {
        expect(trip1.userID).to.be.a("number");
        expect(trip1.userID).to.equal(44);
        expect(trip2.userID).to.equal(31);
    });
    it('should have a destination ID', function () {
        expect(trip1.destinationID).to.be.a("number");
        expect(trip1.destinationID).to.equal(49);
        expect(trip2.destinationID).to.equal(22);
    });
    it('should have amount of travelers', function () {
        expect(trip1.travelers).to.be.a("number");
        expect(trip1.travelers).to.equal(1);
        expect(trip2.travelers).to.equal(4);
    });
    it('should have a date', function () {
        expect(trip1.date).to.be.a("string");
        expect(trip1.date).to.equal("2022/09/16");
        expect(trip2.date).to.equal("2022/05/22");
    });
    it('should have a duration', function () {
        expect(trip1.duration).to.be.a("number");
        expect(trip1.duration).to.equal(8);
        expect(trip2.duration).to.equal(17);
    });
    it('should have a status', function () {
        expect(trip1.status).to.be.a("string");
        expect(trip1.status).to.equal("approved");
        expect(trip2.status).to.equal("pending");
    });
    it('should have suggested activities', function () {
        expect(trip1.suggestedActivities).to.be.a("array");
        expect(trip1.suggestedActivities).to.deep.equal([]);
        expect(trip2.suggestedActivities).to.deep.equal([]);
    });
})