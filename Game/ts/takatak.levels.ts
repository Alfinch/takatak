class Levels {

  private _levels: ILevel[];
  private _nextLevel: number;

  constructor(levelURIs: string[], callback: () => void) {

    this._levels = [];
    this._nextLevel = 0;

    this._PopulateLevels(levelURIs, callback);
  }

  GetNextLevel(): ILevel {
    return this._levels[this._nextLevel];
    this._nextLevel = this._nextLevel + 1 % this._levels.length;
  }

  private _PopulateLevels(levelURIs: string[], callback: () => void, index = 0) {
    this._AJAX(levelURIs[index], (xml) => {
      var level = this._ParseLevel(xml);
      this._levels.push(level);
      index++;
      if (index !== levelURIs.length)
        this._PopulateLevels(levelURIs, callback, index);
      else callback();
    });
  }

  private _ParseLevel(xml: string): ILevel {
    var parser = new DOMParser();
    var root: HTMLElement;
    var level: any = {};

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
          level.rounds[node.attributes.getNamedItem('index').value] =
            ParseRound(node);
      }
    }

    function ParseRound(root: Node) {
      var round: any = {};

      var ticks = root.attributes.getNamedItem('ticks');
      round.length = ticks ? ticks.value : 16;
      round.ticks = [];

      for (var i = 0; i < root.childNodes.length; i++) {
        var node = root.childNodes[i];
        switch (node.nodeName) {
          case 'tick':
            round.ticks[node.attributes.getNamedItem('index').value] =
              (ParseTick(node));
        }
      }

      return round;
    }

    function ParseTick(root: Node) {
      var tick: any = {};

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
  }

  private _AJAX(uri: string, callback: (response: string) => void) {
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
  }
}