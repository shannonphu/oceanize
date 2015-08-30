var mobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
	mobile = true;

// The amount of clouds we want to make:
var cloudCount = mobile ? 20 : 15;

var cloud = new Raster('/images/cloud.png');
cloud.scale(0.25);

var cloudSymbol = new Symbol(cloud);

for (var i = 0; i < cloudCount; i++) {
	// The center position is a random point in the view:
	var center = Point.random() * view.size;
	if(!mobile) {
		if (center.y < 50)
			center.y = 50;
		else if (center.y > ($('#day-content').height() - 50))
			center.y = $('#day-content').height() - 75;
	}
	var placedSymbol = cloudSymbol.place(center);
	placedSymbol.scale(mobile ? 0.5 : i / cloudCount);
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
	if(!mobile) {
		 // Run through the active layer's children list and change
		 // the position of the placed symbols:
		for (var i = 0; i < cloudCount; i++) {
			var item = project.activeLayer.children[i];
			moveLayerRight(item);
		}
	}
}

function moveLayerRight(item) {
	if(!mobile) {
		// Move the item 1/20th of its width to the right. This way
		// larger circles move faster than smaller circles:
		item.position.x += item.bounds.width / 100;

		// If the item has left the view on the right, move it back
		// to the left:
		if (item.bounds.left > view.size.width) {
			item.position.x = -30;
		}
	}
}


