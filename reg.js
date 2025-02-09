let emptyArray = [];
let ticker;
let score;
let userScore;
let questions;
const questionsURL = 'https://morning-beach-63879.herokuapp.com/questions'

let newScore;

// Remove Content From Inner-Conent Div
function clearInnerContent(innerContentWrapper) {
    innerContentWrapper.innerHTML = '';
}

// Randomize Elements in an Array
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};

// Initial Fetch to get Questions
function questionFetch() {
    fetch(questionsURL)
    .then(resp => resp.json())
    .then(resp => {
        questions = shuffle(resp)
    })
}

questionFetch()

document.addEventListener('DOMContentLoaded', (event) => {
    // Set Variables
    const scoreKeeper = document.getElementById('score-goes-here');
    const innerContentWrapper = document.getElementById('inner-content');
    const playTrivia = document.getElementById('trivia');
    const gameChoice = document.getElementById('choose-game-type');
    const loginDiv = document.getElementById('login-div');
    const gameDiv = document.getElementById('game-div');
    const regularGameButton = document.getElementById('regular-game-button');
    const speedGameButton = document.getElementById('speed-game-button');
    const questionAudio = document.getElementById('question-audio');
    var currentGameWrongAnswers = 0;

    const staticElements = document.getElementById('static-elements').children;

    function hideStaticElements() {
        for(element of staticElements) {
            element.classList.add('hidden');
        }
    }

    // Leaderboard Table Helper Methods
    function renderLeaderTables(gameTypeDiv, type) {
        const scoresTitle = document.createElement('h2');
        scoresTitle.innerText = `${type} scores table`;
        gameTypeDiv.appendChild(scoresTitle);

        const scoresTable = document.createElement('table');
        scoresTable.setAttribute('id', type);
        gameTypeDiv.appendChild(scoresTable);

        const scoresHeaderRow = document.createElement('tr');
        scoresHeaderRow.setAttribute('class', 'table-header-row');
        scoresTable.appendChild(scoresHeaderRow);

        const scoresNameHeader = document.createElement('th');
        scoresNameHeader.innerText = 'Name';
        scoresHeaderRow.appendChild(scoresNameHeader);

        const scoreHeader = document.createElement('th');
        scoreHeader.innerText = 'Score';
        scoresHeaderRow.appendChild(scoreHeader);
    }

    // Build Leaderboard 
    function renderLeaderboard(type, positionResp) {
        clearInterval(ticker);
        clearInnerContent(innerContentWrapper);
        hideStaticElements();

        fetch(`https://morning-beach-63879.herokuapp.com/games/${type}`)
        .then(resp => resp.json())
        .then(resp => {
            const scoresDiv = document.createElement('div');
            innerContentWrapper.appendChild(scoresDiv);
            scoresDiv.setAttribute('class', 'container-fluid text-center');
            scoresDiv.setAttribute('id', 'scores-div');
            renderLeaderTables(scoresDiv, type);

            const thisTable = document.getElementById(`${type}`);
            
            if(resp.length === 0) {
                const noScores = document.createElement('p');
                noScores.innerText = 'There are no Scores yet. Play?';
                scoresDiv.appendChild(noScores);
            } else {
                for(let i = 0; i < resp.length; i++) {
                    const thisRow = document.createElement('tr');
                    thisTable.appendChild(thisRow);
                    
                    const myName = document.createElement('td');
                    myName.innerText = resp[i].user.username;
                    thisRow.appendChild(myName);

                    const myScore = document.createElement('td');
                    myScore.innerText = resp[i].score;
                    thisRow.appendChild(myScore);
                }
            }
            if (positionResp < 10) {
                let scoresDiv = document.getElementById('scores-div');
                
                const congratsFigure = document.createElement('figure');
                scoresDiv.appendChild(congratsFigure);

                const youGotIt = document.createElement('img');
                youGotIt.src = 'https://media.giphy.com/media/H3dpw7WpXz3s1yi2YB/giphy.gif';
                youGotIt.classList.add('congrats');
                congratsFigure.appendChild(youGotIt);

                const congratsCaption = document.createElement('figcaption');
                congratsCaption.innerText = 'Twerk skills up on legendary';
                congratsFigure.appendChild(congratsCaption);
            }
        })
    }

    // Fetches Correct and Incorrect andswers and Calculates Score
    function fetchCorrectAnswers(thisQuestion, thisAnswerId, pointsMultiplier, gameType, allowedWrongAnswers) {
        fetch(`https://morning-beach-63879.herokuapp.com/answers/${thisQuestion.id}`)
        .then(resp => resp.json())
        .then(resp => {
            for(let i = 0; i < resp.length; i++) {
                let thisAnswerButton = document.getElementById(resp[i].id);
                if(resp[i].is_correct === true) {
                    if(parseInt(thisAnswerId) === resp[i].id) {
                        newScore = 0;
                        newScore = (score + 1) * pointsMultiplier;

                        emptyArray.push(newScore);
                        const sum = emptyArray => emptyArray.reduce((a,b) => a + b, 0);
                        userScore = sum(emptyArray);
                        scoreKeeper.innerText = userScore;
                    }
                    thisAnswerButton.classList.add('green');
                    thisAnswerButton.classList.add('disabled');
                } else {
                    if(parseInt(thisAnswerId) === resp[i].id) {
                        currentGameWrongAnswers += 1;
                    }
                    thisAnswerButton.classList.add('red');
                    thisAnswerButton.classList.add('disabled');
                }
            }
        })
        .then(function() {
            if(currentGameWrongAnswers < allowedWrongAnswers) {
                setTimeout(function() {displayQuestion(gameType)}, 2000);
            } else {
                recordHighScore(gameType);
            }
        })
    }

    // Displays a new Question, Sets Event Listeners for Answer Choices
    function displayQuestion(gameType) {
        const answersRow = document.getElementById('answers-row');
        const gameDiv = document.getElementById('game-div');
        const questionContent = document.getElementById('question-content');

        while (answersRow.firstChild) {
            answersRow.removeChild(answersRow.firstChild);
          }

        const thisQuestion = questions.pop();

        let myAnswers = thisQuestion.answers;
        myAnswers = shuffle(myAnswers);
        for(let i = 0; i < myAnswers.length; i++) {
            const thisButton = document.createElement('button');
            thisButton.innerText = myAnswers[i].content;
            thisButton.setAttribute('class', 'answer-content');
            thisButton.setAttribute('id', myAnswers[i].id);
            answersRow.appendChild(thisButton);

            thisButton.addEventListener('click', (event) => {
                const thisAnswerId = event.target.id;
                clearInterval(ticker);
                questionAudio.src = '';
                fetchCorrectAnswers(thisQuestion, thisAnswerId, pointsMultiplier, gameType, allowedWrongAnswers);
            })
        }
        if(gameType === 'regular') {
            var allowedWrongAnswers = 3;
            var pointsMultiplier = 1;
        } else if(gameType === 'speed') {
            var allowedWrongAnswers = 1;
            var pointsMultiplier = 5;
        }
        countDownTimer(allowedWrongAnswers, gameType);
        gameDiv.classList.remove('hidden');
        loginDiv.classList.add('hidden');

        playMusic(thisQuestion.media);

        questionContent.innerText = thisQuestion.content;
    }

    // Toggle Visibility of Game Type Choice Screen
    function toggleGameChoice() {
        gameChoice.classList.toggle('hidden');
    }

    function startRegularGame() {
        questionFetch();
        emptyArray = [];
        userScore = 0;
        scoreKeeper.innerText = userScore;
        currentGameWrongAnswers = 0;
        displayQuestion('regular');
    }

    function startSpeedGame() {
        questionFetch();
        emptyArray = [];
        userScore = 0;
        scoreKeeper.innerText = userScore;
        currentGameWrongAnswers = 0;
        displayQuestion('speed');
    }

    playTrivia.addEventListener('click', (event) => {
        clearInnerContent(innerContentWrapper);
        toggleGameChoice();
        gameDiv.classList.add('hidden');
        loginDiv.classList.add('hidden');
    })

    // end of game logic
    function recordHighScore(gameType) {
        const createGameURL = `https://morning-beach-63879.herokuapp.com/games`;
        const wrapper = document.getElementById('page-content-wrapper');
        username = wrapper.dataset.username;
        const scoreScreenGrab= document.getElementById('score-goes-here').innerHTML;
        fetch(createGameURL, {  
            method: 'POST',  
            headers: {  
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify ({
                username: username,
                game_type: gameType,
                score: scoreScreenGrab
            })
        })
        .then(resp => resp.json()  )
        .then(resp =>  {
            setTimeout(function() {renderLeaderboard(gameType, resp)}, 1000)
        })

    }

    regularGameButton.addEventListener('click', (event) => {
        toggleGameChoice();
        startRegularGame();
    })

    speedGameButton.addEventListener('click', (event) => {
        toggleGameChoice();
        startSpeedGame();
    })

    function countDownTimer(allowedWrongAnswers, gameType) {
        let progressBar = document.getElementById('progress-bar');
        let timer = document.getElementById('time-goes-here');
        score = 10;
        ticker = setInterval(function () {
            timer.innerText = score;
            progressBar.setAttribute('style', `width:${score*10}%`);
            if (score === 0) {
                clearInterval(ticker);
                currentGameWrongAnswers += 1;
                if(currentGameWrongAnswers < allowedWrongAnswers) {
                    setTimeout(function() {displayQuestion(gameType)}, 1000)
                } else {
                    recordHighScore(gameType);
                    clearInterval(ticker);
                }
            }
            else {
                score--;
            }
        }, 1000); 
    };

    function playMusic(media) {
        if(media) {
            questionAudio.src = media;
            questionAudio.play();
            setTimeout(function() {
                questionAudio.pause();
                questionAudio.src = '';
            }, 10000);
        }  
    }
})




