(function() {
  'use strict';
  this.Game = this.Game || function() {};

  this.Game.prototype.constructor = new function(stageID) {
    console.log('Game.constructor');
    Game.Global.SVG = Snap('stageID');
    Game.Graphics.load();
    return Gmae.Graphics.SVG.append(Game.Graphics.Sprite.Background);
  };

}).call(this);

//# sourceMappingURL=takatak.constructor.js.map
