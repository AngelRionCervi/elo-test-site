const style = /* css */ `
.team-result {
    width: 100%;
}
`;

const html = /* html */ `
<div s:id="resultLogPanel" class="result-log-panel">
    <p>{{teamName}}</p>
    <textarea rows="12" class="team-result"></textarea>
</div>
`;

Slim.tag(
    "result-log",
    `<style>${style}</style>${html}`,
    class extends Slim {
        get useShadow() {
            return true;
        }
        updateLog(results) {
            console.log(results)
            this.resultLogPanel.querySelector("textarea").value = results[this.teamName].join("\n");
        }
    }
);
