import * as React from 'react';
import * as ReactDOM from 'react-dom';

type PlayerNumber = 0 | 1;

type PlayerOne = {
  kind: 'PlayerOne',
  name: string,
  number: PlayerNumber,
};

type PlayerTwo = {
  kind: 'PlayerTwo',
  name: string,
  number: PlayerNumber,
};

type Player = PlayerOne | PlayerTwo;

type Point = 0 | 15 | 30

type PointsData = {
  kind: 'PointsData'
  playerPoints : [Point, Point],
};
type FortyData = {
  kind: 'FortyData',
  player : Player,
  otherPlayerPoint : Point,
};
type Advantage = {
  kind: 'Advantage',
  player: Player,
};
type Win = {
  kind: 'Win',
  player: Player,
};
type Deuce = {
  kind: 'Deuce',
};
type Score =
  PointsData
  | FortyData
  | Deuce
  | Advantage
  | Win

type Game = {
  players: [PlayerOne, PlayerTwo],
  score: Score,
  lastBallBy: PlayerNumber | false,
}

const player1: PlayerOne = {
  kind: 'PlayerOne',
  name: 'Roger',
  number: 0,
}

const player2: PlayerTwo = {
  kind: 'PlayerTwo',
  name: 'Sam',
  number: 1,
}

const initialScores: PointsData = {
  kind: 'PointsData',
  playerPoints: [0, 0]
}

let game: Game = {
  players: [player1, player2],
  score: initialScores,
  lastBallBy: false,
}

function unreachable(x: never): never {
  throw 'Unreachable code';
}

function switchPlayerNumber(number: PlayerNumber): PlayerNumber {
  switch (number) {
    case 1: return 0;
    case 0: return 1;
    default: return unreachable(number);
  }
}

function addPoint(point: Point): Point {
  switch (point) {
    case 0: return 15;
    case 15: return 30;
    case 30: return 30; // wtf?
    default: return unreachable(point);
  }
}

function randomPlayerNumber(): PlayerNumber {
  const random = Math.floor(Math.random() * 2);
  if (random === 1) {return 1};
  return 0;
}

function ball(game: Game, ballBy: PlayerNumber): Game {
  const {players} = game;
  const defaults = {
    players,
    lastBallBy: ballBy,
  };
  switch (game.score.kind) {
    case 'PointsData':
      const playerGainsForty: boolean = game.score.playerPoints[ballBy] === 30;
      if (playerGainsForty) {
        return {
          ...defaults,
          score: {
            kind: 'FortyData',
            player: game.players[ballBy],
            otherPlayerPoint: game.score.playerPoints[switchPlayerNumber(ballBy)],
          }
        }
      }
      const playerOnePoints = ballBy === 0 ? addPoint(game.score.playerPoints[0]) : game.score.playerPoints[0];
      const playerTwoPoints = ballBy === 1 ? addPoint(game.score.playerPoints[1]) : game.score.playerPoints[1];
      return {
        ...defaults,
        score: {
          ...game.score,
          playerPoints: [playerOnePoints, playerTwoPoints],
        },
      };
    case 'FortyData':
      if (ballBy === game.score.player.number) {
        return {
          ...defaults,
          score: {
            kind: 'Win',
            player: game.score.player,
          }
        }
      }
      if (game.score.otherPlayerPoint === 30) {
        return {
          ...defaults,
          score: {
            kind: 'Deuce',
          }
        }
      }
      return {
        ...defaults,
        score: {
          ...game.score,
          otherPlayerPoint: addPoint(game.score.otherPlayerPoint),
        }
      };
    case 'Deuce':
      return {
        ...defaults,
        score: {
          kind: 'Advantage',
          player: game.players[ballBy],
        }
      };
    case 'Advantage':
      if (ballBy === game.score.player.number) {
        return {
          ...defaults,
          score: {
            kind: 'Win',
            player: game.score.player,
          }
        }
      }
      return {
        ...defaults,
        score: {
          kind: 'Deuce',
        }
      };
    case 'Win':
      return game;
    default:
        return unreachable(game.score);
  }
}

interface AppProps {
  initialGame: Game,
}

interface AppState {
  game: Game,
}

export class App extends React.Component<AppProps, AppState> {

  constructor(props:AppProps) {
    super(props);
    this.state = {
      game: props.initialGame,
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        game: ball(game, randomPlayerNumber()),
      });
    }
    , 2000);
  }

  render() {
    switch (game.score.kind) {
    case 'PointsData':
      return (
        <div>
          <div>Score of {game.players[0].name} {game.score.playerPoints[0]}</div>
          <div>Score of {game.players[1].name} {game.score.playerPoints[1]}</div>
        </div>
      );
    case 'FortyData':
      return (
        <div>
          <div>{game.score.player.name} leads with 40</div>
          <div>Another player has {game.score.otherPlayerPoint}</div>
        </div>
      );
    case 'Deuce':
      return (
        <div>Both players {game.players.join(' and ')} has 40</div>
      );
    case 'Advantage':
      return (
        <div>{game.score.player.name} has Advantage</div>
      );
    case 'Win':
      return (
        <div>{game.score.player.name} wins!</div>
      );
    default:
        return unreachable(game.score);
  }
  }
}

setInterval(() => {
  game = ball(game, randomPlayerNumber());
}
, 2000);

ReactDOM.render(
  <App initialGame={game} />,
  document.getElementById('root')
);
