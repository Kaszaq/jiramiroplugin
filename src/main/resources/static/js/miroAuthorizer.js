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
    }

    async isAuthorized() {
        if (!this.authz) {
            this.authz = contains(await miro.currentUser.getScopes(), this.requiredScope);
        }
        return this.authz;
    }

    // these two methods should be named differently to not confuse
    async authorized(authorize) {
        let isAuthz = await this.isAuthorized();
        if (!isAuthz && authorize) {
            return this.promptForAuthentication();
        }
        return isAuthz;
    }

    async promptForAuthentication() {
        return miro.requestAuthorization().then(() => true).catch(() => false);
    }
}