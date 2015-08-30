// SET UP INITIAL DEFAULTS
var dayTime = true;

var mobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	mobile = true;
	dayTime = false;
}

// Set up canvas size and sky height
var canvasProportion = 0.4;
$('#day-content').height($(window).height() * canvasProportion);
$('#night-content').height($(window).height() * canvasProportion);

// Default to day view

setView();
var message = "Chat:";
var tabOpen = true;
var bottle, overlay;

// chat room initial default


$('.chatroom-details').removeClass('large-screen');
$('.chatroom-details').addClass('small-5 columns');
$('body').addClass('mobile');
createChatDiv();


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


// note holder and title shower div initial default 
var noteContainer = $("<p id='note-title'></p><div class='note-container'></div>").insertAfter($('.header'));
noteContainer.css('height', $(window).height() - $('h1').height() - $('.chatroom-details').height() - 50);
$('#note-title').remove();
$('.chat').outerHeight(noteContainer.height());
$('.chat').css( 'width', parseInt($(window).width()) - parseInt($('.chat').css('margin-left')) - 25);
$('.form').addClass('row').find('button').addClass('small-1 column');


// END INITIAL SET UPS

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
      $('.chat #message').height($(window).height() * 0.6);
      $('.chat').height($(window).height() * 0.68);
      $('.chat').css('margin-left', $(window).width() - $('.chat').outerWidth());
      $('.chatroom-details').css('top', $(window).height() - $('.chatroom-tab').height() - 25);
    }, 500, "some unique string");

});



// swap content views when click top-left corner button

$('.header img').click(function() {
	dayTime = !dayTime;
	// if its daytime, make it nighttime
	setView();
});


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

