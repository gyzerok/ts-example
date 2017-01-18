import * as React from 'react';
import * as ReactDOM from 'react-dom';

type PlayerOne = {
  kind: 'PlayerOne',
  name: string,
};

type PlayerTwo = {
  kind: 'PlayerTwo',
  name: string,
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
  lastBallBy: Player | false,
}

const player1: PlayerOne = {
  kind: 'PlayerOne',
  name: 'Roger',
}

const player2: PlayerTwo = {
  kind: 'PlayerTwo',
  name: 'Sam',
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
  throw 'Unreachable code'
}

function switchPlayer(player: Player, players: [PlayerOne, PlayerTwo]): Player {
  switch (player.kind) {
    case 'PlayerOne': return players[1];
    case 'PlayerTwo': return players[0];
    default: return unreachable(player);
  }
}

function addPoint(point: Point): Point {
  switch (point) {
    case 0: return 15;
    case 15: return 30;
    case 30: return 30;
    default: return unreachable(point);
  }
}

function calcPointsData(player: Player, points: PointsData): PointsData {
  switch (player.kind) {
    case 'PlayerOne':
      return {
        kind: 'PointsData',
        playerPoints: [addPoint(points.playerPoints[0]), points.playerPoints[1]]
      };
    case 'PlayerTwo':
      return {
        kind: 'PointsData',
        playerPoints: [points.playerPoints[0], addPoint(points.playerPoints[1])]
      };
    default:
        return unreachable(player);
  }
}

function randomPlayer(players: [PlayerOne, PlayerTwo]): Player {
  const random = Math.floor(Math.random() * 2);
  if (random === 1) {return players[1]};
  return players[0];
}

function getPlayerPoints(player: Player, points: PointsData): Point {
  switch (player.kind) {
    case 'PlayerOne':
      return points.playerPoints[0];
    case 'PlayerTwo':
      return points.playerPoints[1];
    default:
        return unreachable(player);
  }
}

function ball(game: Game, ballBy: Player): Game {
  const {players} = game;
  const defaults = {
    players,
    lastBallBy: ballBy,
  };
  switch (game.score.kind) {
    case 'PointsData':
      const playerGainsForty: boolean = getPlayerPoints(ballBy, game.score) === 30;
      if (playerGainsForty) {
        return {
          ...defaults,
          score: {
            kind: 'FortyData',
            player: ballBy,
            otherPlayerPoint: getPlayerPoints(switchPlayer(ballBy, game.players), game.score),
          }
        }
      }
      return {
        ...defaults,
        score: calcPointsData(ballBy, game.score),
      };

    case 'FortyData':
      if (ballBy.kind === game.score.player.kind) {
        return {
          ...defaults,
          score: {
            kind: 'Win',
            player: ballBy,
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
          player: ballBy,
        }
      };

    case 'Advantage':
      if (ballBy.kind === game.score.player.kind) {
        return {
          ...defaults,
          score: {
            kind: 'Win',
            player: ballBy,
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
    setInterval(this.calcNewGame, 2000);
  }

  calcNewGame = () => {
    this.setState({
      game: ball(this.state.game, randomPlayer(this.state.game.players)),
    });
  }

  render() {
    const {game} = this.state;
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
        <div>Both players {game.players.map((player: Player) => player.name).join(' and ')} has 40</div>
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

ReactDOM.render(
  <App initialGame={game} />,
  document.getElementById('root')
);
