(function($) {
    "use strict";

    $.fn.msac = function() {
        return this.each(msac);
    };

    $.fn.msac.version = '0.1.0';

    function msac() {
        /*jshint validthis: true */
        // Or jshint complains about "this" being used in a function.
        // @see https://github.com/jshint/jshint/issues/621
        var $s = $(this),
            options = [],
            currIdx = 0,
            suggNb,
            keyBindings,
            $input,
            $suggestions,
            $sugg,
            $selection;

        // Hide the original select
        $s.hide();

        // Get all the options
        $('option', $s).each(function() {
            options.push(this.text);
        });

        // Place all the elements for the auto completion
        placeElements();

        // Listen for every key press
        $input.on('keyup', function() {
            var idxs;

            // Remove the children on each iteration
            $suggestions.children().remove();

            idxs = findInOptions(this.value);
            if (idxs) {
                addSuggestions(idxs);
            }
        });

        /**
         * Creates the suggestions and adds them to the list
         */
        function addSuggestions(idxs) {
            suggNb = idxs.length;
            $.each(idxs, function(i) {
                // Add each suggestion
                var $newSugg = $sugg.clone();
                if (i === currIdx) {
                    $newSugg.addClass('suggested');
                }

                // The data will be used when selecting the element
                $newSugg.data('idx', this.valueOf());
                $newSugg.text(options[this]).appendTo($suggestions);
            });
        }

        // Key bindings: each keyCode has its own function. Allows us to keep
        // the onkeydown callback clean.
        keyBindings = {
            13: function() {
                // Pressing enter: add the selection
                addToSelection($('.suggested', $suggestions));
                currIdx = 0;
                return false;
            },
            38: function() {
                // Up arrow
                if (currIdx > 0) {
                    currIdx--;
                }
                return false;
            },
            40: function() {
                // Down arrow
                if (currIdx < (suggNb - 1)) {
                    currIdx++;
                }
                return false;
            }
        };

        // We need keydown for up/down arrows to prevent default behavior
        $input.on('keydown', function(e) {
            return keyBindings[e.keyCode] ? keyBindings[e.keyCode]() : true;
        });

        $suggestions.on('mouseover',  'div', function() {
            $('.suggested').removeClass('suggested');
            $(this).addClass('suggested');
        });

        $suggestions.on('click', 'div', function() {
            addToSelection($(this));
        });

        /**
         * Places the elements necessary for the auto completion
         * to work.
         */
        function placeElements() {
            var $wrapper = $('<div></div>', {
                'class': 'msac-wrapper'
            });

            // Create elements for the variables in closure
            $input = $('<input />', {
                type: 'text'
            });
            $suggestions = $('<div></div>', {
                'class': 'suggestions'
            });
            $sugg = $suggestions.clone();
            $selection = $sugg.clone();

            // Input for the text search
            $input.appendTo($wrapper);

            // Div for the suggestions
            $suggestions.appendTo($wrapper);

            // and one for cloning
            $sugg[0].className = 'suggestion';

            // Div for selection
            $selection[0].className = 'selection';
            $selection.appendTo($wrapper);

            // And insert the wrapper after the hidden select
            $wrapper.insertAfter($s);
        }

        /**
         * Empties the input, adds the element to selected,
         * remove the item from the array of options, and
         * empty the list of suggestions.
         *
         * This function does way too much. But I'm too lazy to refactor it.
         */
        function addToSelection($el) {
            var idx = $el.data('idx');
            $input[0].value = '';
            currIdx = 0;
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
            else {
                currIdx = 0;
            }

            // "if ([])" passes... we don't want that
            return idxs.length ? idxs : null;
        }
    }
}(jQuery));
