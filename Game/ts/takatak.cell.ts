class Cell {

  private _grid: Grid;
  private _col: number;
  private _row: number;
  x: number;
  y: number;
  damage: number;
  occupied: boolean;
  endCell: boolean;

  constructor(args: {
    grid: Grid;
    col: number;
    row: number;
    x: number;
    y: number;
    endCell?: boolean;
  }) {
    this._grid = args.grid;
    this._col = args.col;
    this._row = args.row;
    this.x = args.x;
    this.y = args.y;
    this.damage = 0;
    this.occupied = false;
    this.endCell = args.endCell || false;
  }

  Reset() {
    this.damage = 0;
    this.occupied = false;
  }

  Up() {
    return this._row === 0 ?
      this :
      this._grid.GetCell(this._col, this._row - 1);
  }

  Down() {
    return this._row + 1 === this._grid.rows ?
      this :
      this._grid.GetCell(this._col, this._row + 1);
  }

  Left() {
    return this._col === 0 ?
      this :
      this._grid.GetCell(this._col - 1, this._row);
  }

  Right() {
    return this._col + 1 === this._grid.colums ?
      this :
      this._grid.GetCell(this._col + 1, this._row);
  }
} 