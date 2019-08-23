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
