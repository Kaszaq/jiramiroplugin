
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
		for (const cardMeta of cards) {
			let card = (await miro.board.widgets.get({id:cardMeta.id}))[0];  // todo: are bounds really required? maybe then this would not be needed
			transitionBoxes.forEach((transitionBox) => {
				if (
					((card.bounds.left >= transitionBox.bounds.left) && (card.bounds.left<= transitionBox.bounds.right)) &&
					((card.bounds.top >= transitionBox.bounds.top) && (card.bounds.top<= transitionBox.bounds.bottom))
				) {
					transitionCard(card, transitionBox.metadata[miro.getClientId()].transitions);
				}
			})
		}
	}
}