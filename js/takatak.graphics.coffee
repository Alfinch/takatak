'use strict'
@Game = @Game or ->

@Game.Graphics =

  Color :
    background : '#373e48'
    panel      : '#535d6c'
    red        : '#c83737'
    
  Layer : {}
  
  Sprite : {}
  
  load : ->
    console.log 'Game.Graphics.load'
    svg    = Game.Global.SVG
    sprite = Game.Graphics.Sprite
    
    svg.load '../svg/background.svg', (s) ->
      sprite.background = s
      return
      
    return