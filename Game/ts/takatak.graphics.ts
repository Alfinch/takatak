class Graphics {

  private _stage: Snap.Paper;
  private _layers: { [key: string]: Snap.Element };
  private _graphics: { [key: string]: Snap.Element };

  constructor(stageID: string) {

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

  DrawGraphic(args: {
    name: string;
    layer: string;
  }, callback?: (graphic: Snap.Element) => void) {

    // Attempt to fetch layer and graphic
    var l: Snap.Element = this._layers[args.layer];
    var g: Snap.Element = this._graphics[args.name];

    // Check if layer exists
    if (l == null)
      throw new Error('Attempted to draw to invalid layer ' + args.layer);

    // Check if graphic exists and load it if not
    else if (g == null) {
      console.log('Loading new graphic: ' + args.name);
      Snap.load('svg/' + args.name + '.svg', (loaded: Snap.Element) => {
        g = loaded.select('svg');
        this._graphics[args.name] = g;
        addSvg();
      });

    } else addSvg();

    // Copy the svg to the layer
    var addSvg = () => {
      var clone = g.clone();
      l.add(clone);
    }
  }

  ClearLayer(layer: string) {

    // Attempt to fetch layer
    var l: Snap.Element = this._layers[layer];

    // Check if layer exists
    if (l == null)
      throw new Error('Attempted to clear to invalid layer ' + layer);

    else l.selectAll().forEach((e: Snap.Element) => e.remove());
  }
}