import "./logs/resultLog.js";
import bus from "../bus.js";

//bus.on("new_results", (data) => console.log(data.detail));

const style = /*css*/ `
.layout {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr 1fr 1fr;
}
`;

const html = /* html */ `
<div class="layout">
    <div class="logs-panel">
        <result-log s:id="marineLog"></result-log>
        <result-log s:id="alienLog"></result-log>
    </div>
    <div class="switch-panel"></div>
    <div class="controls-panel"></div>
    <div class="start-panel"></div>
</div>
`;

Slim.tag(
    "the-layout",
    `<style>${style}</style>${html}`,
    class extends Slim {
        get useShadow() {
            return true;
        }
        marineTextarea = null;
        alienTextarea = null;

        onRender() {
            this.marineTextarea = this.marineLog.find("div > textarea");
            this.alienTextarea = this.alienLog.find("div > textarea");
            bus.on("new_results", ({ detail: results }) => this.updateLogs(results));
        }

        updateLogs(results) {
            this.marineTextarea.value = results.marines.join("\n");
            this.alienTextarea.value = results.aliens.join("\n");
        }
    }
);
