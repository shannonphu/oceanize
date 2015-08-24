// Connect to the Node.js Server
io = io.connect();

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
	if ($('#message input').val().length === 0) {
		$('#message').shake();
		return;
	};
	io.emit('process message', $('#message input').val());
	$('#message input').val('');
}

$('body').on("click", ".msg-btn", function() {
	post();
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        post();
    }
});

io.on('post-message', function (message, user) {
	$('#message').append('<p>' + user + ": " + message + '</p>');
});


// set name for client
function submitName() {
    var name = $('.header input').val();
    if (name === "") {
        $('.header input').shake();
        return;
    }
    $('.header input').val('');
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
