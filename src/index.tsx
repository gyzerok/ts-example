import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Question {
  text: string,
  answer: string | null
}

interface QuestionList {
  previous: Question[],
  current: Question,
  others: Question[],
}

interface Questionaire {
  questions: QuestionList
}

const tuple: [string, number] = ['hello', 123];

const questionaire: Questionaire = {
  questions: {
    previous: [
      {
        text: 'how are you',
        answer: 'fine',
      }
    ],
    current: {
      text: 'how old are you',
      answer: null,
    },
    others: [] as Question[],
  }
}

interface ApiUser {
  date: string // 2017-01-06T17:01:31.870Z
}

interface User {
  date: Date,
}

function request(): Questionaire {
  const json = '{}';
  return JSON.parse(json);
}

type Model = Guest | User | Admin | SuperAdmin

interface Hello {
  text: number | string, // '134'
}

interface Guest {
  kind: 'Guest',
  name: string,
}

interface User {
  kind: 'User',
  name: string,
  cart: [string],
  purchases: [string],
}

interface Admin {
  kind: 'Admin',
  name: string,
  curatedProducts: [string],
}

interface SuperAdmin {
  kind: 'SuperAdmin',
  name: string,
}


type RemoteData<T> = NotAsked | Loading | Failed | Succeeded<T>
interface NotAsked { kind: 'NotAsked' }
interface Loading { kind: 'Loading' }
interface Failed { kind: 'Failed' }
interface Succeeded<T> { kind: 'Succeeded', data: T }

interface Props {
  remoteUser: RemoteData<Model>,
}

function unreachable(x: never): never {
  throw 'Unreachable code';
}

function App({ remoteUser }: Props) {
  switch (remoteUser.kind) {
    case 'NotAsked':
    case 'Loading':
      return <div>Loading...</div>
    case 'Failed':
      return <div>Failed</div>
    case 'Succeeded':
      const user = remoteUser.data;
      switch (user.kind) {
        case 'Guest':
          return (
            <div>
              {user.name}
            </div>
          );
        case 'User':
          return (
            <div>
              {user.name}
              <br />
              {user.cart.map(item =>
                <div>{item}</div>
              )}
            </div>
          );
        case 'Admin':
          return (
            <div>
              {user.name}
              <br />
              {user.curatedProducts.map(product =>
                <div>{product}</div>
              )}
            </div>
          );
        case 'SuperAdmin':
          return (
            <div>
              {user.name}
            </div>
          );
        default:
          return unreachable(user);
      }
    default:
        return unreachable(remoteUser);
  }
}

ReactDOM.render(
  <App remoteUser={{kind: 'Succeeded', data: { kind: 'Guest', name: 'hello'}}} />,
  document.getElementById('root')
);
