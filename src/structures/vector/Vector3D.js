"use strict";
exports.__esModule = true;
var Vector3D = /** @class */ (function () {
    function Vector3D(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector3D.prototype.add = function (vector) {
        return new Vector3D(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    };
    Vector3D.prototype.subtract = function (vector) {
        return new Vector3D(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    };
    Vector3D.prototype.multiply = function (number) {
        return new Vector3D(this.x * number, this.y * number, this.z * number);
    };
    Vector3D.prototype.dotProduct = function (vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    };
    Vector3D.prototype.crossProduct = function (vector) {
        return new Vector3D(this.y * vector.z - this.z * vector.y, this.z * vector.x - this.x * vector.z, this.x * vector.y - this.y * vector.x);
    };
    Object.defineProperty(Vector3D.prototype, "length", {
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        enumerable: false,
        configurable: true
    });
    return Vector3D;
}());
exports["default"] = Vector3D;
