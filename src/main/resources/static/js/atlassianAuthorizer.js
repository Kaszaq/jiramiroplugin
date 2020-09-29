class AccessToken {
    constructor(token, ttl) {
        this.token = token;
        this.endDateMilis = new Date().getTime() + ttl * 1_000;

    }
    getTimeLeftInMiliseconds = function () {
        return this.endDateMilis - new Date().getTime();
    }

    isExpired = function () {
        return this.endDateMilis - new Date().getTime() <= 0;
    }
}


class AtlassianAuthorizer {

    constructor() {
        this.tokenRefreshInitialized = false;
        this.accessToken = new AccessToken("", 0); //expired/invalid token. Would be better if this was a static value from that object, dont know how to do it :D
    }

    _isAuthorized() {
        return !this.accessToken.isExpired();
    }

    authorized() {
        let isAuthz = this._isAuthorized();
        if (!isAuthz || !this.tokenRefreshInitialized) {
            this._verifyAuthentication();
            this.tokenRefreshInitialized = true;
        }
        return isAuthz;
    }

    getAccessToken() {
        if (this.authorized()) {
            return this.accessToken.token;
        } else return null;
    }

    async _verifyAuthentication() {

        let accessToken = await this._getFreshAccessToken();
        if (!accessToken.isExpired()) {
            this.accessToken = accessToken;
            setTimeout(this._verifyAuthentication.bind(this), this._getRefreshTimeMillis());
        } else {
            this._authenticate()
                .then((status) => {
                    if (status === "success") // in other cases it is considered as cancel was pressed
                        this._verifyAuthentication();
                    else this.tokenRefreshInitialized = false;
                });
        }
    }
    async _getFreshAccessToken() {
        return $.get("/getAccessToken")
            .then((rawAccessToken) => {
                if (rawAccessToken != "") {
                    return new AccessToken(rawAccessToken, 600);// todo: ttl should be recevied from the backend. For now lets leave it at 10 minutes. these are seconds
                }
                return this.accessToken;
            })
    }
    _getRefreshTimeMillis() {
        if (!this.accessToken) return 0;
        let timeLeftOnToken = this.accessToken.getTimeLeftInMiliseconds() / 2; //we divide to try to refresh half way through token expiry
        return timeLeftOnToken < 5000 ? 5000 : timeLeftOnToken; // if it happens that expiry has gotten below 5 seconds we are in trouble. Probably the backend doesnt work. To not refresh too often we try to refresh every 5 seconds.
    }



    async _authenticate(prompt) {
        if (!prompt) {
            return this._tryHiddenAuthentication()
                .catch(() => {
                    return this._startAuthenticationProcess()
                })
        } else {
            return this._startAuthenticationProcess(prompt)
        }
    }

    async _startAuthenticationProcess(prompt) {
        prompt = prompt | "false";
        return miro.board.ui.openModal(document.location.protocol + '//' + document.location.host + '/oauth2/login?prompt=' + prompt, { width: 740, height: 600 })
    }


    _tryHiddenAuthentication() { // todo: add monitoring how often this actually successes or fails
        $("#authenticationFrame")[0].src = "/oauth2/authorization/atlassian?none"
        let _parent = window;
        return new Promise(function (resolve, reject) {
            _parent.authenticationSuccess = function () {
                resolve();
            }
            _parent.authenticationFailure = function () {
                reject();
            }
            setTimeout(function () {
                _parent.authenticationSuccess = null;
                _parent.authenticationFailure = null;
                reject();
            }, 5000);
        });
    }
}