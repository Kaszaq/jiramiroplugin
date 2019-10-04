// await miro.board.widgets.update({id:"3074457346874992724", metadata:{"3074457346801799399": { sharedConfig: {jiraCloudId:"123123", projectIds:["TEST"]}}}})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getSharedConfiguration() {
    let config = {};
    let found = false;
    while (!found) {
        let confWidget = await miro.board.widgets.get('metadata.' + miroClientId + '.sharedConfig');
        if (confWidget[0]) {
            found = true;
            config = confWidget[0].metadata[miroClientId].sharedConfig
        } else {
            await sleep(1000);
        }
    }
    return config;
 }