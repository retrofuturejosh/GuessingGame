function generateWinningNumber(){
    return Math.floor(Math.random() * 100) + 1;
  }

function shuffle(array) {
    var m = array.length, t, i;
  
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
};

Game.prototype.isLower = function(){
    if (this.difference() < this.winningNumber) return true;
    return false;
};

Game.prototype.playersGuessSubmission = function(num){
    if (num < 1 || num > 100 || isNaN(num)){
      if (Game.stupidGuesses === 2){
        $('h3').text("If you make me tell you again, you'll lose!");
        Game.stupidGuesses = 3;
      } else if (Game.stupidGuesses === 3){
        $('#hint, #submit').prop("disabled",true);
        $('h1').text("You lose!");
        $('h3').text("I warned you, wise guy!");
      } else if (Game.stupidGuesses === 1){
        $('h3').text('I already told you! 1-100, dummy!');
        Game.stupidGuesses = 2;
      } else {
        Game.stupidGuesses = 1;
        $('h3').text('You can only guess a number between 1-100.');
      }
      throw 'That is an invalid guess.'
    } 
    this.playersGuess = num;
    return this.checkGuess();
  };

  Game.prototype.checkGuess = function(){
    if (this.playersGuess === this.winningNumber){
      $('#hint, #submit').prop("disabled",true);
      $('h1').text('You Win!');
      $('li').text(this.playersGuess);
      Game.hintUsed = false;
      return "Hit Reset to Play Again";
    }
    else if (this.pastGuesses.includes(this.playersGuess)) return 'You have already guessed that number.';
    this.pastGuesses.push(this.playersGuess);
    $('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess)
    $('#guesses li:nth-child('+ this.pastGuesses.length +')').show();
    $('h1').text('Guess Again!');
    if (this.pastGuesses.length === 5){
      $('#hint, #submit').prop("disabled",true);
      $('h1').text('Sorry, loser! The number was ' + this.winningNumber + '!');
      $('li').text(this.winningNumber);
      Game.hintUsed = false;
      return 'Hit Reset to Play Again.';
    }
    else if (this.difference() < 10) return "You're burning up!";
    else if (this.difference() < 25) return "You're lukewarm.";
    else if (this.difference() < 50) return "You're a bit chilly.";
    else if (this.difference() < 100) return "You're ice cold!";
  };

  function newGame(){
    var game = new Game();
    return game;
  }

  Game.prototype.provideHint = function(){
    let hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    if (Game.hintUsed === true){
      $('#hint').prop("disabled",true);
      return 'Sorry, you already used your hint!'
    } else Game.hintUsed = true;
    hintArr = shuffle(hintArr);
    return 'The winning number is either ' + hintArr[0] + ', ' + hintArr[1] + ', or ' + hintArr[2] + '!';
  };

  function makeAGuess(game) {
    var guess = parseInt($('#player-input').val(), 10);
    $('#player-input').val("");
    var output = game.playersGuessSubmission(guess);
    $('h3').text(output);
}

$(document).ready(function() {
  var game = newGame();
  console.log(game);

  $('#submit').click(function(e) {
    $('#player-input').focus();
    makeAGuess(game);
  })

  $('#player-input').keypress(function(event) {
    if ( event.which == 13 ) {
       makeAGuess(game);
    }
})

  $('#reset').click(function(event){
    game = newGame();
    $('h1').text("Let's Play Again!");
    $('h3').text('Guess a number between 1-100!')
    $('li').text('---');
    $('#hint, #submit').prop("disabled",false);
    $('#player-input').focus();
    Game.hintUsed = false;
  })

  $('#hint').click(function(event){
    var hints = game.provideHint();
    $('h3').text(hints);
    $('#player-input').focus();
  })
});