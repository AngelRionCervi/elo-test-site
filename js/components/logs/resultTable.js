const style = /* css */ `
.team-result {
    width: 100%;
}
`;

const html = /* html */ `
<table>
    <tbody>
        <tr s:repeat="items as item" bind>
            <td>The table body</td>
            <td>with two columns</td>
        </tr>
    </tbody>
</table>
`;

Slim.tag(
    "result-table",
    `<style>${style}</style>${html}`,
    class ResultTable extends Slim {
        constructor() {
            super();
            this.items = ["Banana", "Orange", "Apple"]
        }
        get useShadow() {
            return true;
        }

        onBeforeCreated() {
            this.items = ["Banana", "Orange", "Apple"]
        }

        update(results) {
            console.log(results)
        }
    }
);
