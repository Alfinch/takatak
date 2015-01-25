class Cell {

  x: number;
  y: number;
  damage: number = 0;
  occupied: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  Reset() {
    this.damage = 0;
    this.occupied = false;
  }
} 