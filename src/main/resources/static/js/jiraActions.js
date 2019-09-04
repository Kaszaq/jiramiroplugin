// this function will no longer be required once miro exposes jira cards ids
function strip(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

async function transitionCard(card, transitionName){

    let title =strip( card.title);
	
	miro.showNotification("Transitioning" + title + " to " + transitionName);
	var posting = $.post( "/transitionIssue", {
//	 projectId: ,
	 issueSummary: title,
	 transitionName: transitionName} );


      posting.done(function( data ) {
        var content = $( data ).find( "#content" );
        $( "#result" ).empty().append( content );
      });
}

