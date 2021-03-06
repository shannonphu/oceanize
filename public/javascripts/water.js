// SET UP INITIAL DEFAULTS
var dayTime = true;

var mobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	mobile = true;
	dayTime = false;
}

console.log(mobile);

// Set up canvas size and sky height
var canvasProportion = mobile ? 0.4 : 0.7;
$('#day-content').height($(window).height() * canvasProportion);
$('#night-content').height($(window).height() * canvasProportion);

// Default to day view

setView();
var message = "Chat:";
var tabOpen = true;
var bottle, overlay;

// chat room initial default

if (mobile) {
	$('.chatroom-details').removeClass('large-screen');
	$('.chatroom-details').addClass('small-5 columns');
	$('body').addClass('mobile');
	createChatDiv();
}
else {
	// open chat icon setup
	//http://cliparts.co/cliparts/6ir/6xX/6ir6xXqbT.png
	$('<img id="bottle" src="../images/boat.png">').insertAfter($('#ocean'));
	bottle = $('#bottle');
	bottle.css('left', $(window).width() / 5 * 3.5);

	$('.chatroom-details').css({
		top: $(window).height() - $('.chatroom-details').height(),
		width: $(window).width() / 4
	});
	$('.chatroom-details').addClass('large-screen');
	makeOverlay();
	pulsate();
}

function setView () {
	// set background view time
	if (dayTime) {
		$('.header img').attr("src", "/images/moon.png");

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

function pulsate(){ 
  bottle.animate({bottom:'+=15'},1400, 'swing', function(){
    bottle.animate({bottom:'-=15'},1100, 'swing', pulsate);
  });
}

// Make Overlay For Instructions
function makeOverlay() {
	$('body').prepend('<div id="overlay"></div>');
	overlay = $('#overlay');
	overlay.append('<aside id="tab">Enter your name</aside>');
	overlay.append('<aside id="ship">Click to chat</aside>');
	overlay.append('<aside id="plus">Create a <br> new note</aside>');
	overlay.append('<aside id="bar">Notes will <br> be minified <br> here</aside>');
	overlay.append('<aside id="icon">Change theme <br> between day <br> and night</aside>');
	overlay.append('<button>Got it!<aside>Click anywhere or press <br> enter to continue.</aside></button>');


	$('#ship').css({
		bottom: $(window).height() / 4,
		left: parseInt(bottle.css('left')) + parseInt(bottle.width() / 4)
	});

	$('#tab').css({
		width: $('.chatroom-details').width(),
		bottom: $('.chatroom-details').height() + 20,
		left: parseInt($('.chatroom-details').css('margin-left'))
	});

	$('#bar').css({
		top: $(window).height() / 3,
		left: 50
	});

	$('#icon').css({
		top: 60,
		left: $(window).width() / 10
	});
}


// note holder and title shower div initial default 
var noteContainer = $("<p id='note-title'></p><div class='note-container'></div>").insertAfter($('.header'));
if (mobile) {
	noteContainer.css('height', $(window).height() - $('h1').height() - $('.chatroom-details').height() - 50);
	$('#note-title').remove();
	$('.chat').outerHeight(noteContainer.height());
	$('.chat').css( 'width', parseInt($(window).width()) - parseInt($('.chat').css('margin-left')) - 25);
	$('.form').addClass('row').find('button').addClass('small-1 column');
}

// END INITIAL SET UPS


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
	if (path || mobile) return;
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
      var bottleMaxLeft = $(window).width() - $('.chat').outerWidth() / 2 - bottle.width() / 2;
      if (bottleMaxLeft > $(window).width() - $('#bottle').width())
      	bottleMaxLeft = $(window).width() - $('#bottle').width() - 50;
      bottle.css('left', bottleMaxLeft);
      if ($('#overlay').is(':visible')) {
      	$('#ship').css({
      		bottom: $(window).height() / 4,
      		left: parseInt(bottle.css('left')) + parseInt(bottle.width() / 4)
      	});
      }
      $('.chat #message').height($(window).height() * 0.6);
      $('.chat').height($(window).height() * 0.68);
      if ($('.chat').is(':visible')) {
      	$('#bottle').css('bottom', ($(window).height() - $('.header').height()) / 2 - $('#bottle').height() / 4);
      }
      $('.chat').css('margin-left', $(window).width() - $('.chat').outerWidth());
      $('.chatroom-details').css('top', $(window).height() - $('.chatroom-tab').height() - 25);
    }, 500, "some unique string");

});

function onMouseMove(event) {
	if (!mobile) {
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
}

function onFrame(event) {
	if (!mobile) {
		// deal with wave
		updateWave(path);
	}
}

function updateWave(path) {
	if (!mobile) {
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
}

// End wave setup

// Change wave opacity as scroll down (currently not used)
$(document).scroll(function() {
	if (!mobile) {
	    var pxFromTop = $(document).scrollTop();
	    opacity = pxFromTop / $(document).height() + 0.3;
	    path.fillColor = 'rgba(153, 204, 255,' + opacity + ')';
	}
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
 if (!mobile) {
	bottle.click(function() {
		// deal with chatroom details
		tabOpen = true;
		animateChatroomDetails();

		// deal w/ bottle
		if ($('.chat').length === 0) {
			createChatDiv();
			$('.chat').hide();
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
}

function createChatDiv() {
	$('<div class="chat"> \
		<span>x</span> \
			<div id="message"> \
				<h6>' + message + '</h6> \
			</div> \
			<div class="form"> \
				<input></input> \
				<button class="msg-btn">></button> \
			</div> \
		</div>').insertAfter($('.header'));
}

$(document).mousedown(function (e)
{
	if (!mobile) {
		if ($('#overlay').is(':visible'))
			overlay.slideUp();
	    if ($('.chat span').is(e.target) || !$('.chat').is(e.target) // if the target of the click isn't the container...
	        && $('.chat').has(e.target).length === 0 // ... nor a descendant of the container
	        && !$('.header img').is(e.target) // ...and isnt the change time icon 
	        && !$('#note-btn').is(e.target) // ...anddd isnt the + note button
	        && !$('.note').is(e.target) // ...andddd isnt a note on the board
	        && !$('.note .border').children().is(e.target) // not border
	        && !$('.note').children().is(e.target)  // or the note's children elements 
	        && !$('.mini-note').is(e.target)
	        && !$('.note-container').is(e.target) ) // note container
	        // then slide the chat up
	    {
	        $('.chat').slideUp();
	        bottle.animate({
	        	bottom: 10
	        }, 'slow'); 
	    }
	    if ($('.chatroom-tab p').is(e.target)) {
	    	animateChatroomDetails();	
	    }    
	    // if not deleting, bring to front
	    else if ($('.note').is(e.target)) {
			// increase z-index to bring note to top when clicked
	        var el = $(this), // The box that was clicked
	            max = 0;

	        // Find the highest z-index
	        $('.note').each(function() {
	            // Find the current z-index value
	            var z = parseInt( $( this ).css( "z-index" ), 10 );
	            // Keep either the current max, or the current z-index, whichever is higher
	            max = Math.max( max, z );
	        });

	        // Set the box that was clicked to the highest z-index plus one
	        el.css("z-index", max + 1 );
	        console.log(max + 1);
	    }
	}
});

// $(window).bind('beforeunload', function(){
//   return 'oceanize says...';
// });

