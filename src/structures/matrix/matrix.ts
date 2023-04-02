export class Matrix {
    private arr : number[][];
    constructor(arr: number[][]){
        this.arr = arr;
    }

    public multiply(other: Matrix): Matrix {
        let result = new Matrix([]);
        for (let i = 0; i < this.arr.length; i++) {
            result.arr[i] = [];
            for (let j = 0; j < other.arr[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < this.arr[0].length; k++) {
                    sum += this.arr[i][k] * other.arr[k][j];
                }
                result.arr[i][j] = sum;
            }
        }
        return result;
    }

    public 
}