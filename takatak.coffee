class Game
  
  draw     = null
  interval = null
  
  ticksPerCycle = 16
  msPerCycle    = 8000
  msPerTick     = msPerCycle / ticksPerCycle
  currentTick   = 0
  
  numberOfLetters = 0
  gameString      = ''

  colors =
    bg:    '#1c1f24'
    panel: '#535d6c'
    red:   '#c83737'

  constructor: (stageID) ->
    draw = SVG stageID

    background = draw
      .group()
      .id 'background'
    game.background = background

    # Base color
    background
      .rect 800, 600
      .fill colors.bg

    # Bottom panel
    background
      .rect 800, 100
      .y    500
      .fill colors.panel

    # UI
    ui = draw
      .group()
      .id 'ui'
    game.ui = ui

    # Timer bar
    game.ui.timerBar = ui
      .rect 0, 10
      .y    510
      .fill colors.red
      .id   'timer-bar'

    # Game ticks
    interval = setInterval tick, msPerTick

    # User interaction
    onkeypress = keypress
    
  tick: () ->
  
    if tickCount is 0
      gameString = ''
      numberOfLetters = 0 

    game.ui.timerBar
      .width tickCount * 800 / ticksPerCycle
      .animate millisecondsPerTick, '>'
      .attr width: (tickCount + 1) * 800 / ticksPerCycle

    tickCount = (tickCount + 1) % ticksPerCycle
    
  keypress: (e) ->

    return if numberOfLetters + 1 > 16

    e = e or window.event
    chCode = e.which or e.keyCode

    if chCode >= 97 or chCode <= 122
      char = String.fromCharCode chCode
      gameString += char

    switch chCode
      when 37 then gameString += 'w'
      when 38 then gameString += 'n'
      when 39 then gameString += 'e'
      when 40 then gameString += 's'

    console.log gameString

    numberOfLetters++