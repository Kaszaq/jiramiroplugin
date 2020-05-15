let state = [];


function cleanupState() {
    state = [];
    miro.__setRuntimeState({envs:state});
}

function addCloudEnvToState(cloudEnv) {
    state.push(cloudEnv);
    miro.__setRuntimeState({envs:state});
}


function configureRuntimeState(accessibleResources, accessToken) {

    for (let i = 0; i < accessibleResources.length; i++) {
        let jiraUrl = 'https://api.atlassian.com/ex/jira/' + accessibleResources[i].id;
        $.get({
            url: jiraUrl + '/rest/api/3/project',
            headers: {"Authorization": "Bearer " + accessToken},
        }).then((projectsRaw) => {
            let projects = [];
            for (let j = 0; j < projectsRaw.length; j++) {
                projects.push({
                    id: projectsRaw[j].id,
                    key: projectsRaw[j].key,
                    name: projectsRaw[j].name
                })
            }
            let cloudEnv = {
                id: accessibleResources[i].id,
                name: accessibleResources[i].name,
                projects: projects,
            }
            addCloudEnvToState(cloudEnv);
        })
    }
}
