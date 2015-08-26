var initDimension = 100;
var noteCount = 0;
var notes = [];

$('#note-btn').click(function() {
	makeNote();
});

// delete note clicked delete on
$(document).on('click', '.note aside', function() {
    $(this).parent().remove();
});

function makeNote() {
    var posx = randomX();
    var posy = randomY();
    var newNote = $("<div class='note draggable resizable ui-widget-content' style='border:none;background:none;'> \
    	<div class='border'><button>-</button><div class='border-body'></div></div> \
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
    noteCount++;
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