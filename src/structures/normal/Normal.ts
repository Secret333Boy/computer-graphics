export default class Normal3 {
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;
    
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public dot(normal: Normal3) {
        return  this.x * normal.x + 
                this.y * normal.y + 
                this.z * normal.z;
    }

    public add(normal: Normal3): Normal3 {
        return new Normal3(
          this.x + normal.x,
          this.y + normal.y,
          this.z + normal.z
        );
    }
    
    public subtract(normal: Normal3): Normal3 {
        return new Normal3(
          this.x - normal.x,
          this.y - normal.y,
          this.z - normal.z
        );
    }

    public scale(scalar: number): Normal3{
        return new Normal3(
            this.x * scalar,
            this.y * scalar,
            this.z * scalar
        )
    }   

    public normalize(): Normal3{
        const len = Math.sqrt(this.dot(this));
        return new Normal3(
            this.x / len,
            this.y / len,
            this.z / len
        )
    } 
}