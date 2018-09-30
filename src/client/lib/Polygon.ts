import { Point, PointList } from "./Point";

export class Polygon {
	points: PointList;

	constructor(points: PointList) {
		this.points = points;
	}

	containsPoint(point: Point) {
		let j = this.points.length - 1;
		let oddPoints = false;

		for (let i = 0; i < this.points.length; i++) {
			if (
				(this.points[i].y < point.y && this.points[j].y >= point.y) ||
				(this.points[j].y < point.y && this.points[i].y >= point.y)
			) {
				if (
					this.points[i].x +
						((point.y - this.points[i].y) /
							(this.points[j].y - this.points[i].y)) *
							(this.points[j].x - this.points[i].x) <
					point.x
				) {
					oddPoints = !oddPoints;
				}
			}
			j = i;
		}
		return oddPoints;
	}
}

export type PolygonList = Polygon[];

export function pointInPolygonList(point: Point, polygons: PolygonList) {
	let oddNodes = false;

	for (let polyI = 0; polyI < polygons.length; polyI++) {
		for (let i = 0; i < polygons[polyI].points.length; i++) {
			let j = i + 1;
			if (j == polygons[polyI].points.length) j = 0;
			if (
				(polygons[polyI].points[i].y < point.y &&
					polygons[polyI].points[j].y >= point.y) ||
				(polygons[polyI].points[j].y < point.y &&
					polygons[polyI].points[i].y >= point.y)
			) {
				if (
					polygons[polyI].points[i].x +
						((point.y - polygons[polyI].points[i].y) /
							(polygons[polyI].points[j].y -
								polygons[polyI].points[i].y)) *
							(polygons[polyI].points[j].x -
								polygons[polyI].points[i].x) <
					point.x
				) {
					oddNodes = !oddNodes;
				}
			}
		}
	}

	return oddNodes;
}

export function lineInPolygonList(
	start: Point,
	endt: Point,
	polygons: PolygonList
) {
	let end = new Point(endt.x, endt.y);
	end.sub(start);

	let dist = end.length();
	let theCos = end.x / dist;
	let theSin = end.y / dist;

	for (let polyI = 0; polyI < polygons.length; polyI++) {
		for (let i = 0; i < polygons[polyI].points.length; i++) {
			let j = i + 1;
			if (j == polygons[polyI].points.length) j = 0;

			let sX = polygons[polyI].points[i].x - start.x;
			let sY = polygons[polyI].points[i].y - start.y;
			let eX = polygons[polyI].points[j].x - start.x;
			let eY = polygons[polyI].points[j].y - start.y;
			if (
				(sX == 0 && sY == 0 && eX == end.x && eY == end.y) ||
				(eX == 0 && eY == 0 && sX == end.x && sY == end.y)
			) {
				return true;
			}

			let rotSX = sX * theCos + sY * theSin;
			let rotSY = sY * theCos - sX * theSin;
			let rotEX = eX * theCos + eY * theSin;
			let rotEY = eY * theCos - eX * theSin;
			if ((rotSY < 0 && rotEY > 0) || (rotEY < 0 && rotSY > 0)) {
				let crossX =
					rotSX + ((rotEX - rotSX) * (0 - rotSY)) / (rotEY - rotSY);
				if (crossX >= 0 && crossX <= dist) return false;
			}

			if (
				rotSY == 0 &&
				rotEY == 0 &&
				(rotSX >= 0 || rotEX >= 0) &&
				(rotSX <= dist || rotEX <= dist) &&
				(rotSX < 0 || rotEX < 0 || rotSX > dist || rotEX > dist)
			) {
				return false;
			}
		}
	}

	return pointInPolygonList(
		new Point(start.x + end.x / 2, start.y + end.y / 2),
		polygons
	);
}

export function shortestPathInPolygonList(
	start: Point,
	end: Point,
	polygons: PolygonList
): PointList {
	if (
		!pointInPolygonList(start, polygons) ||
		!pointInPolygonList(end, polygons)
	) {
		return [];
	}

	//  If there is a straight-line solution, return with it immediately.
	if (lineInPolygonList(start, end, polygons)) {
		return [start, end];
	}

	let points: PointList = [start];
	for (let polyI = 0; polyI < polygons.length; polyI++) {
		for (let i = 0; i < polygons[polyI].points.length; i++) {
			points.push(polygons[polyI].points[i]);
		}
	}
	points.push(end);
	let totalDist = [];
	let prevList = [];

	for (let i = 0; i < points.length; i++) {
		totalDist.push(0);
		prevList.push(null);
	}

	let treeCount = 1;

	let bestJ = 0;
	let bestI = 0;
	let bestDist: number = 0;
	const INF: number = 999999;

	while (bestJ < points.length - 1) {
		bestDist = INF;
		for (let i = 0; i < treeCount; i++) {
			for (let j = treeCount; j < points.length; j++) {
				if (lineInPolygonList(points[i], points[j], polygons)) {
					let newDist =
						totalDist[i] + points[i].distanceTo(points[j]);
					if (newDist < bestDist) {
						bestDist = newDist;
						bestI = i;
						bestJ = j;
					}
				}
			}
		}

		if (bestDist == INF) {
			console.log("inf");
			return [];
		}

		prevList[bestJ] = bestI;
		totalDist[bestJ] = bestDist;

		let temp = points[bestJ];
		points[bestJ] = points[treeCount];
		points[treeCount] = temp;

		temp = prevList[bestJ];
		prevList[bestJ] = prevList[treeCount];
		prevList[treeCount] = temp;

		temp = totalDist[bestJ];
		totalDist[bestJ] = totalDist[treeCount];
		totalDist[treeCount] = temp;

		treeCount++;
	}

	let i = treeCount - 1;
	let solution: PointList = [points[i]];

	console.log("solution?", points, totalDist, treeCount - 1);
	console.log(prevList);

	while (i > 0) {
		i = prevList[i];
		solution.push(points[i]);
	}

	return solution.reverse();
}
