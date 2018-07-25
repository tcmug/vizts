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

export function shortestPathInPolygonList(
	path: PointList,
	polygons: PolygonList
) {
	return "heY";
}

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
	// double start.x, double start.y, double testEX, double testEY, polySet allPolys) {
	// double  theCos, theSin, dist, sX, sY, eX, eY, rotSX, rotSY, rotEX, rotEY, crossX ;
	// int     i, j, polyI ;

	var end = new Point(endt.x, endt.y);
	end.sub(start);

	// var end.x -= start.x;
	// var end.y -= start.y;
	// Math.sqrt(end.x*end.x+end.y*end.y);
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
