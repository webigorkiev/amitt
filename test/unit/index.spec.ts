import {amitt} from "@/index";
import type {Handler, EventType} from "@/index";
import { expect } from 'chai';

describe("amitt", () => {

    describe("method`s properties", () => {
        const amittObj = amitt();

        it('should default export be a function', () => {
            expect(amitt).to.be.a('function');
        });
        it("on should be a function", () => {
            expect(amittObj)
                .to.have.property('on')
                .that.is.a('function');
        });
        it("off should be a function", () => {
            expect(amittObj)
                .to.have.property('off')
                .that.is.a('function');
        });
        it("emit should be a function", () => {
            expect(amittObj)
                .to.have.property('emit')
                .that.is.a('function');
        });
    });

    describe("checking the work of methods", () => {
        const amittObj = amitt();
        const event : EventType = "test";
        const handler:Handler = () => true;
        const result = amittObj.on(event, handler);
        const result2 = amittObj.on(event, handler);

        it("on add a new handler", () => {
            expect(result).to.eql(true);
        });
        it("this will not add the same handler", () => {
            expect(result2).to.eql(false);
        });
        it("off handler", () => {
            expect(amittObj.off(event, handler)).to.eql(true);
        });
        it("this will not off the same handler", () => {
            expect(amittObj.off(event, handler)).to.eql(false);
        });
    });

    describe("events", () => {
        const amittObj = amitt();
        const event : EventType = "test";
        const handler:Handler = (p1, p2) => {

            return [p1, p2]
        };
        const handler2:Handler = p1 => {

            return [p1]
        };
        amittObj.on(event, handler);
        const result = amittObj.emit(event, 1, 2);
        amittObj.on(event, handler2);
        const result2 = amittObj.emit(event, 1, 2);
        amittObj.off(event, handler);
        const result3 = amittObj.emit(event, 1);

        it("emit result", () => {
            expect(result).is.a("array");
            expect(result[0]).to.eql([1, 2]);
        });

        it("emit result 2 handler", () => {
            expect(result2).is.a("array");
            expect(result2[0]).to.eql([1, 2]);
            expect(result2[1]).to.eql([1]);
        });

        it("emit result off handler", () => {
            expect(result3).is.a("array");
            expect(result3[0]).to.eql([1]);
        });
    });

    describe("events once", () => {
        const amittObj = amitt();
        const event : EventType = "test";
        const handler:Handler = (p1, p2) => {

            return [p1, p2]
        };
        const handler2:Handler = p1 => {

            return [p1]
        };
        amittObj.once(event, handler);
        amittObj.once(event, handler2);
        const result1 = amittObj.emit(event, 1, 2);
        const result2 = amittObj.emit(event, 1, 2);

        it("emit result 2 once handler", () => {
            expect(result1).is.a("array");
            expect(result1[0]).to.eql([1, 2]);
            expect(result1[1]).to.eql([1]);
        });

        it("emit result 2 once handler again", () => {
            expect(result2).is.a("array");
            expect(result2).to.eql([]);
        });
    });

    describe("RegExp type of Event", () => {
        const amittObj = amitt();
        const event1 : EventType = "test_one";
        const event2 : EventType = "test_two";
        const event3 : EventType = "ts";
        const handler:Handler = (p1, p2) => {

            return [p1, p2]
        };
        const handler2:Handler = p1 => {

            return [p1]
        };
        const handler3:Handler = p1 => {

            return [p1]
        };
        amittObj.on(event1, handler);
        amittObj.on(event2, handler2);
        amittObj.on(event3, handler3);
        amittObj.off(event3, handler3);
        amittObj.on("ts", handler2);
        const result = amittObj.emit(/^test/, 1, 2);

        it("emit /^test/", () => {
            expect(result).is.a("array");
            expect(result.length).to.equal(2);
            expect(result[0]).to.eql([1, 2]);
            expect(result[1]).to.eql([1]);
        });
    })
})