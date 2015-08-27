var initDimension = 100;
var miniNoteCount = 0;
var miniNotes = [];
var NOTE_CONTENT = {
	TITLE: 0, 
	TEXT: 1,
	BORDER_COLOR: 2
};

$('#note-btn').click(function() {
	makeNote();
});

$(document).on('click', '.note', function() {
	console.log("note");
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
        console.log(max + 1);
    });
});

// delete note clicked delete on
$(document).on('click', '.note aside', function() {
    $(this).parent().remove();
});

// minimize note
$(document).on('click', '.note .border button', function() {
    var thisNote = $(this).closest('.note');
    var noteInfo = [];
    noteInfo[NOTE_CONTENT.TITLE] = thisNote.find('input').val();
    noteInfo[NOTE_CONTENT.TEXT] = thisNote.find('textarea').val();
    noteInfo[NOTE_CONTENT.BORDER_COLOR] = thisNote.find('.border-body').css('background-color');
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

$(document).on('click', '.note-container .mini-note', function() {
	var index = $(this).index();
	var thisMiniNote = miniNotes[index];
	var title = thisMiniNote[NOTE_CONTENT.TITLE];
	var text = thisMiniNote[NOTE_CONTENT.TEXT];

	var expandedNote = makeNote($(this).css('background-color'), thisMiniNote[NOTE_CONTENT.BORDER_COLOR]);
	expandedNote.find('input').val(title);
	expandedNote.find('textarea').text(text);

	miniNotes.splice(index, 1);
	miniNoteCount--;
	$(this).remove();
	$('.mini-note').animate({
		height: $('.note-container').height() / miniNoteCount
	});
	if (!miniNoteCount)
		$('#note-title').text("");
});

// show title of mini-note on hover
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

function makeNote(color, borderColor) {
	color = typeof color !== 'undefined' ? color : randomColor();
	borderColor = typeof borderColor !== 'undefined' ? borderColor : randomColor();
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
         'z-index': 1,
         'background-color': color
    });
   	newNote.find('.border-body').css('background-color', borderColor);
   	newNote.find('button').css('background-color', borderColor);
    $( ".draggable" ).draggable();
    $( ".resizable" ).resizable();
    return newNote;
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