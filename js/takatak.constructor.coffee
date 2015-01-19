'use strict'
@Game = @Game or ->

@Game::constructor = new (stageID) ->
  console.log 'Game.constructor'
  
  Game.Global.SVG = Snap('stageID')
  
  Game.Graphics.load();
  
  Gmae.Graphics.SVG.append Game.Graphics.Sprite.Background