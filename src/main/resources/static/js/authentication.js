let accessToken = "";
let accessTokenIsValid = false;
miro.onReady(() => {
    setTimeout(updateStatus, 0);
});


function requestAuthentication() {
    miro.board.ui.openBottomPanel(loginUrl, {width: 280})
        .finally(()=> {
        setTimeout(updateStatus, 0);
    });
}

function updateStatus() { // TODO: maybe add more params to if statements so it was even less clear what is happening here.
    $.get("/getAccessToken", function (data) {
        if (data != "" && !accessTokenIsValid){
            getSharedConfiguration(miroClientId)
                .then((config) => {
                    $.get({
                        url: "https://api.atlassian.com/oauth/token/accessible-resources",
                        headers: {"Authorization": "Bearer " + data},
                    }).then((accessibleResources) => {
                        for (let i = 0; i < accessibleResources.length; i++) {
                            if (config.jiraCloudId == accessibleResources[i].id) {
                                accessTokenIsValid = true;
                                accessToken = data;
                                setTimeout(updateStatus, 10000);
                                return;
                            }
                        }
                        requestAuthentication();
                    }).catch(reason => {
                        requestAuthentication();
                    })
                })
        } else if (data == ""){
            requestAuthentication();
        } else {
            setTimeout(updateStatus, 10000);
        }

    });
}