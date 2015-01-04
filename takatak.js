/*
 * TAKATAK
 * A probability-based shoot-em-up typing game
 * 
 * (c) Alfie Woodland 2015
 */

'use strict';

var game;

game = ( function( game ) {

  var colors = {
    bg: '#535d6c'
  }

  var init = function () {
    var draw = SVG('stage');
    var rect = draw.rect(800, 100).y(500).fill(colors.bg);
  }

  game.colors = colors;

  game.init = init;

  return game;

}( game || {} ));