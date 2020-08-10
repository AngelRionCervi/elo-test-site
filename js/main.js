import Teams from "./teams.js";
import { weightedRandom } from "./helpers.js";
import Elo from "./elo.js";
import * as _G from "./_GLOBALS_.js";
import players from "./players.js";
import bus from "./bus.js";

const teams = Teams(players);
const elo = Elo(_G.K_FACTOR);

setInterval(() => {
    teams.createNewTeams();
    const expectedScoreAlien = elo.getExpected(teams.avgTotalAlien, teams.avgTotalMarine);
    const expectedScoreMarine = elo.getExpected(teams.avgTotalMarine, teams.avgTotalAlien);
    const teamWin = weightedRandom({ alien: expectedScoreAlien, marine: expectedScoreMarine });
    teams.updateRatings(teamWin);
    bus.emit("new_results", teams.formatResults());
    //console.log(teams.formatResults());
}, 100);

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