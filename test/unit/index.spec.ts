import {AmittEmitter} from "@/index";
import type {Handler, EventType} from "@/index";
import { expect } from 'chai';

describe("amitt", () => {
    const amittObj = new AmittEmitter();

    describe("method`s properties", () => {
        it('should default export be a function', () => {
            expect(AmittEmitter).to.be.a('function');
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
        const event : EventType = "test";
        const handler:Handler = () => true;

        it("on add a new handler", () => {
            const result = amittObj.on(event, handler);
            expect(result).to.eql(true);
        });
        it("this will not add the same handler", () => {
            const result = amittObj.on(event, handler);
            expect(result).to.eql(false);
        });
        it("off handler", () => {
            const result = amittObj.off(event, handler);
            expect(result).to.eql(true);
        });
        it("this will not off the same handler", () => {
            const result = amittObj.off(event, handler);
            expect(result).to.eql(false);
        });
    });

    describe("events", () => {
        const event : EventType = "test";
        const handler:Handler = (p1, p2) => {

            return [p1, p2]
        };
        const handler2:Handler = p1 => {

            return [p1]
        };
        amittObj.on(event, handler);

        it("emit result", () => {
            const result = amittObj.emit(event, 1, 2);
            expect(result).is.a("array");
            expect(result[0]).to.eql([1, 2]);
        });
        amittObj.on(event, handler2);

        it("emit result 2 handler", () => {
            const result = amittObj.emit(event, 1, 2);
            expect(result).is.a("array");
            expect(result[0]).to.eql([1, 2]);
            expect(result[1]).to.eql([1]);
        });

        it("emit result off handler", () => {
            amittObj.off(event, handler);
            const result = amittObj.emit(event, 1);
            expect(result).is.a("array");
            expect(result[0]).to.eql([1]);
        });
    })
})