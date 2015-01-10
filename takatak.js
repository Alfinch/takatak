(function() {
  var Game;

  Game = (function() {
    var colors, currentTick, draw, gameString, interval, msPerCycle, msPerTick, numberOfLetters, ticksPerCycle;

    draw = null;

    interval = null;

    ticksPerCycle = 16;

    msPerCycle = 8000;

    msPerTick = msPerCycle / ticksPerCycle;

    currentTick = 0;

    numberOfLetters = 0;

    gameString = '';

    colors = {
      bg: '#1c1f24',
      panel: '#535d6c',
      red: '#c83737'
    };

    function Game(stageID) {
      var background, onkeypress, ui;
      draw = SVG(stageID);
      background = draw.group().id('background');
      game.background = background;
      background.rect(800, 600).fill(colors.bg);
      background.rect(800, 100).y(500).fill(colors.panel);
      ui = draw.group().id('ui');
      game.ui = ui;
      game.ui.timerBar = ui.rect(0, 10).y(510).fill(colors.red).id('timer-bar');
      interval = setInterval(tick, msPerTick);
      onkeypress = keypress;
    }

    Game.prototype.tick = function() {
      var tickCount;
      if (tickCount === 0) {
        gameString = '';
        numberOfLetters = 0;
      }
      game.ui.timerBar.width(tickCount * 800 / ticksPerCycle).animate(millisecondsPerTick, '>').attr({
        width: (tickCount + 1) * 800 / ticksPerCycle
      });
      return tickCount = (tickCount + 1) % ticksPerCycle;
    };

    Game.prototype.keypress = function(e) {
      var chCode, char;
      if (numberOfLetters + 1 > 16) {
        return;
      }
      e = e || window.event;
      chCode = e.which || e.keyCode;
      if (chCode >= 97 || chCode <= 122) {
        char = String.fromCharCode(chCode);
        gameString += char;
      }
      switch (chCode) {
        case 37:
          gameString += 'w';
          break;
        case 38:
          gameString += 'n';
          break;
        case 39:
          gameString += 'e';
          break;
        case 40:
          gameString += 's';
      }
      console.log(gameString);
      return numberOfLetters++;
    };

    return Game;

  })();

}).call(this);

//# sourceMappingURL=takatak.js.map
