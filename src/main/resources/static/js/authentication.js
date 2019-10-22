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

                $.get({
                    url: "https://api.atlassian.com/oauth/token/accessible-resources",
                    headers: {"Authorization": "Bearer " + data},
                }).then((accessibleResources) => {
                    accessTokenIsValid = true;
                    accessToken = data;
                    configureRuntimeState(accessibleResources);
                    setTimeout(updateStatus, 10000);
                }).catch(reason => {
                    requestAuthentication();
                })
        } else if (data == ""){
            accessTokenIsValid = false;
            accessToken = data;
            cleanupState();
            requestAuthentication();
        } else {
			accessToken = data; //TODO; probably it would be good to verify this one as well ;)
            setTimeout(updateStatus, 10000);
        }

    });
}