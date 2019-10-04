async function getTransitionBoxes() {
	let shapeWidgets =  await miro.board.widgets.get({type:"SHAPE"})
	let transitionBoxes = [];
	let i=0;
	shapeWidgets.forEach((widget) => {

		let textz = widget.plainText;

		if (typeof textz === "string") {
			if (textz.startsWith("transition:")) {
				let transitionName = textz.substring(11);
				let transitionWidget = {
					widget: widget,
					transitionName: transitionName,
				};
				transitionBoxes[i++] = transitionWidget
			}
		}
    })
    return transitionBoxes;
}


async function setAsTransitionBox(transitionName, transitionId){
	miro.board.selection.get().then((widgets)=>{
		// todo: add check if is only one
		widgets.forEach(widget =>{
			let updateObj = {};
			updateObj.id = widget.id;
			updateObj.metadata = {};
			updateObj.metadata[miroClientId] = {};
			updateObj.metadata[miroClientId].transition = {}
			updateObj.metadata[miroClientId].transition.name = transitionName;
			updateObj.metadata[miroClientId].transition.id = transitionId;

			miro.board.widgets.update(updateObj)
		})

		}
	)

}
async function getTransitionBoxes() {
	return  miro.board.widgets.get('metadata.' + miroClientId + '.transition')
}
