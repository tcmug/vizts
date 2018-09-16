import { Point, PointList } from "./Point";

export class Polygon {
	points: PointList;

	constructor(points: PointList) {
		this.points = points;
	}

	containsPoint(point: Point) {
		var j = this.points.length - 1;
		var oddPoints = false;

		for (var i = 0; i < this.points.length; i++) {
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
	var oddNodes = false;

	for (var polyI = 0; polyI < polygons.length; polyI++) {
		for (var i = 0; i < polygons[polyI].points.length; i++) {
			var j = i + 1;
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
							(polygons[polyI].points[j].y - polygons[polyI].points[i].y)) *
							(polygons[polyI].points[j].x - polygons[polyI].points[i].x) <
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
	var end = new Point(endt.x, endt.y);
	end.sub(start);

	var dist = end.length();
	var theCos = end.x / dist;
	var theSin = end.y / dist;

	for (var polyI = 0; polyI < polygons.length; polyI++) {
		for (var i = 0; i < polygons[polyI].points.length; i++) {
			var j = i + 1;
			if (j == polygons[polyI].points.length) j = 0;

			var sX = polygons[polyI].points[i].x - start.x;
			var sY = polygons[polyI].points[i].y - start.y;
			var eX = polygons[polyI].points[j].x - start.x;
			var eY = polygons[polyI].points[j].y - start.y;
			if (
				(sX == 0 && sY == 0 && eX == end.x && eY == end.y) ||
				(eX == 0 && eY == 0 && sX == end.x && sY == end.y)
			) {
				return true;
			}

			var rotSX = sX * theCos + sY * theSin;
			var rotSY = sY * theCos - sX * theSin;
			var rotEX = eX * theCos + eY * theSin;
			var rotEY = eY * theCos - eX * theSin;
			if ((rotSY < 0 && rotEY > 0) || (rotEY < 0 && rotSY > 0)) {
				var crossX = rotSX + ((rotEX - rotSX) * (0 - rotSY)) / (rotEY - rotSY);
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

	var points: PointList = [start];
	for (var polyI = 0; polyI < polygons.length; polyI++) {
		for (var i = 0; i < polygons[polyI].points.length; i++) {
			points.push(polygons[polyI].points[i]);
		}
	}
	points.push(end);

	var treeCount = 1;

	var bestJ = 0;
	var bestI = 0;
	var bestDist: number = 0;
	const INF: number = 999999;

	while (bestJ < points.length - 1) {
		bestDist = INF;
		for (var i = 0; i < treeCount; i++) {
			for (var j = treeCount; j < points.length; j++) {
				if (lineInPolygonList(points[i], points[j], polygons)) {
					var newDist = points[i].totalDist + points[i].distanceTo(points[j]);
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

		points[bestJ].prev = bestI;
		points[bestJ].totalDist = bestDist;

		var temp = points[bestJ];
		points[bestJ] = points[treeCount];
		points[treeCount] = temp;

		treeCount++;
	}

	var i = treeCount - 1;
	var solution: PointList = [points[i]];

	while (i > 0) {
		i = points[i].prev;
		solution.push(points[i]);
	}

	return solution.reverse();
}
