async function setAsTransitionBox(transitionName, transitionId){
	miro.board.selection.get().then((widgets)=>{
		// todo: add check if is only one
		widgets.forEach(widget =>{
			let updateObj = {id: widget.id, metadata:{}};
			updateObj.metadata[miroClientId] = {transition:{
				id: transitionId,
				name: transitionName
				}};

			miro.board.widgets.update(updateObj)
		})
		}
	)
}
async function getTransitionBoxes() {
	return  miro.board.widgets.get('metadata.' + miroClientId + '.transition')
}
