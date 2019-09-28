// await miro.board.widgets.update({id:"3074457346874992724", metadata:{"3074457346801799399": { sharedConfig: {jiraCloudId:"123123"}}}})
 async function getSharedConfiguration() {
     return await miro.board.widgets.get('metadata.' + miroClientId + '.sharedConfig')
             .then((widgets) => {
                 return widgets[0].metadata[miroClientId].sharedConfig;
             })
 }