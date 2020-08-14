import Teams from "./teams.js";
import { weightedRandom } from "./helpers.js";
import Elo from "./elo.js";
import * as _G from "./_GLOBALS_.js";
import players from "./players.js";
import bus from "./bus.js";

const teams = Teams(players);
const elo = Elo(_G.K_FACTOR);

const initIntervalControl = () => {
    let intervalTime = 50;
    let interval = null;
    return {
        start() {
            interval = setInterval(() => {
                teams.createNewTeams();
                const expectedScoreAlien = elo.getExpected(teams.avgTotalAlien, teams.avgTotalMarine);
                const expectedScoreMarine = elo.getExpected(teams.avgTotalMarine, teams.avgTotalAlien);
                const teamWin = weightedRandom({ alien: expectedScoreAlien, marine: expectedScoreMarine });
                teams.updateRatings(teamWin);
                bus.emit("new_results", {
                    log: teams.formatResults(),
                    raw: { aliens: teams.aliens, marines: teams.marines },
                });
            }, intervalTime);
        },
        stop() {
            clearInterval(interval);
            interval = null;
        },
        setNewIntervalTime(time) {
            intervalTime = time;
        },
        get isRunning() {
            return !!interval;
        },
    };
};

const initAmountControl = () => {
    let gameAmount = 50;
    return {
        start() {
            for (let u = 0; u < gameAmount; u++) {
                teams.createNewTeams();
                const expectedScoreAlien = elo.getExpected(teams.avgTotalAlien, teams.avgTotalMarine);
                const expectedScoreMarine = elo.getExpected(teams.avgTotalMarine, teams.avgTotalAlien);
                const teamWin = weightedRandom({ alien: expectedScoreAlien, marine: expectedScoreMarine });
                teams.updateRatings(teamWin);
            }
            bus.emit("new_results", {
                log: teams.formatResults(),
                raw: { aliens: teams.aliens, marines: teams.marines },
            });
        },
        stop() {
            // would stop a web worker
        },
        setNewAmount(amount) {
            gameAmount = amount;
        },
        get isRunning() {},
    };
};

const intervalControl = initIntervalControl();
const amountControl = initAmountControl();

// events //
bus.on("new-interval", ({ detail: time }) => {
    if (intervalControl.isRunning) {
        setTimeout(() => {
            intervalControl.start();
        }, 0);
    }
    intervalControl.stop();
    intervalControl.setNewIntervalTime(time);
});

bus.on("new-amount", ({ detail: amount }) => {
    amountControl.setNewAmount(amount);
    /*
    intervalControl.setNewIntervalTime(time);
    intervalControl.clear();
    intervalControl.start();*/
});

bus.on("start", ({ detail: controls }) => {
    if (controls === "interval") {
        if (!intervalControl.isRunning) {
            intervalControl.start();
        }
    } else {
        if (intervalControl.isRunning) {
            intervalControl.stop();
        }
        amountControl.start();
    }
});

bus.on("pause", ({ detail: controls }) => {
    if (controls === "interval") {
        intervalControl.stop();
    }
});

bus.on("reset", () => {
    intervalControl.stop();
    amountControl.stop();
    teams.resetTeams();
    bus.emit("new_results", {
        log: teams.formatResults(),
        raw: { aliens: teams.aliens, marines: teams.marines },
    });
});

/*
setInterval(() => {
    teams.createNewTeams();
    const expectedScoreAlien = elo.getExpected(teams.avgTotalAlien, teams.avgTotalMarine);
    const expectedScoreMarine = elo.getExpected(teams.avgTotalMarine, teams.avgTotalAlien);
    const teamWin = weightedRandom({ alien: expectedScoreAlien, marine: expectedScoreMarine });
    teams.updateRatings(teamWin);
    bus.emit("new_results", teams.formatResults());
    //console.log(teams.formatResults());
}, 1000);*/

/*
for (let u = 0; u < 1_000_000; u++) {
    teams.shuffle();
    const expectedScoreAlien = elo.getExpected(teams.avgAlienTotal, teams.avgMarineTotal);
    const expectedScoreMarine = elo.getExpected(teams.avgMarineTotal, teams.avgAlienTotal);
    const teamWin = weightedRandom({ alien: expectedScoreAlien, marine: expectedScoreMarine });
    
    // update the ratings accordingly
    teams.updateRatings(teamWin);
}
console.log(teams.formatResults);*/
