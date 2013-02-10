(function($) {
    "use strict";

    $.fn.msac = function(opts) {
        // Let each closure has its own options
        var msac = new Msac(opts);
        return this.each(msac);
    };

    $.fn.msac.version = '0.1.0';

    function Msac(opts) {
        opts = $.extend({
            maxItems: 20
        }, opts);

        return msac;

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
                $selection,
                $delBtn;

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
                if (suggNb > opts.maxItems) {
                    flash('There are more than ' + opts.maxItems + ' suggestions.');
                    return;
                }
                $.each(idxs, function(i) {
                    // Add each suggestion
                    var $newSugg = $sugg.clone();
                    if (i === currIdx) {
                        $newSugg.addClass('suggested');
                    }

                    // The data will be used when selecting the element
                    $newSugg.data('idx', this);
                    $newSugg.text(options[this]).appendTo($suggestions);
                });
            }

            /**
            * Flash message
            */
            function flash(message) {
                console.log(message);
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

            // The delete button needs to have its handler
            $('.msac-wrapper').on('click', '.delete', deleteBtn);

            /**
             * Delete from selection, put back into js array, and deselect
             * from original select
             */
            function deleteBtn() {
                var $selection = $(this.parentNode),
                    idx = $selection.data('idx'),
                    text;

                // Remove the delete button before copying the text
                $(this).remove();
                text = $selection.text();

                // And do what's in the function's doc
                $selection.remove();
                options[idx] = text;
                $s[0].options[idx].selected = false;
            }

            /**
            * Places the elements necessary for the auto completion
            * to work.
            */
            function placeElements() {
                var $wrapper = $('<div></div>', { 'class': 'msac-wrapper' });

                // Create elements for the variables in closure
                $input = $('<input />', { type: 'text' });
                $suggestions = $('<div></div>', { 'class': 'suggestions' });
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

                // Creates an element but don't use it yet
                $delBtn = $('<span></span>', {
                    'class': 'delete',
                    'html': '&times;'
                });
            }

            /**
            * Empties the input, adds the element to selected,
            * remove the item from the array of options, and
            * empty the list of suggestions.
            *
            * This function does way too much. But I'm too lazy to refactor it.
            */
            function addToSelection($el) {
                var idx = $el.data('idx'),
                    $delClone;

                // Clear up the input
                $input[0].value = '';

                // Reset the index of current selected index
                currIdx = 0;

                // Remove the option from the js array
                // And yes, we definitely want a sparse array.
                delete options[idx];

                // Set the correct class
                $el[0].className = 'selected';

                // Adds the delete button
                $delClone = $delBtn.clone();
                $el.append($delClone);

                // Append the element to the selection
                $selection.append($el);

                // Set the selected property on the hidden select
                $s[0].options[idx].selected = true;

                // And remove the suggestions
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
                        // Sparse array, let's be careful
                        if (!this) {
                            return;
                        }
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
    }
}(jQuery));
