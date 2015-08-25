// Set up canvas size and sky height
var canvasProportion = 0.7;
$('#day-content').height($(window).height() * canvasProportion);
$('#night-content').height($(window).height() * canvasProportion);

function setView () {
	if (dayTime) {
		$('.header img').attr("src", "//www.4blackberry.net/data/programs/images/182363_18296.png");

		$('#night-content').slideUp('slow');
		$('#day-content').fadeIn();

		$('body').removeClass('night');
		$('body').addClass('day');

	} else {

		$('.header img').attr("src", "//www.cliparthut.com/clip-arts/183/sun-clip-art-183444.png");

		$('#day-content').hide();
		$('#night-content').slideDown();

		$('body').removeClass('day');
		$('body').addClass('night');
	}
};

// Default to nighttime view
var dayTime = true;
setView();

// bottle setup
$('<img id="bottle" src="//cliparts.co/cliparts/6ir/6xX/6ir6xXqbT.png">').insertAfter($('#ocean'));
var bottle = $('#bottle');
bottle.css('left', $(window).width() / 6 * 5);
bottle.addClass('rotate');

// chat room initial default
$('.chatroom-details').css('top', $(window).height() - $('.chatroom-details').height());
var message = "Chat:";
var tabOpen = true;

// Set up wave water
var opacity = 0.3;
var waveColor = 'rgba(153, 204, 255,' + opacity + ')';

var values = {
	friction: 0.8,
	timeStep: 0.01,
	amount: 15,
	mass: 2,
	count: 0
};
values.invMass = 1 / values.mass;

var path, springs;
var size = view.size * [1.2, 1];

var Spring = function(a, b, strength, restLength) {
	this.a = a;
	this.b = b;
	this.restLength = restLength || 80;
	this.strength = strength ? strength : 0.55;
	this.mamb = values.invMass * values.invMass;
};

Spring.prototype.update = function() {
	var delta = this.b - this.a;
	var dist = delta.length;
	var normDistStrength = (dist - this.restLength) /
			(dist * this.mamb) * this.strength;
	delta.y *= normDistStrength * values.invMass * 0.2;
	if (!this.a.fixed)
		this.a.y += delta.y;
	if (!this.b.fixed)
		this.b.y -= delta.y;
};


function createPath(strength) {
	var path = new Path({
		fillColor: waveColor
	});
	path.fullySelected = true;

	springs = [];
	for (var i = 0; i <= values.amount; i++) {
		var segment = path.add(new Point(i / values.amount, 0.5) * size);
		var point = segment.point;
		if (i == 0 || i == values.amount)
			point.y += size.height;
		point.px = point.x;
		point.py = point.y;
		// The first two and last two points are fixed:
		point.fixed = i < 2 || i > values.amount - 2;
		if (i > 0) {
			var spring = new Spring(segment.previous.point, point, strength);
			springs.push(spring);
		}
	}
	path.position.x -= size.width / 4;

	return path;
}

function onResize() {
	if (path) return;
	size = view.bounds.size * [2, 1];
	path = createPath(0.1);
}

var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

$(window).resize(function () {
    waitForFinalEvent(function(){
      $('#night-content').width($(window).width());
      $('#day-content').width($(window).width());
      var bottleMaxLeft = $(window).width() - $('.chat').outerWidth() / 2 - bottle.width() / 2;
      if (bottleMaxLeft > $(window).width() - 100)
      	bottleMaxLeft = $(window).width() - 100;
      bottle.css('left', bottleMaxLeft);
      $('.chat #message').height($(window).height() * 0.6);
      $('.chat').height($(window).height() * 0.7);
      $('#bottle').css('bottom', ($(window).height() - $('.header').height()) / 2);
      $('.chat').css('margin-left', $(window).width() - $('.chat').outerWidth() - 10);
      $('.chatroom-details').css('top', $(window).height() - $('.chatroom-tab').height() - 25);
    }, 500, "some unique string");
});

function onMouseMove(event) {
	var location = path.getNearestLocation(event.point);
	var segment = location.segment;
	var point = segment.point;

	if (!point.fixed) {
		var y = event.point.y;

		if (y < 0)
			y = 0;
		else if(y > 100)
			y = 100;

		point.y += (y - point.y) / 6;
		if (segment.previous && !segment.previous.fixed) {
			var previous = segment.previous.point;
			previous.y += (y - previous.y) / 24;
		}
		if (segment.next && !segment.next.fixed) {
			var next = segment.next.point;
			next.y += (y - next.y) / 24;
		}
	}
}

