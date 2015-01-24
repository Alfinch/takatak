class Graphics {

  private _stage: Snap.Paper;

  constructor(stageID: string) {
    this._stage = Snap('#' + stageID);

    Snap.load('svg/background.svg', (svg: Snap.Element) => {
      this._stage.append(svg);
    });
  }
}