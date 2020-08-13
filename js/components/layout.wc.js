import "./logs/resultLog.js";
import "./controls/fixed.js";
import "./controls/interval.js";
import bus from "../bus.js";

const style = /*css*/ `
.main-layout {
    display: grid;
    height: 100vh;
    grid-template-columns: 1.2fr 2fr;
    grid-column-gap: 2%;
}
.controls-layout {
    border-right: 1px solid black;
}
.result-layout {
    display: grid;
    grid-template-rows: 0.7fr 0.5fr 4fr;
}
.logs-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 95%;
    margin: 0 auto;
    grid-column-gap: 5%;
}
.winner-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
}
.winner-text-left {
    text-align: end;
    font-size: 2em;
}
.winner-text-right {
    font-size: 2em;
}
.game-number-container > p {
    text-align: center;
    font-size: 1.4em;
}
`;

const html = /* html */ `
<div class="main-layout">
<div class="controls-layout">
    <div class="displayChoice-container">
        <div>
            <input s:id="inputInterval" type="radio" name="displayChoice" id="interval" value="interval"checked>
            <label for="interval">interval</label>
        </div>
        <div>
            <input s:id="inputFixed" type="radio" name="displayChoice" id="fixedAmount" value="fixedAmount">
            <label for="fixedAmount">fixed amount</label>
        </div>
    </div>
    <div class="algo-choice-container">
        <label for="algo-select">Choose a ranking algorithm: </label>
        <select name="algo-select" id="algoSelect">
            <option value="elo">Elo</option>
        </select>
    </div>
    <fixed-controls bind:control-type="controls"></fixed-controls>
    <interval-controls bind:control-type="controls"></interval-controls>
</div>

<div class="result-layout">
    <div class="winner-container">
        <p class="winner-text-left">Winner: </p><p class="winner-text-right">&nbsp{{winner}}</p>
    </div>
    <div class="game-number-container">
        <p>Game n°{{gameNumber}}</p>
    </div>
    <div class="logs-panel">
        <result-log bind:team-name="marines" s:id="marineLog"></result-log>
        <result-log bind:team-name="aliens" s:id="alienLog"></result-log>
    </div>
    <div class="switch-panel"></div>
    <div class="controls-panel"></div>
    <div class="start-panel"></div>
</div>
</div>

`;

Slim.tag(
    "the-layout",
    `<style>${style}</style>${html}`,
    class extends Slim {
        get useShadow() {
            return true;
        }

        marines = "marines";
        aliens = "aliens";
        winner = "-";
        gameNumber = 0;
        controls = "interval";

        onRender() {
            bus.on("new_results", ({ detail: results }) => {
                console.log(results);
                this.marineLog.updateLog(results);
                this.alienLog.updateLog(results);
                this.winner = results.win;
                this.gameNumber = results.gamesPlayed;
            });
            this.inputFixed.addEventListener("change", () => this.toggleControls("fixed"));
            this.inputInterval.addEventListener("change", () => this.toggleControls("interval"));
        }

        toggleControls(type) {
            if (this.controls === type) return;
            this.controls = type;
        }
    }
);
