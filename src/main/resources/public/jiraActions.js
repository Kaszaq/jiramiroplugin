async function transitionCard(card, transitionName){

    let title =jQuery( card.title).text();
	
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
