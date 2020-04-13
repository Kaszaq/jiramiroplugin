function getPreviousTransitions(widget) {
    try {
        return widget.metadata[miro.getClientId()].transitions;
    } catch (e) { // is this an antipattern in javascript? other ways to check this look ridiculously complex
        return [];
    }
}


function removeTransitionsForProject(previousTransitions, projectKey, jiraCloudId) {
    for (let i = previousTransitions.length - 1; i >= 0; i--) {
        if (previousTransitions[i].projectKey === projectKey && previousTransitions[i].jiraCloudId=== jiraCloudId) {
            previousTransitions.splice(i, 1);
        }
    }
}
function removeTransitionsForId(previousTransitions, transitionId, jiraCloudId) {
    for (let i = previousTransitions.length - 1; i >= 0; i--) {
        if (previousTransitions[i].id === transitionId  && previousTransitions[i].jiraCloudId=== jiraCloudId) {
            previousTransitions.splice(i, 1);
        }
    }
}

async function setWidgetAsTransitionBox(widget, jiraCloudId, projectKey, transitionName, transitionId, statusName) {

    let updateObj = {id: widget.id, metadata: {}};
    let previousTransitions = getPreviousTransitions(widget);
    removeTransitionsForProject(previousTransitions, projectKey, jiraCloudId);
    previousTransitions.push({
        id: transitionId,
        name: transitionName,
        jiraCloudId: jiraCloudId,
        projectKey: projectKey,
        statusName: statusName
    });
    updateObj.metadata[miro.getClientId()] = {
        transitions: previousTransitions
    };
    return miro.board.widgets.__blinkWidget(await miro.board.widgets.update(updateObj));
}

async function removeTransitionFromWidget(widget, transitionId, jiraCloudId) {
    let updateObj = {id: widget.id, metadata: {}};
    let previousTransitions = getPreviousTransitions(widget);
    removeTransitionsForId(previousTransitions, transitionId, jiraCloudId);
    updateObj.metadata[miro.getClientId()] = {
        transitions: previousTransitions
    };
    return miro.board.widgets.__blinkWidget(await miro.board.widgets.update(updateObj));
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
    return miro.board.widgets.get('metadata.' + miro.getClientId() + '.transitions')
}
