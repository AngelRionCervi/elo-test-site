import { findTeams } from "./helpers.js";
import Elo from "./elo.js";
import * as _G from "./_GLOBALS_.js";

const elo = Elo(_G.K_FACTOR);

export default (players) => {
    return {
        players,
        aliens: null,
        marines: null,
        lastWin: null,
        maxAlienElo: null,
        maxMarineElo: null,
        gamesPlayed: 0,
        alienWins: 0,
        marineWins: 0,
        formatResults() {
            const aliens = this.aliens.reduce((acc, player) => {
                return [
                    ...acc,
                    `${player.name}: alien: ${player.alienElo}, marine: ${player.marineElo} alienDif: ${
                        player.lastGameDif > 0 ? "+" + player.lastGameDif : player.lastGameDif
                    }`,
                ];
            }, []);
            const marines = this.marines.reduce((acc, player) => {
                return [
                    ...acc,
                    `${player.name}: alien: ${player.alienElo}, marine: ${player.marineElo} marineDif: ${
                        player.lastGameDif > 0 ? "+" + player.lastGameDif : player.lastGameDif
                    }`,
                ];
            }, []);

            return {
                aliens,
                marines,
                avgAlien: this.avgAlien,
                avgMarine: this.avgMarine,
                avgTotalAlien: this.avgTotalAlien,
                avgTotalMarine: this.avgTotalMarine,
                win: this.lastWin,
                alienWins: this.alienWins,
                marineWins: this.marineWins,
                maxAlienElo: this.maxAlienElo,
                maxMarineElo: this.maxMarineElo,
                gamesPlayed: this.gamesPlayed,
            };
        },
        getResults() {
            return { marines: this.marines, alien: this.aliens };
        },
        createNewTeams() {
            const shuffled = findTeams([...this.players]);
            Object.assign(this, shuffled);
        },
        resetTeams() {
            this.players = [...this.players].reduce((acc, player) => {
                return [...acc, { name: player.name, marineElo: 0, alienElo: 0 }];
            }, []);
            this.gamesPlayed = 0;
            this.alienWins = 0;
            this.marineWins = 0;
            this.aliens = null;
            this.marines = null;
            this.lastWin = null;
            this.createNewTeams();
        },
        updateRatings(teamWin) {
            // updates the marine or alien elo of the teams
            this.gamesPlayed++;
            this.lastWin = teamWin;
            teamWin === "alien" ? this.alienWins++ : this.marineWins++;

            this.aliens.forEach((player) => {
                const expectedPlayerScore = elo.getExpected(player.alienElo, this.avgMarine);
                let newElo = elo.updateRating(expectedPlayerScore, teamWin === "alien", player.alienElo);
                const eloDif = newElo - player.alienElo;

                if (newElo < 0) newElo = 0;
                if (newElo > this.maxAlienElo) this.maxAlienElo = newElo;

                player.lastGameDif = eloDif;
                player.alienElo = newElo;
            });
            this.marines.forEach((player) => {
                const expectedPlayerScore = elo.getExpected(player.marineElo, this.avgAlien);
                let newElo = elo.updateRating(expectedPlayerScore, teamWin === "marine", player.marineElo);
                const eloDif = newElo - player.marineElo;

                if (newElo < 0) newElo = 0;
                if (newElo > this.maxMarineElo) this.maxMarineElo = newElo;

                player.lastGameDif = eloDif;
                player.marineElo = newElo;
            });
        },
    };
};
