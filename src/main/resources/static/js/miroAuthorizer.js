function contains(a1, a2) {
    let superSet = {};
    for (let i = 0; i < a1.length; i++) {
        const e = a1[i];
        superSet[e] = 1;
    }

    for (let i = 0; i < a2.length; i++) {
        const e = a2[i];
        if (!superSet[e]) {
            return false;
        }
    }
    return true;
}

class MiroAuthorizer {

    constructor(requiredScope) {
        this.requiredScope = requiredScope;
        this.authz = false;
        this.authorizeOptions = {
            response_type: 'token',
            redirect_uri: document.location.protocol +'//' + document.location.host+'/installComplete'
        };
    }

    async checkAuthorization(){
        if (!this.authz) {
            this.authz = contains(await miro.currentUser.getScopes(), this.requiredScope);
        }
        return this.authz;
    }

    isAuthorized() {
        return this.authz;
    }
    // these two methods should be named differently to not confuse
    async authorized() {
        let isAuthz = await this.checkAuthorization();
        if (!isAuthz) {
                this.promptForAuthentication();
        }

        return isAuthz;
    }

    async authorize() {
        return miro.authorize(this.authorizeOptions);
    }

    promptForAuthentication() {
        miro.board.ui.openModal(document.location.protocol +'//' + document.location.host+"/install", {width: 740, height: 600}).then(() => this.checkAuthorization());
    }
}