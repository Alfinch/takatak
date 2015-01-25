var Cell = (function () {
    function Cell(x, y) {
        this.damage = 0;
        this.occupied = false;
        this.x = x;
        this.y = y;
    }
    Cell.prototype.Reset = function () {
        this.damage = 0;
        this.occupied = false;
    };
    return Cell;
})();
var Graphics = (function () {
    function Graphics(stageID) {
        // Fetch stage
        this._stage = Snap('#' + stageID);

        // Create layers
        this._layers = {};
        this._layers['background'] = this._stage.group();
        this._layers['sprites'] = this._stage.g();
        this._layers['effects'] = this._stage.g();
        this._layers['interface'] = this._stage.g();
        this._layers['text'] = this._stage.g();

        // Create graphics cache
        this._graphics = {};
    }
    Graphics.prototype.DrawGraphic = function (args, callback) {
        var _this = this;
        // Attempt to fetch layer and graphic
        var l = this._layers[args.layer];
        var g = this._graphics[args.name];

        // Check if layer exists
        if (l == null)
            throw new Error('Attempted to draw to invalid layer ' + args.layer);
        else if (g == null) {
            console.log('Loading new graphic: ' + args.name);
            Snap.load('svg/' + args.name + '.svg', function (loaded) {
                g = loaded.select('svg');
                _this._graphics[args.name] = g;
                addSvg();
            });
        } else
            addSvg();

        // Copy the svg to the layer
        var addSvg = function () {
            var clone = g.clone();
            l.add(clone);
        };
    };

    Graphics.prototype.ClearLayer = function (layer) {
        // Attempt to fetch layer
        var l = this._layers[layer];

        // Check if layer exists
        if (l == null)
            throw new Error('Attempted to clear to invalid layer ' + layer);
        else
            l.selectAll().forEach(function (e) {
                return e.remove();
            });
    };
    return Graphics;
})();
var Grid = (function () {
    function Grid(args) {
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
var Levels = (function () {
    function Levels(levelURIs, callback) {
        this._levels = [];
        this._nextLevel = 0;

        this._PopulateLevels(levelURIs, callback);
    }
    Levels.prototype.GetNextLevel = function () {
        return this._levels[this._nextLevel];
        this._nextLevel = this._nextLevel + 1 % this._levels.length;
    };

    Levels.prototype._PopulateLevels = function (levelURIs, callback, index) {
        var _this = this;
        if (typeof index === "undefined") { index = 0; }
        this._AJAX(levelURIs[index], function (xml) {
            var level = _this._ParseLevel(xml);
            _this._levels.push(level);
            index++;
            if (index !== levelURIs.length)
                _this._PopulateLevels(levelURIs, callback, index);
            else
                callback();
        });
    };

    Levels.prototype._ParseLevel = function (xml) {
        var parser = new DOMParser();
        var root;
        var level = {};

        root = parser.parseFromString(xml, 'text/xml').documentElement;
        level.length = root.getAttribute('rounds');
        level.rounds = [];

        for (var i = 0; i < root.childNodes.length; i++) {
            var node = root.childNodes[i];
            switch (node.nodeName) {
                case 'title':
                    level.title = node.textContent;
                    break;
                case 'background':
                    level.background = node.textContent;
                    break;
                case 'round':
                    level.rounds[node.attributes.getNamedItem('index').value] = ParseRound(node);
            }
        }

        function ParseRound(root) {
            var round = {};

            var ticks = root.attributes.getNamedItem('ticks');
            round.length = ticks ? ticks.value : 16;
            round.ticks = [];

            for (var i = 0; i < root.childNodes.length; i++) {
                var node = root.childNodes[i];
                switch (node.nodeName) {
                    case 'tick':
                        round.ticks[node.attributes.getNamedItem('index').value] = (ParseTick(node));
                }
            }

            return round;
        }

        function ParseTick(root) {
            var tick = {};

            tick.slots = [];

            for (var i = 0; i < root.childNodes.length; i++) {
                var node = root.childNodes[i];
                switch (node.nodeName) {
                    case 'slot':
                        tick.slots[node.attributes.getNamedItem('column').value] = node.attributes.getNamedItem('enemy').value;
                }
            }

            return tick;
        }

        return level;
    };

    Levels.prototype._AJAX = function (uri, callback) {
        var request = new XMLHttpRequest();

        request.open('GET', uri, true);

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(this.response);
            } else {
                throw new Error('Server error during AJAX call');
            }
        };

        request.onerror = function () {
            throw new Error('Connection error during AJAX call');
        };

        request.send();
    };
    return Levels;
})();
var TextBar = (function () {
    function TextBar(graphics) {
    }
    return TextBar;
})();
var Game = (function () {
    function Game(stageID) {
        var _this = this;
        this._MS_PER_TICK = 500;
        this._graphics = new Graphics(stageID);

        this._grid = new Grid({
            x: 200,
            y: 0,
            col: 10,
            row: 13,
            unit: 40
        });

        this._textBar = new TextBar(this._graphics);

        this._input = new InputManager();

        this._parser = new InputParser();

        this._levels = new Levels([
            'levels/level1.xml'
        ], function () {
            // Once the levels have loaded, start the first level
            _this.Play(_this._levels.GetNextLevel());
        });
    }
    Game.prototype.Play = function (level) {
        var _this = this;
        // Draw background
        this._graphics.DrawGraphic({
            name: level.background,
            layer: 'background'
        });

        var r = 0, t = 0, p = false;

        // Start interval
        this._intervalID = setInterval(function () {
            console.log('R:' + r + ', T:' + t + ', P:' + p);

            // If the last round is complete, end the game
            if (r == level.length) {
                _this.EndGame(true);
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
                if (p === false)
                    r++;
                p = !p;
            }

            // Tick the game
            _this.Tick(tick);
        }, this._MS_PER_TICK);
    };

    Game.prototype.Tick = function (tick) {
        if (tick != null) {
            // Make enemies!
        }
        // Do stuff!
    };

    Game.prototype.EndGame = function (win) {
        clearInterval(this._intervalID);
        console.log('You ' + win ? 'won!' : 'lost!');
    };
    return Game;
})();
//# sourceMappingURL=takatak.js.map