function onFrame(event) {
	// deal with wave
	updateWave(path);
}

function updateWave(path) {
	var force = 1 - values.friction * values.timeStep * values.timeStep;
	for (var i = 0, l = path.segments.length; i < l; i++) {
		var point = path.segments[i].point;
		var dy = (point.y - point.py) * force;
		point.py = point.y;
		point.y = Math.max(point.y + dy, 0);
	}

	for (var j = 0, l = springs.length; j < l; j++) {
		springs[j].update();
	}
	path.smooth();
}

// End wave setup

// Change wave opacity as scroll down (currently not used)
$(document).scroll(function() {
    var pxFromTop = $(document).scrollTop();
    opacity = pxFromTop / $(document).height() + 0.3;
    path.fillColor = 'rgba(153, 204, 255,' + opacity + ')';
});



// swap content views when click top-left corner button

$('.header img').click(function() {
	dayTime = !dayTime;
	// if its daytime, make it nighttime
	setView();
});

// bottle and chat view manipulation

function animateChatroomDetails() {
	// if chatroom tab is open, slide it down else slide up
	if (tabOpen) {
		$('.chatroom-details').animate({
			top: $(window).height() - $('.chatroom-tab').height() - 25
		}, 'slow');
	} else {
		$('.chatroom-details').animate({
			top: $(window).height() - $('.chatroom-details').height()
		}, 'slow');
	}
	tabOpen = !tabOpen;
}

// deal with clicking of objects

bottle.click(function() {
	// deal with chatroom details
	tabOpen = true;
	animateChatroomDetails();

	// deal w/ bottle
	bottle.removeClass('rotate');
	bottle.addClass('no-rotate').stop();
	if ($('.chat').length === 0) {
		$('<div class="chat"> \
			<span>x</span> \
				<div id="message"> \
					<h6>' + message + '</h6> \
				</div> \
				<div class="form"> \
					<input></input> \
					<button class="msg-btn">></button> \
				</div> \
			</div>').insertAfter($('.header')).hide();
		$('.chat').height($(window).height() * 0.6);
		$('.chat').css('margin-left', $(window).width() - $('.chat').outerWidth() - 10);
		bottle.css('left', $(window).width() - $('.chat').outerWidth() / 2 - bottle.width() / 2);
	}
	bottle.animate({
		bottom:($(window).height() - $('.header').height()) / 2
	}, 'slow'); 
	$('.chat').slideDown();
	if (dayTime)
		$('#message').addClass('day-message');
	else
		$('#message').addClass('night-message');
});

$(document).mousedown(function (e)
{
    if ($('.chat span').is(e.target) || !$('.chat').is(e.target) // if the target of the click isn't the container...
        && $('.chat').has(e.target).length === 0 // ... nor a descendant of the container
        && !$('.header img').is(e.target) // ...and isnt the change time icon 
        && !$('#note-btn').is(e.target) // ...anddd isnt the + note button
        && !$('.note').is(e.target) // ...andddd isnt a note on the board
        && !$('textarea').is(e.target)  // or its textarea 
        && !$('.ui-resizable-handle').is(e.target) )
    {
        $('.chat').slideUp();
        bottle.animate({
        	bottom:'-15px'
        }, 'slow'); 
        bottle.removeClass('no-rotate');
        bottle.addClass('rotate');
    }
    if ($('.chatroom-tab').is(e.target)) {
    	animateChatroomDetails();	
    }    
    // if not deleting, bring to front
    else if ($('.note').is(e.target)) {
		// increase z-index to bring note to top when clicked
	    var boxes = $(".note");

	    // Set up click handlers for each box
	    boxes.click(function() {
	        var el = $(this), // The box that was clicked
	            max = 0;

	        // Find the highest z-index
	        boxes.each(function() {
	            // Find the current z-index value
	            var z = parseInt( $( this ).css( "z-index" ), 10 );
	            // Keep either the current max, or the current z-index, whichever is higher
	            max = Math.max( max, z );
	        });

	        // Set the box that was clicked to the highest z-index plus one
	        el.css("z-index", max + 1 );
	    });
    }

});

