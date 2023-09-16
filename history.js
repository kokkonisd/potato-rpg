import GAME_DATA from "./data.json" assert { type: "json" }

function playerMove (message) {
    let p = document.createElement("p");
    p.innerHTML = "~ " + message + " ~";
    p.className = "move";
    
    return p;
}

function stats (destiny, potatoes, orcs, potatoes_for_one_orc) {
    let destiny_score = document.createElement("span");
    destiny_score.className = "destiny-score";
    destiny_score.innerHTML = destiny;
    let potatoes_score = document.createElement("span");
    potatoes_score.className = "potatoes-score";
    potatoes_score.innerHTML = potatoes;
    let orcs_score = document.createElement("span");
    orcs_score.className = "orcs-score";
    orcs_score.innerHTML = orcs;

    let main_scores = document.createElement("p");
    main_scores.append("DESTINY: ");
    main_scores.append(destiny_score);
    main_scores.append(" | POTATOES: ");
    main_scores.append(potatoes_score);
    main_scores.append(" | ORCS: ");
    main_scores.append(orcs_score);

    let trading_power = document.createElement("p");
    trading_power.innerHTML = "POTATOES FOR 1 ORC: " + potatoes_for_one_orc;

    let stats_div = document.createElement("div");
    stats_div.className = "stats";
    stats_div.append(main_scores);
    stats_div.append(trading_power);

    return stats_div;
}

function incident (message, destiny_delta, potato_delta, orc_delta, trading_delta)
{
    let message_p = document.createElement("p");
    message_p.innerHTML = message;

    let effects = [];

    if (destiny_delta < 0) {
        effects.push("destiny " + destiny_delta);
    } else if (destiny_delta > 0) {
        effects.push("destiny +" + destiny_delta);
    }

    if (potato_delta < 0) {
        effects.push("potatoes " + potato_delta);
    } else if (potato_delta > 0) {
        effects.push("potatoes +" + potato_delta);
    }

    if (orc_delta < 0) {
        effects.push("orcs " + orc_delta);
    } else if (orc_delta > 0) {
        effects.push("orcs +" + orc_delta);
    }

    if (trading_delta < 0) {
        effects.push("trading power +" + (-trading_delta));
    } else if (trading_delta > 0) {
        effects.push("trading power " + (-trading_delta));
    }

    let deltas_p = document.createElement("p");
    deltas_p.className = "deltas";
    deltas_p.innerHTML = effects.join(", ");

    let result = document.createElement("div");
    result.className = "incident";
    result.append(message_p);
    result.append(deltas_p);

    return result;
}

function endgame (message) {
    let p = document.createElement("p");
    p.id = "endgame";
    p.innerHTML = message;

    return p;
}

function playAgain ()
{
    window.location.href = "index.html";
}

function parseHistory (historyString) {
    const historySection = document.getElementById("history");

    let destiny = 0;
    let potatoes = 0;
    let orcs = 0;
    let potatoes_for_one_orc = 1;

    historySection.append(stats(destiny, potatoes, orcs, potatoes_for_one_orc));

    let i = 0;
    while (i < historyString.length) {
        switch (historyString[i]) {
            case 'A':
                historySection.append(playerMove("You advanced to the next day"));
                break;
            case 'T':
                i++;
                historySection.append(
                    playerMove("You traded " + historyString[i] + " POTATO for 1 ORC")
                );
                potatoes -= potatoes_for_one_orc;
                orcs -= 1;
                historySection.append(stats(destiny, potatoes, orcs, potatoes_for_one_orc));
                break;
            case 'E':
                i++;
                let class_name = null;
                let message = null;
                if (historyString[i] == 'd') {
                    message = GAME_DATA.endgames.destiny;
                    class_name = "destiny";
                } else if (historyString[i] == 'p') {
                    message = GAME_DATA.endgames.potatoes;
                    class_name = "potatoes";
                } else {
                    message = GAME_DATA.endgames.orcs;
                    class_name = "orcs";
                }

                let p = endgame(message);
                p.className = class_name;
                historySection.append(p);
                break;
            case 'g':
            case 'k':
            case 'm':
                let event_data = null;
                if (historyString[i] == 'g') {
                    event_data = GAME_DATA.events.garden;
                } else if (historyString[i] == 'k') {
                    event_data = GAME_DATA.events.knock;
                } else {
                    event_data = GAME_DATA.events.mud;
                }

                i++;
                let incident_data = event_data.incidents[parseInt(historyString[i])];

                historySection.append(
                    incident(
                        incident_data.message,
                        incident_data.destiny,
                        incident_data.potatoes,
                        incident_data.orcs,
                        incident_data.potatoes_for_one_orc,
                    )
                );

                destiny += incident_data.destiny;
                potatoes += incident_data.potatoes;
                orcs += incident_data.orcs;
                potatoes_for_one_orc += incident_data.potatoes_for_one_orc;

                historySection.append(stats(destiny, potatoes, orcs, potatoes_for_one_orc));
                break;
            default:
                console.assert(false);
        }
        i++;
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    const queryString = window.location.search;
    const URLParams = new URLSearchParams(queryString);

    parseHistory(URLParams.get("h"));

    // Add listeners for buttons.
    document.getElementById("play-again-btn").addEventListener("click", playAgain);
});
