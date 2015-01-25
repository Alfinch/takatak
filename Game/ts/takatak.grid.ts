class Grid {

  private _cells: Cell[][];

  constructor(args: {
    x: number;
    y: number;
    col: number;
    row: number;
    unit: number;
  }) {

    // Create cells
    this._cells = [];
    for (var i = 0; i < args.col; i++) {
      this._cells[i] = [];
      for (var j = 0; j < args.row; j++) {
        var x = args.x + i * args.unit;
        var y = args.y + j * args.unit;
        this._cells[i][j] = new Cell(x, y);
      }
    }


  }
} 