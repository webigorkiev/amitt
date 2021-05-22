import Amitt from "@/index";
import type {Handler, EventType} from "@/index";
import { expect } from 'chai';

describe("amitt", () => {
    const amittObj = new Amitt();

    describe("method`s properties", () => {
        it('should default export be a function', () => {
            expect(Amitt).to.be.a('function');
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
})