(function($) {
    "use strict";

    $.fn.msac = function() {
        return this.each(msac);
    };

    function msac() {
        var $s = $(this);
        $s.hide();

        // Get all the options
        var options = [];
        $('option', s).each(function() {
            options.push(this.text);
        });

        var $input = $('<input />', {
            type: 'text'
        });
        $input.appendTo('body');

        // Div for the suggestions
        var $suggestions = $('<div></div>', {
            'class': 'suggestions'
        });
        $suggestions.insertAfter($input);

        // and one for cloning
        var $sugg = $suggestions.clone();
        $sugg[0].className = 'suggestion';

        // Div for selection
        var $selection = $sugg.clone();
        $selection[0].className = 'selection';
        $selection.insertAfter($suggestions);

        $input.on('keyup', function(e) {
            if (e.keyCode === 13) {
                // Pressing enter: reset the value and add the selection
                addToSelection($('.suggested', $suggestions));
                return false;
            }
            $suggestions.children().remove();
            var idxs = findInOptions(this.value);
            if (idxs) {
                $.each(idxs, function(i) {
                    var $newSugg = $sugg.clone();
                    if (i === 0) {
                        $newSugg.addClass('suggested');
                    }
                    $newSugg.data('idx', this.valueOf());
                    $newSugg.text(options[this]).appendTo($suggestions);
                });
            }
        });

        $suggestions.on('mouseover',  'div', function() {
            $('.suggested').removeClass('suggested');
            $(this).addClass('suggested');
        });

        $suggestions.on('click', 'div', function() {
            addToSelection($(this));
        });

        function addToSelection($el) {
            $input.val('');
            var idx = $el.data('idx');
            options.splice(idx, 1);
            $el[0].className = 'selected';
            $selection.append($el);
            $s[0].options[idx].selected = true;
            $suggestions.children().remove();
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
    }
}(jQuery));
