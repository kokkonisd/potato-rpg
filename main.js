let DESTINY = 0;
let POTATOES = 0;
let ORCS = 0;

let POTATOES_FOR_ONE_ORC = 1;

import GAME_DATA from "./data.json" assert { type: "json" }
let HISTORY = [];


function updateScores (destiny, potatoes, orcs, potatoes_for_one_orc)
{
    const gameScreen = document.getElementById("game-screen");
    const tradeBtn = document.getElementById("trade-btn");
    const tradeAmount = document.getElementById("trade-amount");
    const advanceBtn = document.getElementById("advance-btn");
    const playAgainBtn = document.getElementById("play-again-btn");
    const showHistoryBtn = document.getElementById("show-history-btn");
    const destinyScore = document.getElementById("destiny-score");
    const potatoesScore = document.getElementById("potatoes-score");
    const orcsScore = document.getElementById("orcs-score");

    let new_destiny = DESTINY + destiny;
    let new_potatoes = POTATOES + potatoes;
    let new_orcs = ORCS + orcs;

    if (potatoes_for_one_orc != 0) {
        POTATOES_FOR_ONE_ORC += potatoes_for_one_orc;

        // Make the trade button and the trade amount animate to notify the player of
        // the change.
        // In order to be sure to trigger the animation every time, use this hack:
        // https://stackoverflow.com/a/63561659/2517239
        tradeAmount.classList.remove("modified");
        tradeBtn.classList.remove("modified");
        tradeAmount.offsetWidth;
        tradeBtn.offsetWidth;
        tradeAmount.classList.add("modified");
        tradeBtn.classList.add("modified");
    }

    const endGame = document.createElement("p");

    let hasGameEnded = false;

    // Make sure the value does not go below 0.
    if (new_destiny < 0) {
        new_destiny = 0;
    }
    if (new_potatoes < 0) {
        new_potatoes = 0;
    }
    if (new_orcs < 0) {
        new_orcs = 0;
    }
    // Make sure the value does not go above 10.
    if (new_destiny > 10) {
        new_destiny = 10;
    }
    if (new_potatoes > 10) {
        new_potatoes = 10;
    }
    if (new_orcs > 10) {
        new_orcs = 10;
    }

    // Handle endgames and log endgame in history; endgames are noted by 'E' followed
    // by the first letter of their name (in lowercase). For example, 'Ed' denotes the
    // destiny endgame.
    if (new_orcs === 10) {
        hasGameEnded = true;
        gameScreen.classList.add("orcs");
        HISTORY.push("Eo");
        endGame.innerHTML = GAME_DATA.endgames.orcs;
    } else if (new_destiny === 10) {
        hasGameEnded = true;
        gameScreen.classList.add("destiny");
        HISTORY.push("Ed");
        endGame.innerHTML = GAME_DATA.endgames.destiny;
    } else if (new_potatoes === 10) {
        hasGameEnded = true;
        gameScreen.classList.add("potatoes");
        HISTORY.push("Ep");
        endGame.innerHTML = GAME_DATA.endgames.potatoes;
    }


    // Enable/disable trading.
    if (new_potatoes < POTATOES_FOR_ONE_ORC || new_orcs == 0) {
        tradeBtn.disabled = true;
    } else {
        tradeBtn.disabled = false;
    }

    // Configure game for endgame mode.
    if (hasGameEnded === true) {
        gameScreen.innerHTML = "";
        gameScreen.appendChild(endGame);
        tradeBtn.style.display = "none";
        advanceBtn.style.display = "none";
        playAgainBtn.style.display = "block";
        showHistoryBtn.style.display = "block";
    }

    // Update visuals.
    DESTINY = new_destiny;
    POTATOES = new_potatoes;
    ORCS = new_orcs;

    destinyScore.style.width = DESTINY * 10 + "%";
    potatoesScore.style.width = POTATOES * 10 + "%";
    orcsScore.style.width = ORCS * 10 + "%";
    tradeAmount.innerHTML = POTATOES_FOR_ONE_ORC;
}

function rollDie (faces)
{
    console.assert(faces > 0);
    return Math.ceil(Math.random() * faces);
}

function startGame ()
{
    let introScreen = document.getElementById("intro-screen");
    let scoresScreen = document.getElementById("scores-screen");
    let gameScreen = document.getElementById("game-screen");
    let controls = document.getElementById("controls");

    introScreen.style.display = "none";
    scoresScreen.style.display = "block";
    gameScreen.style.display = "block";
    controls.style.display = "grid";
}

function handleTrade ()
{
    // Make sure the trade is possible.
    if (POTATOES < POTATOES_FOR_ONE_ORC || ORCS === 0) {
        return;
    }

    // Register trade in history. The trade is represented with the letter T followed
    // by an integer representation of the number of potatoes that were traded for one
    // orc.
    HISTORY.push("T" + POTATOES_FOR_ONE_ORC.toString());

    updateScores(0, -POTATOES_FOR_ONE_ORC, -1, 0);
}

function advanceToNextDay ()
{ 
    let dieRoll = rollDie(3);
    let destiny = 0;
    let potatoes = 0;
    let orcs = 0;
    let potatoes_for_one_orc = 0;

    // Log the advance in history with an 'A'.
    HISTORY.push("A");

    const gameScreen = document.getElementById("game-screen");
    const title = document.createElement("p");
    const outcome = document.createElement("p");

    let game_event = null;
    if (dieRoll === 1) {
        dieRoll = rollDie(6);
        game_event = "garden";
    } else if (dieRoll === 2) {
        dieRoll = rollDie(6);
        game_event = "knock";
    } else {
        dieRoll = rollDie(1);
        game_event = "mud";
    }

    let incident = GAME_DATA.events[game_event].incidents[dieRoll - 1];
    destiny += incident.destiny;
    potatoes += incident.potatoes;
    orcs += incident.orcs;
    potatoes_for_one_orc += incident.potatoes_for_one_orc;

    // Update the history; the incidents are marked with the first letter of the event
    // (e.g. 'm' for 'mud') and the index of the incident (e.g. 0 for the first
    // incident).
    HISTORY.push(game_event[0] + (dieRoll - 1).toString());

    title.innerHTML = GAME_DATA.events[game_event].title;
    outcome.innerHTML = incident.message;

    gameScreen.innerHTML = "";
    gameScreen.appendChild(title);
    gameScreen.appendChild(outcome);
    updateScores(destiny, potatoes, orcs, potatoes_for_one_orc);
}

function playAgain ()
{
    window.location.reload();
}

function showHistory ()
{
    window.location.href = "history.html?h=" + HISTORY.join("");
}

document.addEventListener("DOMContentLoaded", function (event) {
    // Add listeners for buttons.
    document.getElementById("start-game-btn").addEventListener("click", startGame);
    document.getElementById("trade-btn").addEventListener("click", handleTrade);
    document.getElementById("advance-btn").addEventListener("click", advanceToNextDay);
    document.getElementById("play-again-btn").addEventListener("click", playAgain);
    document.getElementById("show-history-btn").addEventListener("click", showHistory);
});
