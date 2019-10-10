// await miro.board.widgets.update({id:"3074457346874992724", metadata:{"3074457346801799399": { sharedConfig: {jiraCloudId:"123123", projectIds:["TEST"]}}}})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getJiraCloudId() { //todo: this should become obsolete


    let cloudId = {};
    let found = false;
    while (!found) {
        let transitionBoxes = await getTransitionBoxes();
        if (transitionBoxes[0]) {
            found = true;
            cloudId = confWidget[0].metadata[miroClientId].transitions[0].jiraCloudId;
        } else {
            await sleep(1000);
        }
    }
    return cloudId;
 }