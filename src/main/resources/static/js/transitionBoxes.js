
function widgetContainsTransitionForProject(widget, projectKey) {
	let transitions;
	try {
		transitions = widget.metadata[miroClientId].transitions;
		for (let i = 0; i < transitions.length; i++) {
			if (transitions[i].projectKey === projectKey) {
				return true;
			}
		}
	} catch(e) { // is this an antipattern in javascript? other ways to check this look ridiculously complex
		// ignore
	}
    return false;
}

async function setWidgetAsTransitionBox(widget, jiraCloudId, projectKey, transitionName, transitionId, statusName) {
    if (!widgetContainsTransitionForProject(widget, projectKey)) {
        let updateObj = {id: widget.id, metadata: {}};
        updateObj.metadata[miroClientId] = {
            transitions: [{
                id: transitionId,
                name: transitionName,
                jiraCloudId: jiraCloudId,
                projectKey: projectKey,
                statusName: statusName
            }]
        };
		return miro.board.widgets.__blinkWidget(await miro.board.widgets.update(updateObj));

    }
}

async function setSelectedWidgetsAsTransitionBox(jiraCloudId, projectKey, transitionName, transitionId, statusName) {
    miro.board.selection.get().then((widgets) => {
            // todo: add check if is only one
            widgets.forEach(widget => {
                setWidgetAsTransitionBox(widget, jiraCloudId, projectKey, transitionName, transitionId);
            })
        }
    )
}

async function getTransitionBoxes() {
    return miro.board.widgets.get('metadata.' + miroClientId + '.transitions')
}
