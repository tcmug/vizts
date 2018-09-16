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
		new Point(10, 10),
		new Point(50, 10),
		new Point(30, 30),
		new Point(50, 50),
		new Point(10, 50),
		new Point(10, 10)
	]);
	const huge = new Polygon([
		new Point(-100, -100),
		new Point(100, -100),
		new Point(100, 100),
		new Point(-100, 100),
		new Point(-100, -100)
	]);
	const path = [new Point(35, 15), new Point(35, 45)];
	const path2 = [new Point(15, 15), new Point(15, 45)];
	const polygonList = [polygon];
	const polygonListCapsulated = [polygon, huge];
	it("should not contain point", () => {
		expect(polygon.containsPoint(new Point(-1, -1))).to.equal(false);
	});
	it("should contain a point", () => {
		expect(polygon.containsPoint(new Point(15, 15))).to.equal(true);
	});
	it("is within this polygon", () => {
		expect(pointInPolygonList(path[0], polygonList)).to.equal(true);
	});
	it("is not within this huge polygon set", () => {
		expect(pointInPolygonList(path[0], polygonListCapsulated)).to.equal(false);
	});
	it("does not contain this path", () => {
		expect(lineInPolygonList(path[0], path[1], polygonList)).to.equal(false);
	});
	it("contains this path", () => {
		expect(lineInPolygonList(path2[0], path2[1], polygonList)).to.equal(true);
	});
	it("should have this shortest path", () => {
		console.log(shortestPathInPolygonList(path[0], path[1], polygonList));
	});
});

describe("Another polygon", () => {
	const polygon = new Polygon([
		new Point(10, 10),
		new Point(50, 10),
		new Point(30, 30),
		new Point(50, 50),
		new Point(30, 70),
		new Point(50, 110),
		new Point(10, 110),

		new Point(10, 45),
		new Point(35, 30),
		new Point(10, 25),

		new Point(10, 10)
	]);
	const path = [new Point(35, 15), new Point(35, 100)];
	const polygonList = [polygon];

	it("should have this shortest path", () => {
		console.log(shortestPathInPolygonList(path[0], path[1], polygonList));
	});
});
