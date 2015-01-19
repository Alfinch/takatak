(function() {
  'use strict';
  this.Game = this.Game || function() {};

  this.Game.Graphics = {
    Color: {
      background: '#373e48',
      panel: '#535d6c',
      red: '#c83737'
    },
    Layer: {},
    Sprite: {},
    load: function() {
      var sprite, svg;
      console.log('Game.Graphics.load');
      svg = Game.Global.SVG;
      sprite = Game.Graphics.Sprite;
      svg.load('../svg/background.svg', function(s) {
        sprite.background = s;
      });
    }
  };

}).call(this);

//# sourceMappingURL=takatak.graphics.js.map
