const readline = require('readline-sync');
const SELECTION = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
const WIN_SCORE = 5;
let HUMAN_MOVE_HISTORY = [];

function createPlayer() {
  return {
    move: null,
    moveHistory: [],
    score: 0,

    scored() {
      this.score += 1;
    }
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      while (true) {
        this.move = readline.question('Please choose: ' + SELECTION.join(' - ') + ' >> ');
        if (!SELECTION.includes(this.move)) {
          console.log(('Error - Invalid Input...'));
        } else {
          this.moveHistory.push(this.move);
          HUMAN_MOVE_HISTORY.push(this.move);
          break;
        }
      }
    }
  };
  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();
  let rules = createRule();

  let computerObject = {
    weights: {
      rock: 20,
      paper: 20,
      scissors: 20,
      lizard: 20,
      spock: 20
    },

    adjustWeights(item) {
      let losses = HUMAN_MOVE_HISTORY.filter(choice => rules[choice].includes(item));
      let lossPercentage = Math.round((losses.length - 1) / (HUMAN_MOVE_HISTORY.length - 1)) * 10;
      if (lossPercentage >= 60) {
        this.weights.item -= 10;
        this.weights[this.rules[item][0]] += 10;
        this.weights[this.rules[item][1]] += 10;
      }
    },

    adjustChoice() {
      let betterChoices = Object.entries(this.weights).filter(pair => pair[1] > 20);
      let randomIdx = Math.floor(Math.random() * SELECTION.length);
      this.move = betterChoices[randomIdx];
    },

    choose() {
      let randomIdx = Math.floor(Math.random() * SELECTION.length);
      this.move = SELECTION[randomIdx];
      this.adjustWeights(this.move);
      if (this.weights[this.move] < 20) {
        this.adjustChoice();
      }
      this.moveHistory.push(this.move);
    }
  };
  return Object.assign(playerObject, computerObject);
}

function createRule() {
  return {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['spock', 'paper'],
    spock: ['rock', 'scissors']
  };
}

const RPSgame = {
  human: createHuman(),
  computer: createComputer(),
  rules: createRule(),

  displayWelcomeMessage() {
    console.log('---- Welcome to OOP RPS! ----\n'
              + ' --------------------------- \n'
              + '     -------------------     ');
  },

  displayExitMessage() {
    console.log('---- Thanks for playing! ----');
  },

  displayScore() {
    console.log('Human has scored: ' + this.human.score + ' - Computer has scored: ' + this.computer.score);
  },

  displayWinner() {
    let pMove = this.human.move;
    let cMove = this.computer.move;

    console.log('Human chose: ' + pMove);
    console.log('Computer chose: ' + cMove);

    if (cMove === pMove) {
      console.log('It\'s a tie!');
    } else if (this.rules[pMove].includes(cMove)) {
      console.log('Human Wins!');
      this.human.scored();
    } else if (this.rules[cMove].includes(pMove)) {
      console.log('Computer Wins!');
      this.computer.scored();
    }
    this.displayScore();
  },

  displayGameWinner() {
    if (this.human.score === WIN_SCORE) {
      console.log('Human Wins the Game!');
    } else if (this.computer.score === WIN_SCORE) {
      console.log('Computer Wins the Game!');
    }
  },

  playAgain() {
    let answer = readline.question('Play again? (y / n) ').toLowerCase();
    while (!(answer[0] === 'y' || answer[0] === 'n')) {
      answer = readline.question(('Invalid input... Enter either (y / n) '));
    }
    if (answer[0].toLowerCase() === 'y') {
      this.human.score = 0;
      this.human.moveHistory = [];
      this.computer.score = 0;
      this.computer.moveHistory = [];
      HUMAN_MOVE_HISTORY = [];
    }
    return answer[0] === 'y';
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      if (this.human.score === WIN_SCORE || this.computer.score === WIN_SCORE) {
        this.displayGameWinner();
        if (!this.playAgain()) break;
      }
    }
    this.displayExitMessage();
  }
};

RPSgame.play();