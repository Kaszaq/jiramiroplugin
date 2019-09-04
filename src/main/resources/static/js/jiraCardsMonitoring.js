
async function jiraTransformationUpdate(e) {
	let cards = [];
	let i = 0;
	e.data.forEach((widgetMeta) => {
		if (widgetMeta.type == "CARD"){
			cards[i++] = widgetMeta;
		}
	});
	
	if (cards.length > 0){
		let transitionBoxes = await getTransitionBoxes();
		cards.forEach(async (cardMeta) => {
			let card = (await miro.board.widgets.get({id:cardMeta.id}))[0];
			transitionBoxes.forEach((transitionBox) => {
				if (
					((card.bounds.left >= transitionBox.widget.bounds.left) && (card.bounds.left<= transitionBox.widget.bounds.right)) &&
					((card.bounds.top >= transitionBox.widget.bounds.top) && (card.bounds.top<= transitionBox.widget.bounds.bottom))
				) {
					transitionCard(card, transitionBox.transitionName);
				}
			})
		})
	}
}

miro.onReady(() => {
	miro.addListener(miro.enums.event.WIDGETS_TRANSFORMATION_UPDATED, jiraTransformationUpdate);
})