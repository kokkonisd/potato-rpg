let DESTINY = 0;
let POTATOES = 0;
let ORCS = 0;

let POTATOES_FOR_ONE_ORC = 1;


function updateScores (destiny, potatoes, orcs, potatoes_for_one_orc)
{
    const gameScreen = document.getElementById("game-screen");
    const tradeBtn = document.getElementById("trade-btn");
    const tradeAmount = document.getElementById("trade-amount");
    const advanceBtn = document.getElementById("advance-btn");
    const destinyScore = document.getElementById("destiny-score");
    const potatoesScore = document.getElementById("potatoes-score");
    const orcsScore = document.getElementById("orcs-score");

    let new_destiny = DESTINY + destiny;
    let new_potatoes = POTATOES + potatoes;
    let new_orcs = ORCS + orcs;

    POTATOES_FOR_ONE_ORC += potatoes_for_one_orc;

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

    // Handle endgames.
    if (new_orcs === 10) {
        hasGameEnded = true;
        gameScreen.classList.add("orcs");
        endGame.innerHTML = (
            "Orcs finally find your potato farm. Alas, orcs are not so interested in "
            + "potatoes as they are in eating you, and you end up in a cookpot."
        );
    } else if (new_destiny === 10) {
        hasGameEnded = true;
        gameScreen.classList.add("destiny");
        endGame.innerHTML = (
            "An interfering bard or wizard turns up at your doorstep with a quest, and "
            + "you are whisked away against your will on an adventure."
        );
    } else if (new_potatoes === 10) {
        hasGameEnded = true;
        gameScreen.classList.add("potatoes");
        endGame.innerHTML = (
            "You have enough potatoes that you can go underground and not return to "
            + "the surface until the danger is past. You nestle down into your burrow "
            + "and enjoy your well earned rest."
        );
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
        tradeBtn.disabled = true;
        advanceBtn.disabled = true;
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

function rollD6 ()
{
    return Math.ceil(Math.random() * 6);
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

    updateScores(0, -POTATOES_FOR_ONE_ORC, -1, 0);
}

function advanceToNextDay ()
{ 
    let dieRoll = rollD6();
    let destiny = 0;
    let potatoes = 0;
    let orcs = 0;
    let potatoes_for_one_orc = 0;

    const gameScreen = document.getElementById("game-screen");
    const title = document.createElement("p");
    const outcome = document.createElement("p");

    switch (dieRoll) {
        case 1:
        case 2:
            title.innerHTML = "In the Garden...";

            dieRoll = rollD6();
            switch (dieRoll) {
                case 1:
                    outcome.innerHTML = (
                        "You happily root about all day in your garden."
                    );
                    potatoes = 1;
                    break;

                case 2:
                    outcome.innerHTML = (
                        "You narrowly avoid a visitor by hiding in a potato sack."
                    );
                    destiny = 1;
                    potatoes = 1;
                    break;

                case 3:
                    outcome.innerHTML = "A hooded stranger lingers outside your farm.";
                    destiny = 1;
                    orcs = 1;
                    break;

                case 4:
                    outcome.innerHTML = (
                        "Your field is ravaged in the night by unseen enemies."
                    );
                    orcs = 1;
                    potatoes = -1;
                    break;

                case 5:
                    outcome.innerHTML = (
                        "You trade potatoes for other delicious foodstuffs."
                    );
                    potatoes = -1;
                    break;

                case 6:
                default:
                    outcome.innerHTML = (
                        "You burrow into a bumper crop of potatoes. Do you cry with "
                        + "joy? Possibly."
                    );
                    potatoes = 2;
                    break;
            }

            break;

        case 3:
        case 4:
            title.innerHTML = "A Knock at the Door...";

            dieRoll = rollD6();
            switch (dieRoll) {
                case 1:
                    outcome.innerHTML = (
                        "A distant cousin. They are after your potatoes. They may "
                        + "snitch on you."
                    );
                    orcs = 1;
                    break;

                case 2:
                    outcome.innerHTML = (
                        "A dwarven stranger. You refuse them entry. Ghastly creatures."
                    );
                    destiny = 1;
                    break;

                case 3:
                    outcome.innerHTML = (
                        "A wizard strolls by. You pointedly draw the curtains."
                    );
                    destiny = 1;
                    orcs = 1;
                    break;

                case 4:
                    outcome.innerHTML = (
                        "There are rumours of war in the reaches. You eat some "
                        + "potatoes."
                    );
                    orcs = 2;
                    potatoes = -1;
                    break;

                case 5:
                    outcome.innerHTML = "It's an elf. They are not serious people.";
                    destiny = 1;
                    break;

                case 6:
                default:
                    outcome.innerHTML = (
                        "It's a sack of potatoes from a generous neighbour. You really "
                        + "must remember to pay them a visit one of these years."
                    );
                    potatoes = 2;
                    break;
            }

            break;

        case 5:
        case 6:
        default:
            title.innerHTML = "Grass and Mud...";
            outcome.innerHTML = (
                "The world becomes a darker, more dangerous place. From now on, "
                + "removing one ORC costs an additional POTATO."
            );
            potatoes_for_one_orc = 1;

            break;
    }

    gameScreen.innerHTML = "";
    gameScreen.appendChild(title);
    gameScreen.appendChild(outcome);
    updateScores(destiny, potatoes, orcs, potatoes_for_one_orc);
}

document.addEventListener("DOMContentLoaded", function (event) {
    // Add listeners for buttons.
    document.getElementById("start-game-btn").addEventListener("click", startGame);
    document.getElementById("trade-btn").addEventListener("click", handleTrade);
    document.getElementById("advance-btn").addEventListener("click", advanceToNextDay);
});
