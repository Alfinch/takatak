interface ILevel {
  title: string;
  background: string;
  length: number;
  rounds: IRound[];
}

interface IRound {
  length: number;
  ticks: ITick[];
}

interface ITick {
  slots: string[];
}