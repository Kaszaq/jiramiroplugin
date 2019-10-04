// this function will no longer be required once miro exposes jira cards ids
function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

async function determineCardKey(card) {
    let cardCustomFieldValues = card.card.customFields.map((el) => el.value);
    let config = await getSharedConfiguration();

    for (let i = 0; i < cardCustomFieldValues.length; i++) {
        let val = cardCustomFieldValues[i];
        for (let j = 0; j < config.projectIds.length; j++) {
            let projectId = config.projectIds[j];
            if (val.startsWith(projectId + "-")) {
                return val;
            }

        }

    }
}

async function transitionCard(card, transitionName, transitionId) {
    let key = await determineCardKey(card);
    // check here if should Transition, whether the status has actually changed.

    miro.showNotification("Transitioning " + key + " to " + transitionName);

    let data = JSON.stringify({transition: {id: transitionId}});
    let posting = $.post({
        url: jiraUrl + "/rest/api/3/issue/" + key + "/transitions",
        headers: {"Authorization": "Bearer " + accessToken,
            "Accept": "application/json"},
        data : data,
        contentType : 'application/json'

    })

}

