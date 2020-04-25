class AccessToken {
    constructor(token, ttl) {
        this.token = token;
        this.ttl=ttl;

    }
    getTimeLeftInMiliseconds = function () {

    }
}


class AtlassianAuthorizer {

    constructor(requiredScope, appUrl) {
        this.boardUsingTransitionBoxes = false;
        this.accessToken=null;
    }

    async initialize() {
        setTimeout(verifyAuthentication, 0);
    }

    async verifyIfUsingTransitionBoxes() {

    }
    isNewAccessTokenRequired() {
        return false;
    }

    async verifyAuthentication(){



        if(!this.boardUsingTransitionBoxes){
            this.verifyIfUsingTransitionBoxes()
                .then((boardUsingTransitionBoxes) => {
                    this.boardUsingTransitionBoxes=boardUsingTransitionBoxes;
                    if(boardUsingTransitionBoxes) {
                        verifyAuthentication();
                    } else {
                        setTimeout(verifyAuthentication, 10_000);
                    }
                })
        } else { //todo: previusly there was a check whether "if(this.isNewAccessTokenRequired())" but I decided to skip it and refresh logic base purly on timeout loops.
            let accessToken = await getFreshAccessToken();
            if (accessToken!=null) {
                this.accessToken=accessToken;
                setTimeout(verifyAuthentication, this.getTimeout());
            } else {
                authenticate().finally(verifyAuthentication);

            }
        }
    }

    async authenticate() {

    }


    getTimeout() {
        let timeLeftOnToken = accessToken.getTimeLeftInMiliseconds() / 2;
        return timeLeftOnToken < 5000 ? 5000 : timeLeftOnToken ;
    }

    async checkAuthorization(){
        if (!this.authz) {
            this.authz = contains(await miro.currentUser.getScopes(), this.requiredScope);
        }
        return this.authz;
    }


     authenticationSuccess;
     authenticationFailure;

     tryHiddenAuthentication() {
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

    requestAuthentication() {
// todo: miro notify that trying to reconnect with Jira, please wait
        tryHiddenAuthentication()
            .catch(() => {
                return miro.board.ui.openModal(document.location.protocol +'//' + document.location.host+ '/oauth2/login', {width: 280})
            })
            .finally(() => {
                setTimeout(updateStatus, 0);
            });
    }

    promptForAuthentication() {
        miro.board.ui.openModal(this.appUrl+"/install", {width: 740, height: 600}).then(() => this.checkAuthorization());
    }
}