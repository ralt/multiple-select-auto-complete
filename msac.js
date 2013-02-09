(function($) {
var s = $('#s');
s.hide();

// Get all the options
var options = [];
$('option', s).each(function() {
    options.push(this.text);
});

var input = $('<input />', {
    type: 'text'
});
input.appendTo('body');

// Div for the suggestions
var suggestions = $('<div></div>')
suggestions.appendTo('body');

// and one for cloning
var sugg = suggestions.clone();

// Div for selection
var selection = sugg.clone();
selection.append($('<h1></h1>', {
    text: 'Selection'
}));
selection.appendTo('body');

input.on('keyup', function(e) {
    if (e.keyCode === 13) {
        // Pressing enter: reset the value and add the selection
        addToSelection($('.selected', suggestions));
        return false;
    }
    suggestions.children().remove();
    var idxs = findInOptions(this.value);
    if (idxs) {
        $.each(idxs, function(i) {
            var newSugg = sugg.clone();
            if (i === 0) {
                newSugg.addClass('selected');
            }
            newSugg.data('idx', this);
            newSugg.text(options[this]).appendTo(suggestions);
        });
    }
});

suggestions.on('mouseover',  'div', function() {
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
});

suggestions.on('click', 'div', function() {
    addToSelection($(this));
});

function addToSelection(el) {
    input.value = '';
    el.removeClass('selected');
    selection.append(el);
    s[0].options[el.data('idx')].selected = true;
}

function findInOptions(text) {
    var idxs = [],
        t = text.toLowerCase();

    if (t) {
        $.each(options, function(i) {
            var opt = this.toLowerCase(),
                idx = opt.indexOf(t);

            if (~idx) {
                idxs.push(i);
            }
        });
    }

    // "if ([])" passes... we don't want that
    return idxs.length ? idxs : null;
}
}(jQuery));
