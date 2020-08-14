import "./logs/resultLog.js";
import "./logs/resultTable.js";
import "./controls/fixed.js";
import "./controls/interval.js";
import bus from "../bus.js";

const style = /*css*/ `
.main-layout {
    display: grid;
    grid-template-rows: 1fr 1.5fr;
    height: 100vh;
    width: 80%;
    margin: 0 auto;
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
.controls-graph-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
}
.interval-fixed-container {
    margin-top: 2.5%;
    display: grid;
    grid-template-columns: 1fr 1fr;
}
`;

const html = /* html */ `
<div class="main-layout">
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
    
</div>
<div class="controls-graph-container">
    <div class="controls-container">
    
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
    <div class="interval-fixed-container">
        <fixed-controls bind:control-type="controls"></fixed-controls>
        <interval-controls bind:control-type="controls"></interval-controls>
    </div>
    <div class="start-panel">
        <button s:id="startPauseBtn">{{startPause}}</button>
        <button s:id="resetBtn">reset</button>
    </div>
    </div>
    <div class="score-container">
   
    </div>
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
        startPause = "start";

        onRender() {
            bus.on("new_results", ({ detail: results }) => {
                console.log(results)
                this.marineLog.updateLog(results.log);
                this.alienLog.updateLog(results.log);
                this.winner = results.log.win;
                this.gameNumber = results.log.gamesPlayed;
            });

            this.inputFixed.addEventListener("change", () => this.toggleControls("fixed"));
            this.inputInterval.addEventListener("change", () => this.toggleControls("interval"));
            this.startPauseBtn.addEventListener("click", () => this.toggleStartPause());
            this.resetBtn.addEventListener("click", () => this.reset());
        }

        toggleControls(type) {
            if (this.controls === type) return;
            this.controls = type;
            if (this.controls === "fixed") this.startPause = "start";
        }

        toggleStartPause() {
            if (this.startPause === "start") {
                bus.emit("start", this.controls);
                if (this.controls === "interval") this.startPause = "pause";
            } else {
                bus.emit("pause", this.controls);
                this.startPause = "start";
            }
        }

        reset() {
            bus.emit("reset");
            this.startPause = "start";
        }
    }
);
