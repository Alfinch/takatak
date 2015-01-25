class Enemy {

  private _graphics: Graphics;
  private _sprite: Snap.Element;
  cell: Cell;
  health: number;
  escaped: boolean;

  constructor(graphics: Graphics, cell: Cell, sprite: string, health: number) {
    this._graphics = graphics;
    this.cell = cell;
    this.health = health;
    this.escaped = false;

    this.cell.occupied = true;

    this._graphics.DrawGraphic({
      name: sprite,
      layer: 'sprites'
    }, (sprite: Snap.Element) => {
      this._sprite = sprite;
      this._sprite.attr({
        x: this.cell.x,
        y: this.cell.y
      });
    });
  }

  SetCell(newCell: Cell) {
    if (!newCell.occupied) {
      this.cell.occupied = false;
      this.cell = newCell;
      this.cell.occupied = true;
    }
  }

  Move(duration: number) {
    this._sprite.animate({
      x: this.cell.x,
      y: this.cell.y
    }, duration, mina.easeinout);
  }

  TakeDamage() {
    this.health -= this.cell.damage;
    this.cell.damage = 0;
  }

  Escape() {
    if (this.cell.endCell) this.escaped = true;
  }
}

class Pawn extends Enemy {

  constructor(graphics: Graphics, cell: Cell) {
    super(graphics, cell, 'pawn', 100);
  }

  Move(duration: number) {
    this.SetCell(this.cell.Down());
    Math.random() > 0.5 ?
      this.SetCell(this.cell.Left()):
      this.SetCell(this.cell.Right());
    super.Move(duration);
  }
}