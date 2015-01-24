class Game {
    
  private _input:    InputManager;
  private _parser:   InputParser;
  private _graphics: Graphics; 
  private _grid:     Grid;
  private _textBar:  TextBar;

  constructor(stageID: string) {
    this._input    = new InputManager();
    this._parser   = new InputParser();
    this._graphics = new Graphics(stageID);
    this._grid     = new Grid();
    this._textBar  = new TextBar();
  }
}