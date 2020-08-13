const style = /* css */ `

`;

const html = /* html */ `

`;

Slim.tag(
    "fixed-controls",
    `<style>${style}</style>${html}`,
    class extends Slim {
        get useShadow() {
            return true;
        }
    }
);
