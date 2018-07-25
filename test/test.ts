import { expect } from "chai";
import { Point, PointList } from "../src/client/Point";
import {
	Polygon,
	PolygonList,
	shortestPathInPolygonList,
	pointInPolygonList,
	lineInPolygonList
} from "../src/client/Polygon";

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';
describe("A polygon", () => {
	const polygon = new Polygon([
		{ x: 10, y: 10 } as Point,
		{ x: 100, y: 10 } as Point,
		{ x: 50, y: 100 } as Point,
		{ x: 100, y: 150 } as Point,
		{ x: 50, y: 150 } as Point,
		{ x: 15, y: 200 } as Point,
		{ x: 10, y: 10 } as Point
	]);
	const huge = new Polygon([
		{ x: -100, y: -100 } as Point,
		{ x: 100, y: -100 } as Point,
		{ x: 100, y: 100 } as Point,
		{ x: -100, y: 100 } as Point,
		{ x: -100, y: -100 } as Point
	]);
	const path = [
		{
			x: 15,
			y: 15
		} as Point,
		{
			x: 20,
			y: 20
		} as Point
	];
	const polygonList = [polygon];
	const polygonListCapsulated = [polygon, huge];
	it("should not contain point", () => {
		expect(polygon.containsPoint(new Point(-1, -1))).to.equal(false);
	});
	it("should contain a point", () => {
		expect(polygon.containsPoint(new Point(15, 15))).to.equal(true);
	});
	it("should have this shortest path", () => {
		console.log(shortestPathInPolygonList(path, polygonList));
	});
	it("doing 1", () => {
		console.log(pointInPolygonList(path[0], polygonList));
	});
	it("doing 2", () => {
		console.log(pointInPolygonList(path[0], polygonListCapsulated));
	});
	it("path", () => {
		console.log(lineInPolygonList(path[0], path[1], polygonList));
	});
});
