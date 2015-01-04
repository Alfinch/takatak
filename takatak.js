/*
 * TAKATAK
 * A probability-based shoot-em-up typing game
 * 
 * (c) Alfie Woodland 2015
 */

'use strict';

var game;

game = ( function( game ) {

  var draw,
      interval,

      ticksPerCycle = 16,
      millisecondsPerCycle = 8000,
      millisecondsPerTick = millisecondsPerCycle / ticksPerCycle,
      tickCount = 0,

      numberOfLetters = 0,
      gameString = '';

  var colors = {
    bg: '#1c1f24',
    panel: '#535d6c',
    red: '#c83737'
  };

  var init = function () {

    draw = SVG( 'stage' );

    // Background
    var background = draw.group().id('background');
    game.background = background;

    // Base color
    background.rect(800, 600).fill(colors.bg);

    // Bottom panel
    background.rect(800, 100).y(500).fill(colors.panel);

    // Vertical grid lines
    for ( var i = 0; i <= 400; i += 50 )
      background.line( i + 200, 0, i + 200, 500 )
               .fill( 'none' )
               .stroke({
                 color: 'white',
                 opacity: i % 400 === 0 ? 0.2 : 0.1,
                 width: 2
               });

    for ( var i = 50; i < 800; i += 50 )
      background.line( i, 500, i, 600 )
               .fill( 'none' )
               .stroke({
                 color: 'white',
                 opacity: 0.1,
                 width: 2
               });

    // Horizontal grid lines
    var gradient = draw.gradient( 'linear', function (stop) {
      stop.at({ offset: 0,     color: 'white', opacity: 0 });
      stop.at({ offset: 0.375, color: 'white', opacity: 1 });
      stop.at({ offset: 0.625, color: 'white', opacity: 1 });
      stop.at({ offset: 1,     color: 'white', opacity: 0 });
    }).attr({ gradientUnits: 'userSpaceOnUse' });

    for (var i = 50; i < 500; i += 50)
      background.line(0, i, 800, i)
               .fill('none')
               .stroke({
                 color: gradient,
                 opacity: 0.1,
                 width: 2
               });

    // UI
    var ui = draw.group().id('ui');
    game.ui = ui;

    // Timer bar
    game.ui.timerBar = ui.rect( 0, 10 ).y( 510 ).fill( colors.red ).id( 'timer-bar' );

    // Game ticks
    interval = setInterval( tick, millisecondsPerTick );

    // User interaction
    onkeypress = keypress;
  };

  var tick = function () {

    if (tickCount === 0) {
      gameString = '';
      numberOfLetters = 0;
    }

    game.ui.timerBar
      .width(tickCount * 800 / ticksPerCycle)
      .animate( millisecondsPerTick, '>' )
      .attr({ width: (tickCount + 1) * 800 / ticksPerCycle });

    tickCount = (tickCount + 1) % ticksPerCycle;
  };

  var keypress = function GetChar(e) {

    if (numberOfLetters + 1 > 16) return;

    e = e || window.event;
    var chCode = e.which || e.keyCode;

    if (chCode >= 97 || chCode <= 122) {
      var char = String.fromCharCode(chCode);
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
        break;
    }

    console.log(gameString);

    numberOfLetters++;
  };

  game.init = init;

  return game;

}( game || {} ));