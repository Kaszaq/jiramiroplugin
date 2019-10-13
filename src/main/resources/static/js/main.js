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

miro.onReady(() => {
    miro.addListener('DATA_BROADCASTED', handleSelectTransitionBoxEvents);

    miro.initialize({
        extensionPoints: {
            // bottomBar: {
            //     title: 'Add transitions',
            //     svgIcon: '<circle cx="12" cy="12" r="9" fill="purple" />  <g transform=" matrix(0.866, -0.5, 0.25, 0.433, 12, 12)">    <path d="M 0,10.5 A 9.75,10.5 0 0,0 9.75,0 5,5 0 0,1 14.2,0 11.2,10.5 0 0,1 0,10.5Z" fill="yellow">      <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="1s" repeatCount="indefinite" />    </path>  </g>  <path fill="purple" d="M 9,0 A 7.5,7.5 0 0,0 -9,0Z" transform="matrix(0.866, -0.5, 0.5, 0.866, 12, 12)" />',
            //
            //     onClick: function () {
            //         miro.board.ui.openLeftSidebar(configUrl)
            //     }
            // },
            toolbar: {
                title: 'Add JIRA transitions',
                toolbarSvgIcon: '<circle cx="12" cy="12" r="9" fill="purple" />  <g transform=" matrix(0.866, -0.5, 0.25, 0.433, 12, 12)">    <path d="M 0,10.5 A 9.75,10.5 0 0,0 9.75,0 5,5 0 0,1 14.2,0 11.2,10.5 0 0,1 0,10.5Z" fill="yellow">      <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="1s" repeatCount="indefinite" />    </path>  </g>  <path fill="purple" d="M 9,0 A 7.5,7.5 0 0,0 -9,0Z" transform="matrix(0.866, -0.5, 0.5, 0.866, 12, 12)" />',

                librarySvgIcon: '<circle cx="12" cy="12" r="9" fill="purple" />  <g transform=" matrix(0.866, -0.5, 0.25, 0.433, 12, 12)">    <path d="M 0,10.5 A 9.75,10.5 0 0,0 9.75,0 5,5 0 0,1 14.2,0 11.2,10.5 0 0,1 0,10.5Z" fill="yellow">      <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="1s" repeatCount="indefinite" />    </path>  </g>  <path fill="purple" d="M 9,0 A 7.5,7.5 0 0,0 -9,0Z" transform="matrix(0.866, -0.5, 0.5, 0.866, 12, 12)" />',

                onClick: function () {
                    miro.board.ui.openLeftSidebar(configUrl)
                }
            }
        }
    });
    //https://api.atlassian.com/ex/jira/{cloudid}/



});


