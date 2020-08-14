import bus from "../../bus.js";

const style = /* css */ `
    .disabled {
        opacity: 0.4;
        pointer-events: none;
    }
    .interval-control-container {
        width: 100%;
    }
    .interval-slider {
        width: 70%;
    }
`;

const html = /* html */ `
    <div s:id="intervalContainer" class="interval-control-container disabled">
        <input class="interval-slider" type="range" min="5" max="2500" value="50" s:id="gameIntervalSlider">
        <p>{{currentSliderVal}}ms</p>
    </div>
`;

Slim.tag(
    "interval-controls",
    `<style>${style}</style>${html}`,
    class extends Slim {

        currentSliderVal = 50;

        get useShadow() {
            return true;
        }

        static get observedAttributes() {
            return ["control-type"];
        }

        get autoBoundAttributes() {
            return ["control-type"];
        }

        onControlTypeChanged() {
            this.intervalContainer.classList.toggle("disabled");
        }

        onRender() {
            this.gameIntervalSlider.addEventListener("input", (evt) => {
                this.currentSliderVal = parseInt(evt.target.value);
                bus.emit("new-interval", this.currentSliderVal);
            });
        }
    }
);
