

let accessToken = "";
let accessTokenIsValid = false;

miro.onReady(() => {
    setTimeout(updateStatus, 0);
});
var authenticationSuccess;
var authenticationFailure;

function tryHiddenAuthentication() {
    $("#authenticationFrame")[0].src = "/oauth2/authorization/atlassian?none"
    return new Promise(function (resolve, reject) {
        authenticationSuccess = function () {
            resolve();
        }
        authenticationFailure = function () {
            reject();
        }
        setTimeout(function () {
            authenticationSuccess = null;
            authenticationFailure = null;
            reject();
        }, 5000);
    });


}

function requestAuthentication() {
// todo: miro notify that trying to reconnect with Jira, please wait
    tryHiddenAuthentication()
        .catch(() => {
            return miro.board.ui.openBottomPanel(loginUrl, {width: 280})
        })
        .finally(() => {
            setTimeout(updateStatus, 0);
        });
}

function updateStatus() { // TODO: maybe add more params to if statements so it was even less clear what is happening here.
    if(authorizer.isAuthorized()){
    $.get("/getAccessToken")
        .done(function (data) {
            if (data != "" && !accessTokenIsValid) {

                $.get({
                    url: "https://api.atlassian.com/oauth/token/accessible-resources",
                    headers: {"Authorization": "Bearer " + data},
                }).then((accessibleResources) => {
                    accessTokenIsValid = true;
                    accessToken = data;
                    configureRuntimeState(accessibleResources);
                    setTimeout(updateStatus, 10000);
                }).catch(reason => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             233
                    requestAuthentication();
                })
            } else if (data == "") {
                accessTokenIsValid = false;
                accessToken = data;
                cleanupState();
                requestAuthentication();
            } else {
                accessToken = data; //TODO; probably it would be good to verify this one as well ;)
                setTimeout(updateStatus, 10000);
            }
        })
        .fail(function() {
            setTimeout(updateStatus, 10000);
        })
    } else {
        setTimeout(updateStatus, 1000);
    }
}