function handleSelectTransitionBoxEvents(event) {
    let e=event.data;
    if(e.type == 'select_transition_box') {
        miro.board.selection.enterSelectWidgetsMode().then(widgets => {
            widgets.selectedWidgets.forEach(widget => {
                setWidgetAsTransitionBox(widget, e.data.jiraCloudId, e.data.projectKey, e.data.transitionName, e.data.transitionId, e.data.statusName);
            })
        });
    }

}

let authorizer = new MiroAuthorizer(["boards:write", "boards:read"]);
async function onClick() {
    if (await authorizer.authorized()) {
        miro.board.ui.openLeftSidebar(document.location.protocol +'//' + document.location.host+ '/config');
    }
}

function enforceInstallationWhenOpeningBoard() {
    authorizer.authorized();
}

miro.onReady(() => {
    enforceInstallationWhenOpeningBoard();
    miro.addListener('DATA_BROADCASTED', handleSelectTransitionBoxEvents);

    miro.initialize({
        extensionPoints: {
            toolbar: {
                title: 'Jira transitions',
                toolbarSvgIcon: '<path d="M7.78125 19C7.78125 19.5523 7.33353 20 6.78125 20H2.21875C1.66647 20 1.21875 19.5523 1.21875 19V6C1.21875 5.44772 1.66647 5 2.21875 5H6.78125C7.33353 5 7.78125 5.44772 7.78125 6V19Z" fill="currentColor"/>' +
                    '<path d="M22.781 19C22.781 19.5523 22.3333 20 21.781 20H17.2185C16.6662 20 16.2185 19.5523 16.2185 19V6C16.2185 5.44772 16.6662 5 17.2185 5H21.781C22.3333 5 22.781 5.44772 22.781 6V19Z" fill="currentColor"/>\n' +
                    '<path d="M9 11.0682C9.55228 11.0682 12.1716 11.0682 12.1716 11.0682L10.5858 9.59064C10.1953 9.22676 10.1953 8.63679 10.5858 8.27291C10.9763 7.90903 11.6095 7.90903 12 8.27291L16 12L12 15.7271C11.6095 16.091 10.9763 16.091 10.5858 15.7271C10.1953 15.3632 10.1953 14.7732 10.5858 14.4094L12.1716 12.9318C12.1716 12.9318 9.55228 12.9318 9 12.9318C8.44772 12.9318 8 12.5146 8 12C8 11.4854 8.44772 11.0682 9 11.0682Z" fill="currentColor"/>',

                librarySvgIcon: '<path d="M31 40C31 40.5523 30.5523 41 30 41H18C17.4477 41 17 40.5523 17 40V10C17 9.44772 17.4477 9 18 9H30C30.5523 9 31 9.44772 31 10V40Z" fill="#2D9CDB"/>' +
                    '<path d="M15 40C15 40.5523 14.5523 41 14 41H2C1.44772 41 1 40.5523 1 40V10C1 9.44772 1.44772 9 2 9H14C14.5523 9 15 9.44772 15 10V40Z" fill="#F2C94C"/>' +
                    '<path d="M47 40C47 40.5523 46.5523 41 46 41H34C33.4477 41 33 40.5523 33 40V10C33 9.44772 33.4477 9 34 9H46C46.5523 9 47 9.44772 47 10V40Z" fill="#EB5757"/>' +
                    '<path d="M16 22.1365C17.1046 22.1365 28.3431 22.1365 28.3431 22.1365L25.1716 19.1813C24.3905 18.4535 24.3905 17.2736 25.1716 16.5458C25.9526 15.8181 27.219 15.8181 28 16.5458L36 24L28 31.4542C27.219 32.1819 25.9526 32.1819 25.1716 31.4542C24.3905 30.7264 24.3905 29.5465 25.1716 28.8187L28.3431 25.8635C28.3431 25.8635 17.1046 25.8635 16 25.8635C14.8954 25.8635 14 25.0292 14 24C14 22.9708 14.8954 22.1365 16 22.1365Z" fill="#050038"/>',
                onClick: onClick
            }
        }
    });
    //https://api.atlassian.com/ex/jira/{cloudid}/



});


