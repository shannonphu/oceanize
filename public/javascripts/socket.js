// Connect to the Node.js Server
io = io.connect();

// initial defaults
var nameSet = false;

// deal with announcement system

function post() {
    if (!nameSet) {
        appendMessage('<p>' + "Set your chatroom name first in the 'Members' tab." + '</p>');
        $('.chat').effect("shake");
        return;
    }

	if ($('.chat input').val().length === 0) {
		$('.chat').effect("shake");
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
    appendMessage('<p>' + user + ": " + message + '</p>');
});

function appendMessage(msg) {
    $('#message').append(msg);
    $('#message').animate({ scrollTop: $("#message")[0].scrollHeight}, 1000);
}

// set name for client in chat room

function submitName() {
    var name = $('.chatroom-details input').val();
    if (name === "") {
        $('.chatroom-details .form').effect("shake");
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
    appendMessage("<p>" + announcement + "</p>")
});

io.on("chatroom-update", function(people) {
    $("#chatroom-users").empty();
    $.each(people, function(clientid, name) {
        $('#chatroom-users').append('<p>' + name + '</p>');
    });
});
