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

        // Create the input
        var $input = $('<input />', {
            type: 'text'
        });
        $input.insertAfter($s);

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
                // Pressing enter: add the selection
                addToSelection($('.suggested', $suggestions));
                return false;
            }

            // Remove the children on each iteration
            $suggestions.children().remove();

            var idxs = findInOptions(this.value);
            if (idxs) {
                $.each(idxs, function(i) {
                    // Add each suggestion
                    var $newSugg = $sugg.clone();
                    if (i === 0) {
                        $newSugg.addClass('suggested');
                    }

                    // The data will be used when selecting the element
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

        /**
         * Empties the input, adds the element to selected,
         * remove the item from the array of options, and
         * empty the list of suggestions.
         */
        function addToSelection($el) {
            $input.val('');
            var idx = $el.data('idx');
            options.splice(idx, 1);
            $el[0].className = 'selected';
            $selection.append($el);
            $s[0].options[idx].selected = true;
            $suggestions.children().remove();
        }

        /**
         * Find the indexes where the text matches.
         */
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
