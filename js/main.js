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
    let interval;
    return {
        start() {
            interval = setInterval(() => {
                teams.createNewTeams();
                const expectedScoreAlien = elo.getExpected(teams.avgTotalAlien, teams.avgTotalMarine);
                const expectedScoreMarine = elo.getExpected(teams.avgTotalMarine, teams.avgTotalAlien);
                const teamWin = weightedRandom({ alien: expectedScoreAlien, marine: expectedScoreMarine });
                teams.updateRatings(teamWin);
                bus.emit("new_results", teams.formatResults());
            }, intervalTime);
        },
        clear() {
            clearInterval(interval);
        },
        setNewIntervalTime(time) {
            intervalTime = time;
        },
    };
};

const intervalControl = initIntervalControl();

// events //
bus.on("new-interval", ({ detail: time }) => {
    intervalControl.setNewIntervalTime(time);
    intervalControl.clear();
    intervalControl.start();
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
