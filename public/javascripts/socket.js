// Connect to the Node.js Server
io = io.connect();

// initial defaults
var nameSet = false;

// utility shake

(function ($) {
    $.fn.shake = function (options) {
        // defaults
        var settings = {
            'shakes': 2,
            'distance': 15,
            'duration': 400
        };
        // merge options
        if (options) {
            $.extend(settings, options);
        }
        // make it so
        var pos;
        return this.each(function () {
            $this = $(this);
            // position if necessary
            pos = $this.css('position');
            if (!pos || pos === 'static') {
                $this.css('position', 'relative');
            }
            // shake it
            for (var x = 1; x <= settings.shakes; x++) {
                $this.animate({ left: settings.distance * -1 }, (settings.duration / settings.shakes) / 4)
                    .animate({ left: settings.distance }, (settings.duration / settings.shakes) / 2)
                    .animate({ left: 0 }, (settings.duration / settings.shakes) / 4);
            }
        });
    };
}(jQuery));

// deal with announcement system

function post() {
    if (!nameSet) {
        $('#message').append('<p>' + "Set your chatroom name first in the 'Members' tab." + '</p>')
        $('.chat').shake();
        return;
    }

	if ($('.chat input').val().length === 0) {
		$('.chat').shake();
		return;
	}

	io.emit('process message', $('.chat input').val());
	$('.chat input').val('');
}

$('body').on("click", ".msg-btn", function() {
	post();
});

$(document).keypress(function(e) {
    if (e.which == 13) {
        if ($('.chatroom-details input').is(':focus'))
            submitName();
        else if ($('.chat input').is(':focus'))
            post();
    }
});

io.on('post-message', function (message, user) {
	$('#message').append('<p>' + user + ": " + message + '</p>');
});



// set name for client in chat room

function submitName() {
    var name = $('.chatroom-details input').val();
    if (name === "") {
        $('.chatroom-details input').shake();
        return;
    }
    $('.chatroom-details input').val('');
    nameSet = true;
    io.emit("join", name);
}

$('body').on("click", ".name-btn", function() {
    submitName();
});

// update list of people in chat room
io.on("announcement", function(announcement) {
    $("#message").append("<p>" + announcement + "</p>");
});

io.on("chatroom-update", function(people) {
    $("#chatroom-users").empty();
    console.log(people);

    $.each(people, function(clientid, name) {
        $('#chatroom-users').append('<p>' + name + '</p>');
    });
});
