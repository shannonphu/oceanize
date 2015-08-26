var initDimension = 100;
var miniNoteCount = 0;
var miniNotes = [];
var NOTE_CONTENT = {
	TITLE: 0, 
	TEXT: 1
};

$('#note-btn').click(function() {
	makeNote();
});

// delete note clicked delete on
$(document).on('click', '.note aside', function() {
    $(this).parent().remove();
});

$(document).on('click', '.note .border button', function() {
    var thisNote = $(this).closest('.note');
    var noteInfo = [];
    noteInfo[NOTE_CONTENT.TITLE] = thisNote.find('input').val();
    noteInfo[NOTE_CONTENT.TEXT] = thisNote.find('textarea').val();
    if (noteInfo[NOTE_CONTENT.TITLE] === "" && noteInfo[NOTE_CONTENT.TEXT] === "") {
    	thisNote.effect("shake");
    	return;
    }
    // store contents in array
    miniNotes.push(noteInfo);
    miniNoteCount++;

    // set up .mini-note UI animation and remove large note
    var overallColor = thisNote.css('background-color');
    var miniNote = $('<div class="mini-note"></div>').css( 'background-color', overallColor );
    $('.note-container').append(miniNote);
    $('.mini-note').animate({
    	height: $('.note-container').height() / miniNoteCount
    });
    thisNote.remove();
});

$(document).on("mouseenter", ".mini-note", function() {
    var selectedNote = miniNotes[$(this).index()];
    var text = selectedNote[NOTE_CONTENT.TITLE];
    if (text === "")
    	text = selectedNote[NOTE_CONTENT.TEXT];
    if (text.length > 10)
    	text = text.substring(0,10) + "...";
    $('#note-title').text(text);
}).on("mouseleave", ".mini-note", function(event){
    $('#note-title').text("");
});

function makeNote() {
    var posx = randomX();
    var posy = randomY();
    var newNote = $("<div class='note draggable resizable ui-widget-content' style='border:none;background:none;'> \
    	<div class='border'><button>—</button><div class='border-body'></div></div> \
    	<input type='text' placeholder='Title'></input> \
    	<aside>Delete</aside> \
    	<textarea></textarea> \
    	</div>")
    .css('position', 'absolute')
    .appendTo('.header')
   	.css({
        'left': posx + 'px',
         'top': posy + 'px',
         'background-color': randomColor()
    });
    var borderColor = randomColor();
   	newNote.find('.border-body').css('background-color', borderColor);
   	newNote.find('button').css('background-color', borderColor);
    $( ".draggable" ).draggable();
    $( ".resizable" ).resizable();
}

function randomColor() {
	return 'rgba('
            + (Math.floor(Math.random() * 256)) + ','
            + (Math.floor(Math.random() * 256)) + ','
            + (Math.floor(Math.random() * 256)) + ','
            + '0.6)';
    // return {
    //     red: Math.random(),
    //     green: Math.random(),
    //     blue: Math.random(),
    //     alpha: 0.7
    // };
}

function randomX() {
	return Math.random() * $(window).width() * 0.5;
}

function randomY() {
	return Math.abs(Math.random() * Math.round($(window).height()) - $('#ocean').height());
}