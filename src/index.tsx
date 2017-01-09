// import * as React from 'react';
// import * as ReactDOM from 'react-dom';

// interface Question {
//   text: string,
//   answer: string | null
// }

// type QuestionList = {
//   previous: Question[],
//   current: Question,
//   others: Question[],
// };

// interface Questionaire {
//   questions: QuestionList
// }

// const tuple: [string, number] = ['hello', 123];

// const questionaire: Questionaire = {
//   questions: {
//     previous: [
//       {
//         text: 'how are you',
//         answer: 'fine',
//       }
//     ],
//     current: {
//       text: 'how old are you',
//       answer: null,
//     },
//     others: [] as Question[],
//   }
// }

// interface ApiUser {
//   date: string // 2017-01-06T17:01:31.870Z
// }

// interface User {
//   date: Date,
// }

// function request(): Questionaire {
//   const json = '{}';
//   return JSON.parse(json);
// }

// type Model = Guest | User | Admin | SuperAdmin;

// interface Hello {
//   text: number | string, // '134'
// }

// interface Guest {
//   kind: 'Guest',
//   name: string,
// }

// interface User {
//   kind: 'User',
//   name: string,
//   cart: [string],
//   purchases: [string],
// }

// interface Admin {
//   kind: 'Admin',
//   name: string,
//   curatedProducts: [string],
// }

// interface SuperAdmin {
//   kind: 'SuperAdmin',
//   name: string,
// }


// type RemoteData<T> = NotAsked | Loading | Failed | Succeeded<T>
// interface NotAsked { kind: 'NotAsked' }
// interface Loading { kind: 'Loading' }
// interface Failed { kind: 'Failed' }
// interface Succeeded<T> { kind: 'Succeeded', data: T }

// interface Props {
//   remoteUser: RemoteData<Model>,
// }

// function unreachable(x: never): never {
//   throw 'Unreachable code';
// }

// function App({ remoteUser }: Props) {
//   switch (remoteUser.kind) {
//     case 'NotAsked':
//     case 'Loading':
//       return <div>Loading...</div>
//     case 'Failed':
//       return <div>Failed</div>
//     case 'Succeeded':
//       const user = remoteUser.data;
//       switch (user.kind) {
//         case 'Guest':
//           return (
//             <div>
//               {user.name}
//             </div>
//           );
//         case 'User':
//           return (
//             <div>
//               {user.name}
//               <br />
//               {user.cart.map(item =>
//                 <div>{item}</div>
//               )}
//             </div>
//           );
//         case 'Admin':
//           return (
//             <div>
//               {user.name}
//               <br />
//               {user.curatedProducts.map(product =>
//                 <div>{product}</div>
//               )}
//             </div>
//           );
//         case 'SuperAdmin':
//           return (
//             <div>
//               {user.name}
//             </div>
//           );
//         default:
//           return unreachable(user);
//       }
//     default:
//         return unreachable(remoteUser);
//   }
// }

// ReactDOM.render(
//   <App remoteUser={{kind: 'Succeeded', data: { kind: 'Guest', name: '123'}}} />,
//   document.getElementById('root')
// );

import * as React from 'react';
import * as ReactDOM from 'react-dom';

type PlayerNumber = 0 | 1

type PlayerOne = {
  kind: 'PlayerOne',
  name: string,
}

type PlayerTwo = {
  kind: 'PlayerTwo',
  name: string,
}

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
      // add some stuff
      return game;
    case 'Deuce':
      // add some stuff
      return game;
    case 'Advantage':
      // add some stuff
      return game;
    case 'Win':
      // add some stuff
      return game;
    default:
        return unreachable(game.score);
  }
}

interface Props {
  game: Game,
}

function App({ game }: Props) {
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

ReactDOM.render(
  <App game={game} />,
  document.getElementById('root')
);
