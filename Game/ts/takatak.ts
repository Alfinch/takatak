class Game {

  private _graphics: Graphics;
  private _grid: Grid;
  private _textBar: TextBar;
  private _input: InputManager;
  private _parser: InputParser;
  private _levels: Levels;

  private _intervalID: number; 

  private _MS_PER_TICK = 500;

  constructor(stageID: string) {

    this._graphics = new Graphics(stageID);

    this._grid = new Grid({
      graphics: this._graphics,
      offset: { x: 200, y: -40 },
      columns: 10,
      rows: 15,
      unit: 40
    });

    this._textBar = new TextBar(this._graphics);

    this._input = new InputManager();

    this._parser = new InputParser();

    this._levels = new Levels([
      'levels/level1.xml'
    ], () => {

      // Once the levels have loaded, start the first level
      this.Play(this._levels.GetNextLevel())
    })
  }

  Play(level: ILevel) {

    this.DrawGameInterface(level);

    var r = 0, t = 0, p = false;

    // Start interval
    this._intervalID = setInterval(() => {
      console.log('R:' + r + ', T:' + t + ', P:' + p);

      // If the last round is complete, end the game
      if (r == level.length) {
        this.EndGame(true);
        return;
      }

      // Get the current round
      var round = level.rounds[r];

      if (round != null) {
        // Get the current tick
        var tick = round.ticks[t];

        // Increment tick
        t = (t + 1) % round.length;
      } else {
        t = (t + 1) % 16;
      }

      // Increment round
      if (t === 0) {
        if (p === false) r++;
        p = !p;
      }

      // Tick the game
      this.Tick(tick);
    }, this._MS_PER_TICK);
  }

  Tick(tick: ITick) {

    // Move enemies
    this._grid.Move(this._MS_PER_TICK);

    // Make enemies
    if (tick != null) {
      tick.slots.forEach((enemy: string, index: number) => {
        console.log(index + ': ' + enemy);
        this._grid.AddEnemy(enemy, index);
      });
    }
  }

  EndGame(win: boolean) {
    clearInterval(this._intervalID);
    this._graphics.ClearAll();
    console.log('You ' + win ? 'won!' : 'lost!');
  }

  DrawGameInterface(level: ILevel) {
    this._graphics.DrawGraphic({
      name: level.background,
      layer: 'background'
    });
    this._graphics.DrawGraphic({
      name: 'textBar',
      layer: 'interface'
    });
  }
}