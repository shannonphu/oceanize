// The amount of stars and clouds we want to make:
var starCount = 30;

// Create a symbol, which we will use to place instances of later:
var starPath = new Path.Circle({
	center: [0, 0],
	radius: 3,
	fillColor: 'rgb(255, 255, 249)'
});

var starSymbol = new Symbol(starPath);

// Place the instances of the symbol:
for (var i = 0; i < starCount; i++) {
	// The center position is a random point in the view:
	var center = Point.random() * view.size;
	var placedSymbol = starSymbol.place(center);
	placedSymbol.scale(i / starCount);
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
	// Run through the active layer's children list and change
	// the position of the placed symbols:
	for (var i = 0; i < starCount; i++) {
		var item = project.activeLayer.children[i];
		moveLayerRight(item);
	}
}

function moveLayerRight(item) {
	// Move the item 1/20th of its width to the right. This way
	// larger circles move faster than smaller circles:
	item.position.x += item.bounds.width / 20;

	// If the item has left the view on the right, move it back
	// to the left:
	if (item.bounds.left > view.size.width) {
		item.position.x = -item.bounds.width;
	}
}