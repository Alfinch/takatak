var Cell = (function () {
    function Cell(args) {
        this._grid = args.grid;
        this._col = args.col;
        this._row = args.row;
        this.x = args.x;
        this.y = args.y;
        this.damage = 0;
        this.occupied = false;
        this.endCell = args.endCell || false;
    }
    Cell.prototype.Reset = function () {
        this.damage = 0;
        this.occupied = false;
    };

    Cell.prototype.Up = function () {
        return this._row === 0 ? this : this._grid.GetCell(this._col, this._row - 1);
    };

    Cell.prototype.Down = function () {
        return this._row + 1 === this._grid.rows ? this : this._grid.GetCell(this._col, this._row + 1);
    };

    Cell.prototype.Left = function () {
        return this._col === 0 ? this : this._grid.GetCell(this._col - 1, this._row);
    };

    Cell.prototype.Right = function () {
        return this._col + 1 === this._grid.colums ? this : this._grid.GetCell(this._col + 1, this._row);
    };
    return Cell;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Enemy = (function () {
    function Enemy(graphics, cell, sprite, health) {
        var _this = this;
        this._graphics = graphics;
        this.cell = cell;
        this.health = health;
        this.escaped = false;

        this.cell.occupied = true;

        this._graphics.DrawGraphic({
            name: sprite,
            layer: 'sprites'
        }, function (sprite) {
            _this._sprite = sprite;
            _this._sprite.attr({
                x: _this.cell.x,
                y: _this.cell.y
            });
        });
    }
    Enemy.prototype.SetCell = function (newCell) {
        if (!newCell.occupied) {
            this.cell.occupied = false;
            this.cell = newCell;
            this.cell.occupied = true;
        }
    };

    Enemy.prototype.Move = function (duration) {
        this._sprite.animate({
            x: this.cell.x,
            y: this.cell.y
        }, duration, mina.easeinout);
    };

    Enemy.prototype.TakeDamage = function () {
        this.health -= this.cell.damage;
        this.cell.damage = 0;
    };

    Enemy.prototype.Escape = function () {
        if (this.cell.endCell)
            this.escaped = true;
    };
    return Enemy;
})();

var Pawn = (function (_super) {
    __extends(Pawn, _super);
    function Pawn(graphics, cell) {
        _super.call(this, graphics, cell, 'pawn', 100);
    }
    Pawn.prototype.Move = function (duration) {
        this.SetCell(this.cell.Down());
        Math.random() > 0.5 ? this.SetCell(this.cell.Left()) : this.SetCell(this.cell.Right());
        _super.prototype.Move.call(this, duration);
    };
    return Pawn;
})(Enemy);
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
        // Copy the svg to the layer
        var addSvg = function () {
            var clone = g.clone();
            l.add(clone);
            if (callback != null)
                callback(clone);
        };

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
    };

    Graphics.prototype.ClearLayer = function (layer) {
        // Attempt to fetch layer
        var l = this._layers[layer];

        // Check if layer exists
        if (l == null)
            throw new Error('Attempted to clear to invalid layer ' + layer);
        else
            l.selectAll('g>*').forEach(function (e) {
                return e.remove();
            });
    };

    Graphics.prototype.ClearAll = function () {
        for (var layer in this._layers)
            this.ClearLayer(layer);
    };
    return Graphics;
})();
var Grid = (function () {
    function Grid(args) {
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
    Grid.prototype.GetCell = function (col, row) {
        return this._cells[col][row];
    };

    Grid.prototype.AddEnemy = function (enemy, index) {
        switch (enemy) {
            case 'pawn':
                this._enemies.push(new Pawn(this._graphics, this.GetCell(index, 0)));
                break;
        }
    };

    Grid.prototype.Move = function (duration) {
        var gameOver = false;

        this._enemies.forEach(function (enemy) {
            return enemy.Move(duration);
        });
        this._enemies.forEach(function (enemy) {
            return enemy.TakeDamage();
        });
        this._enemies.forEach(function (enemy) {
            if (enemy.Escape())
                gameOver = true;
        });

        return gameOver;
    };
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
        ], function () {
            // Once the levels have loaded, start the first level
            _this.Play(_this._levels.GetNextLevel());
        });
    }
    Game.prototype.Play = function (level) {
        var _this = this;
        this.DrawGameInterface(level);

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
        var _this = this;
        // Move enemies
        this._grid.Move(this._MS_PER_TICK);

        // Make enemies
        if (tick != null) {
            tick.slots.forEach(function (enemy, index) {
                console.log(index + ': ' + enemy);
                _this._grid.AddEnemy(enemy, index);
            });
        }
    };

    Game.prototype.EndGame = function (win) {
        clearInterval(this._intervalID);
        this._graphics.ClearAll();
        console.log('You ' + win ? 'won!' : 'lost!');
    };

    Game.prototype.DrawGameInterface = function (level) {
        this._graphics.DrawGraphic({
            name: level.background,
            layer: 'background'
        });
        this._graphics.DrawGraphic({
            name: 'textBar',
            layer: 'interface'
        });
    };
    return Game;
})();
//# sourceMappingURL=takatak.js.map
