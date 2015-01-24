var Graphics = (function () {
    function Graphics(stageID) {
        var _this = this;
        this._stage = Snap('#' + stageID);

        Snap.load('svg/background.svg', function (svg) {
            _this._stage.append(svg);
        });
    }
    return Graphics;
})();
var Grid = (function () {
    function Grid() {
    }
    return Grid;
})();
var InputManager = (function () {
    function InputManager() {
    }
    return InputManager;
})();
var InputParser = (function () {
    function InputParser() {
    }
    return InputParser;
})();
var TextBar = (function () {
    function TextBar() {
    }
    return TextBar;
})();
var Game = (function () {
    function Game(stageID) {
        this._input = new InputManager();
        this._parser = new InputParser();
        this._graphics = new Graphics(stageID);
        this._grid = new Grid();
        this._textBar = new TextBar();
    }
    return Game;
})();
//# sourceMappingURL=takatak.js.map
