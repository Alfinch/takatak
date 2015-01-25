class Grid {

  private _graphics: Graphics;
  private _cells: Cell[][];
  private _enemies: Enemy[];
  colums: number;
  rows: number;

  constructor(args: {
    graphics: Graphics;
    offset: { x: number; y: number };
    columns: number;
    rows: number;
    unit: number;
  }) {

    this._graphics = args.graphics;
    this._enemies = [];
    this.colums = args.columns;
    this.rows = args.rows;

    // Create cells
    this._cells = [];

    for (var i = 0; i < args.columns; i++) {
      this._cells[i] = [];

      for (var j = 0; j < args.rows; j++) {

        var x = args.offset.x + i * args.unit;
        var y = args.offset.y + j * args.unit;

        this._cells[i][j] = new Cell({
          grid: this,
          col: i,
          row: j,
          x: x,
          y: y,
          endCell: j + 1 === this.rows
        });
      }
    }
  }

  GetCell(col: number, row: number) {
    return this._cells[col][row];
  }

  AddEnemy(enemy: string, index: number) {
    switch (enemy) {
      case 'pawn':
        this._enemies.push(new Pawn(this._graphics, this.GetCell(index, 0)));
        break;
    }
  }

  Move(duration: number) {
    var gameOver = false;

    this._enemies.forEach((enemy: Enemy) => enemy.Move(duration));
    this._enemies.forEach((enemy: Enemy) => enemy.TakeDamage());
    this._enemies.forEach((enemy: Enemy) => {
      if (enemy.Escape()) gameOver = true;
    });

    return gameOver;
  }
} 