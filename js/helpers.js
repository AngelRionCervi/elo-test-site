// tries to balance teams, not to implement
export function findTeams(players) {
    console.log(players)
    const len = 6;
    const start = 0;
    const result = [];
    result.length = len;
    let closestSum = null;
    let team1 = [];
    let team2 = [];

    const playersSum = players.reduce((acc, el) => acc + el.marineElo + el.alienElo, 0);

    const closest = (arr, goal) => {
        return arr.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));
    };

    combine(players, len, start);

    function combine(input, len, start) {
        const teamSum = result.reduce((acc, el) => acc + el.marineElo + el.alienElo, 0);
        if (len === 0) {
            const newClosestSum = closest([teamSum, closestSum], Math.round(playersSum / 2));
            if (newClosestSum !== closestSum) {
                closestSum = newClosestSum;
                team1 = [...result];
                team2 = input.filter((el) => !team1.map((n) => n.name).includes(el.name));
            }
            return;
        }
        for (let i = start; i <= input.length - len; i++) {
            result[result.length - len] = input[i];
            combine(input, len - 1, i + 1);
        }
    }
    return {
        marines: team1,
        aliens: team2,
        marineSum: Math.round(team1.reduce((acc, el) => acc + el.marineElo + el.alienElo, 0)),
        alienSum: Math.round(team2.reduce((acc, el) => acc + el.marineElo + el.alienElo, 0)),
        bestTeamSum: Math.round(playersSum / 2),
        totalPlayerSum: Math.round(playersSum),
        avg: Math.round(playersSum / 12),
        avgTotalMarine: Math.round(team1.reduce((acc, el) => acc + el.marineElo + el.alienElo, 0) / 6),
        avgTotalAlien: Math.round(team2.reduce((acc, el) => acc + el.marineElo + el.alienElo, 0) / 6),
        avgMarine: Math.round(team1.reduce((acc, el) => acc + el.marineElo, 0) / 6),
        avgAlien: Math.round(team2.reduce((acc, el) => acc + el.alienElo, 0) / 6),
    };
}

export function weightedRandom(prob) {
    let i,
        sum = 0,
        r = Math.random();
    for (i in prob) {
        sum += prob[i];
        if (r <= sum) return i;
    }
}