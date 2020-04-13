let accessToken = ""

function boxContainsTransition(box, transitionId) {
    let transitions = box.metadata[miro.getClientId()].transitions;
    for (let i = 0; i < transitions.length; i++) {
        if (transitions[i].id === transitionId) {
            return true;
        }
    }
    return false;
}

function setNewRow(parentElement, jiraCloudId, projectKey, transitionName, transitionId, statusName) {
    let row = "<div class='row mt-1'><div class='col-7 text-right text-truncate'>" + transitionName + "</div>"
        + "<div class='pl-0 col-5 pr-0'>"
        + "<button id='transitionButtonSet_" + transitionId + "' type='button' class='btn-sm btn btn-outline-primary w-50'>Set</button>"
        + "<button id='transitionButtonBlink_" + transitionId + "' type='button' class='btn-sm btn btn-outline-secondary'>Blink</button>"
        + "<button id='transitionButtonClear_" + transitionId + "' type=\"button\" class=\"close\" aria-label=\"Close\">"
        + "  <span aria-hidden=\"true\">×</span>"
        + "</button>"
        + " </div>"
        + "</div>";
    parentElement.append(row);
    $("#transitionButtonSet_" + transitionId).click(function () {
        miro.broadcastData({
            type: 'select_transition_box',
            data: {
                jiraCloudId: jiraCloudId,
                projectKey: projectKey,
                transitionName: transitionName,
                transitionId: transitionId,
                statusName: statusName
            }
        })
    });
    $("#transitionButtonBlink_" + transitionId).click(function () {
        getTransitionBoxes().then(transitionBoxes => {
            let transitionBoxesForThisTransition = [];
            transitionBoxes.forEach(box => {
                if (boxContainsTransition(box, transitionId)) {
                    transitionBoxesForThisTransition.push(box);
                }
            });
            miro.board.widgets.__blinkWidget(transitionBoxesForThisTransition);
        })
    });
    $("#transitionButtonClear_" + transitionId).click(function () {
        let needToClear = confirm('Do you want clear '+ transitionName +' transitions?');

        if (needToClear) {
            getTransitionBoxes().then(transitionBoxes => {
                transitionBoxes.forEach(box => {
                    if (boxContainsTransition(box, transitionId)) {
                        removeTransitionFromWidget(box,transitionId, jiraCloudId)
                    }
                });

            })
        }



    });

}


function loadTransitionsForProject(cloudEnv, projectId) {
    $('#transitionRows').empty();
    let projectKey = "";
    cloudEnv.projects.forEach(project => {
        if (project.id == projectId) {
            projectKey = project.key;
        }
    })
    let jiraUrl = 'https://api.atlassian.com/ex/jira/' + cloudEnv.id;
    $.get({
        url: jiraUrl + '/rest/api/3/search',
        headers: {"Authorization": "Bearer " + accessToken},
        data: {
            maxResults: 1,
            jql: 'project=' + projectKey,
            fields: 'key'
        }
    }).then((result) => {
        let sampleIssueKey = result.issues[0].key;


        $.get({
            url: jiraUrl + '/rest/api/3/issue/' + sampleIssueKey + '/transitions',
            headers: {"Authorization": "Bearer " + accessToken}
        }).then((issueDetails) => {

            issueDetails.transitions.forEach(transition => {
                setNewRow($('#transitionRows'), cloudEnv.id, projectKey, transition.name, transition.id, transition.to.name);
            })
        })

    })
    $('#bindTransitions').show();
}

function loadProjects(cloudEnv) {

    let chooseProjectSelect = $('#chooseProject select');
    chooseProjectSelect.empty();
    $('#bindTransitions').hide();
    cloudEnv.projects.forEach(project => {

        chooseProjectSelect.append($("<option></option>")
            .attr("value", project.id)
            .text(project.key + " - " + project.name));
    });
    chooseProjectSelect.off("change");
    chooseProjectSelect.change(function () {
        loadTransitionsForProject(cloudEnv, $(this).val());
    });
    loadTransitionsForProject(cloudEnv, cloudEnv.projects[0].id);
    $('#chooseProject').show();
}

miro.onReady(() => {
    $.get("/getAccessToken", function (data) {
        accessToken = data

        miro.__getRuntimeState().then(stateStored => {

                let state = stateStored.envs;
                if (!jQuery.isEmptyObject(state)) {
                    let jiraCloudInstanceSelect = $('#jiraCloudInstance select');
                    jiraCloudInstanceSelect.empty();
                    state.forEach(cloudEnv => {
                        jiraCloudInstanceSelect.append($("<option></option>")
                            .attr("value", cloudEnv.id)
                            .text(cloudEnv.name));
                    })
                    jiraCloudInstanceSelect.off("change");
                    jiraCloudInstanceSelect.change(function () {
                        state.forEach(cloudEnv => {
                            if (cloudEnv.id == $(this).val()) {
                                loadProjects(cloudEnv);
                            }
                        })

                    });
                    loadProjects(state[0]);
                    $('#jiraCloudInstance').show();
                } else {

                    // create empty page with msg smth like - please press the "authentication button at the bottom of the page" or smth
                }
            }
        )
    });
})
/*
let cloudEnv = {
            id: accessibleResources[i].id,
            name: accessibleResources[i].name,
            projects: projects,
        }
 */

