import bus from "../../bus.js";

const style = /* css */ `
.disabled {
    opacity: 0.4;
    pointer-events: none;
}
`;

const html = /* html */ `
    <div s:id="fixedAmount" class="interval-control-container">
        <input type="text" value="50" s:id="gameAmount">
    </div>
`;

Slim.tag(
    "fixed-controls",
    `<style>${style}</style>${html}`,
    class extends Slim {
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
            this.fixedAmount.classList.toggle("disabled");
        }

        onRender() {
            this.gameAmount.addEventListener("input", (evt) => {
                bus.emit("new-amount", parseInt(evt.target.value));
            });
        }
    }
);
