// this function will no longer be required once miro exposes jira cards ids

function determineTransitions(card, transitions) {
    for(let i = 0; i < transitions.length; i++) {
        let projectKey = transitions[i].projectKey;
        if (determineCardKey(card, projectKey)) {
            return transitions[i]; //TODO: current this will return first transition matching card
        }
    }
}

function determineCardKey(card, projectKey) {
    let cardCustomFieldValues = card.card.customFields.map((el) => el.value);
    for (let i = 0; i < cardCustomFieldValues.length; i++) {
        let val = cardCustomFieldValues[i];
        if (val.startsWith(projectKey + "-")) {
            return val;
        }
    }
    return null;
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
    let transition = determineTransitions(card, transitions);
    let key = determineCardKey(card, transition.projectKey); //todo: it seems key can be null when card does not match given transition - this should be chcked before making the call to update the status

    
    if(!cardIsInStatus(card, transition.statusName)){
        // check here if should Transition, whether the status has actually changed.
        console.log("Transitioning " + key + " to " + transition.name);
        let jiraUrl = 'https://api.atlassian.com/ex/jira/' + transition.jiraCloudId
        let data = JSON.stringify({transition: {id: transition.id}});
        let posting = $.post({
            url: jiraUrl + "/rest/api/3/issue/" + key + "/transitions",
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Accept": "application/json"
            },
            data: data,
            contentType: 'application/json'
        })
//todo: handle when this fails, probably ask for additional authentications
    }

}

