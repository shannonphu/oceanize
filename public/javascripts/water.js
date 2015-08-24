// Set up canvas size and sky height
var canvasProportion = 0.7;
$('#day-content').height($(window).height() * canvasProportion);
$('#night-content').height($(window).height() * canvasProportion);

// Default to nighttime view
$('#day-content').hide();
var dayTime = false;
$('body').addClass('night');

// bottle setup
$('<img id="bottle" src="//cliparts.co/cliparts/6ir/6xX/6ir6xXqbT.png">').insertAfter($('#ocean'));
var bottle = $('#bottle');
bottle.css('left', $(window).width() / 2 - $('#bottle').width() / 2);
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
		//path.remove();
	size = view.bounds.size * [2, 1];
	path = createPath(0.1);
	bottle.css('left', $(window).width() / 2 - $('#bottle').width() / 2);
}

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
	// set day time graphics
	if (dayTime) {
		$('.header img').attr("src", "//www.4blackberry.net/data/programs/images/182363_18296.png");
		$('#night-content').slideUp('slow');
		$('#day-content').fadeIn();
		$('body').removeClass('night');
		$('body').addClass('day');
		$('.header h1').css('color', 'black');
		$('.chatroom-details input').css('color', 'white');
		$('.chatroom-details').css('background-color', 'rgba(0,0,0,0.5)');
		$('#message').removeClass('night-message');
		$('#message').addClass('day-message');
	} else {
		$('.header img').attr("src", "//www.cliparthut.com/clip-arts/183/sun-clip-art-183444.png");
		$('#day-content').hide();
		$('#night-content').slideDown();
		$('body').removeClass('day');
		$('body').addClass('night');
		$('.header h1').css('color', 'white');
		$('.chatroom-details input').css('color', 'black');
		$('.chatroom-details').css('background-color', 'rgba(255,255,255,0.7)');
		$('#message').removeClass('day-message');
		$('#message').addClass('night-message');
	}
});

// bottle and chat view manipulation

bottle.click(function() {
	// deal with chatroom details
	tabOpen = true;
	animateChatroomDetails();

	// deal w/ bottle
	bottle.removeClass('rotate');
	bottle.addClass('no-rotate').stop();
	bottle.animate({
		bottom:($(window).height() - $('.header').height()) / 2
	}, 'slow'); 
	if ($('#message').length === 0) {
		$('<div id="message"><h6>' + message + '</h6><div class="form"><input></input><button class="msg-btn">></button></div></div>').insertAfter($('.header')).hide();
	}
	$('#message').slideDown();
	if (dayTime)
		$('#message').addClass('day-message');
	else
		$('#message').addClass('night-message');
});

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

$(document).mousedown(function (e)
{
    if (!$('#message').is(e.target) // if the target of the click isn't the container...
        && $('#message').has(e.target).length === 0 // ... nor a descendant of the container
        && !$('.header img').is(e.target)) // ...and isnt the change time icon 
    {
        $('#message').slideUp();
        bottle.animate({
        	bottom:'-15px'
        }, 'slow'); 
        bottle.removeClass('no-rotate');
        bottle.addClass('rotate');
    }
    if ($('.chatroom-tab').is(e.target)) {
    	animateChatroomDetails();	
    }
});

