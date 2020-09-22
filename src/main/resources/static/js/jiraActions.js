// this function will no longer be required once miro exposes jira cards ids

function determineCardKey(card, projectKey) {
    let cardCustomFieldValues = card.card.customFields.map((el) => el.value);
    for (let i = 0; i < cardCustomFieldValues.length; i++) {
        let val = cardCustomFieldValues[i];
        if (val.startsWith(projectKey + "-")) {
            return val;
        }
    }
}

function cardIsInStatus(card, statusName) {
    let cardCustomFieldValues = card.card.customFields.map((el) => el.value);
    for (let i = 0; i < cardCustomFieldValues.length; i++) {
        let val = cardCustomFieldValues[i];
        if (val == statusName) {
            return true;
        }
    }
    return false;
}

async function transitionCard(card, transitions) {
    let transition = transitions[0]; //TODO: currently there is a support for only one transition per object but this might change when this supports multiple cloudIds and projects

    if(!cardIsInStatus(card, transition.statusName)){
        let key = determineCardKey(card, transition.projectKey); //todo: it seems key can be null when card does not match given transition - this should be chcked before making the call to update the status
// check here if should Transition, whether the status has actually changed.
        console.log("Transitioning " + key + " to " + transition.name);
        let jiraUrl = 'https://api.atlassian.com/ex/jira/' + transition.jiraCloudId
        let data = JSON.stringify({transition: {id: transition.id}});
        let posting = $.post({
            url: jiraUrl + "/rest/api/3/issue/" + key + "/transitions",
            headers: {
                "Authorization": "Bearer " + jiraAuthorizer.accessToken.token,
                "Accept": "application/json"
            },
            data: data,
            contentType: 'application/json'
        })
//todo: handle when this fails, probably ask for additional authentications
    }

}

