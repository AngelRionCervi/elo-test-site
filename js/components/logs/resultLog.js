const style = /* css */ `
.team-result {
    width: 100%;
}
`;

const html = /* html */ `
<div class="result-log">
    <textarea rows="20" class="team-result"></textarea>
</div>
`;

Slim.tag(
    "result-log",
    `<style>${style}</style>${html}`,
    class extends Slim {
        get useShadow() {
            return true;
        }
    }
);
