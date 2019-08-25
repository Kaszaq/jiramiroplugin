let selectedWidgets = [];
let transitionBoxes = new Map();

async function onSelectionUpdated(e) {
	let previouslySelectedWidgets = (await miro.board.widgets.get({'type':"SHAPE"}));
	previouslySelectedWidgets = previouslySelectedWidgets.filter(widget => selectedWidgets.includes(widget.id));
	checkObjectsModifyJiraTransitionBoxes(previouslySelectedWidgets);
	selectedWidgets =(await miro.board.selection.get()).map(widget => widget.id);
	//updateSelection(selectedWidgets);
}

function checkObjectsModifyJiraTransitionBoxes(widgetsData) {
	console.log("called")
    widgetsData.forEach((widget) => {

		let textz = widget.plainText;
				// Check that widget has text field
		if (typeof textz === "string") {
			if (transitionBoxes.has(widget.id) && !(textz.startsWith("jira-transition-box.transition="))){
				console.log("removing "+widget.id)
				transitionBoxes.delete(widget.id);
			} else if (!transitionBoxes.has(widget.id) && textz.startsWith("jira-transition-box.transition=")) {
				console.log("adding "+widget.id)
				let transitionName = textz.substring(31);
				let transitionWidget = {
					widget: widget,
					transitionName: transitionName,
				};
				transitionBoxes.set(widget.id, transitionWidget)
			}
		}
    })
}

function isInside(x,y,widget){
	
}

async function initializeTransitionBoxes(){
	let widgets = await miro.board.widgets.get({'type':"SHAPE"});
	checkObjectsModifyJiraTransitionBoxes(widgets);
}

miro.onReady(() => {
	miro.addListener(miro.enums.event.SELECTION_UPDATED, onSelectionUpdated);
	initializeTransitionBoxes();
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Sticker to shapes',
        svgIcon: '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>',
        positionPriority: 1,
        onClick: async () => {

          // Get selected widgets
          let selectedWidgets = await miro.board.selection.get()

          // Filter stickers from selected widgets
          let stickers = selectedWidgets.filter(widget => widget.type === 'STICKER')

          // Delete selected stickers
          await miro.board.widgets.deleteById(stickers.map(sticker => sticker.id))

          // Create shapes from selected stickers
          await miro.board.widgets.create(stickers.map(sticker => ({
            type: 'shape',
            text: sticker.text,
            x: sticker.x,
            y: sticker.y,
            width: sticker.bounds.width,
            height: sticker.bounds.height,
          })));

          // Show success message
          miro.showNotification('Stickers has been converted')
        }
      }
    }
  })
})
