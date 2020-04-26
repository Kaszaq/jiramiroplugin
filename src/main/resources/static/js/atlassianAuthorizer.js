class AccessToken {
    constructor(token, ttl) {
        this.token = token;
        this.endDate = new Date().getTime()/1000-30+ttl;

    }
    getTimeLeftInMiliseconds = function () {

    }

}


class AtlassianAuthorizer {

    constructor(requiredScope, appUrl) {
        this.boardUsingTransitionBoxes = false;
        this.accessToken=null;
        setTimeout(this.verifyAuthentication, 0);
    }

    async verifyIfUsingTransitionBoxes() {
        miro.board.widgets.get('metadata.' + miro.getClientId())
            .then((listOfWidgets) =>{
                return listOfWidgets.length>0;
            })
    }

    isNewAccessTokenRequired() {
        return false;
    }


    getTimeout() {
        if(!accessToken) return 0;
        let timeLeftOnToken = accessToken.getTimeLeftInMiliseconds() / 2;
        return timeLeftOnToken < 5000 ? 5000 : timeLeftOnToken ;
    }

    async verifyAuthentication(){



        if(!this.boardUsingTransitionBoxes){
            this.verifyIfUsingTransitionBoxes()
                .then((boardUsingTransitionBoxes) => {
                    this.boardUsingTransitionBoxes=boardUsingTransitionBoxes;
                    if(boardUsingTransitionBoxes) {
                        this.verifyAuthentication();
                    }
                    // else {
                    // // note: i decided to comment this out. Such action should be then triggered when user would actually require authentication
                    // // as an alternative plugin could be listening in such case for new widgets added to the board to verify whether they are
                    // // from this plugin
                    //     setTimeout(this.verifyAuthentication, 10_000);
                    // }
                })
        } else { //sidenote: previusly there was a check whether "if(this.isNewAccessTokenRequired())" but I decided to skip it and refresh logic base purly on timeout loops.
            let accessToken = await this.getFreshAccessToken();
            if (accessToken!=null) {
                this.accessToken=accessToken;
                setTimeout(this.verifyAuthentication, this.getTimeout());
            } else {
                this.authenticate()
                    // todo: this should here handle cancel of the user. In such case the application should not enforce user to reauthenticate.
                    // another authentication would be triggered based on user interactions
                    // on the board - either by trying to authenticate to via buttom when adding
                    // new "sites" or when triggering an operation on the board that would
                    // or should cause a card to get updated. Trigger when trying to move a
                    // card should not happen too often, good to consider monitoring whether
                    // this is something to really care about

                    .finally(this.verifyAuthentication);
            }
        }
    }

    async authenticate(prompt) {
        if(!prompt) {
            return this.tryHiddenAuthentication()
                .catch(() => {
                    return this.startAuthenticationProcess()
                })
        } else {
            return this.startAuthenticationProcess(prompt)
        }
    }

    async startAuthenticationProcess(prompt) {
        prompt = prompt | false;
        return miro.board.ui.openModal(document.location.protocol + '//' + document.location.host + '/oauth2/login?prompt='+prompt, {width: 740, height: 600})
    }

     authenticationSuccess;
     authenticationFailure;

     tryHiddenAuthentication() { // todo: add monitoring how often this actually successes or fails
        $("#authenticationFrame")[0].src = "/oauth2/authorization/atlassian?none"
        return new Promise(function (resolve, reject) {
            this.authenticationSuccess = function () {
                resolve();
            }
            this.authenticationFailure = function () {
                reject();
            }
            setTimeout(function () {
                this.authenticationSuccess = null;
                this.authenticationFailure = null;
                reject();
            }, 5000);
        });
    }
}