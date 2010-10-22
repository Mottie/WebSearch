/*
 * WebSearch - v1.1.1
 * (jQuery UI independent version)
 *
 * Copyright 2010, Rob Garrison (aka Mottie/Fudgey)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function($, undefined){
    $.websearch = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("websearch", base);
        
        base.init = function(){
            base.options = $.extend({}, $.websearch.defaultOptions, options);
            base._create();
        };

        base._create = function(){
            base.$el
                .addClass('websearch-input')
                .wrap('<div class="websearch"/>')
                .after('<button class="websearch-search ' + base.options.tooltipClass + '"><span class="icon-websearch icon-websearch-search"></span></button>' +
                       '<button class="websearch-select ' + base.options.tooltipClass + '"><span class="icon-websearch icon-websearch-select"></span></button>' +
                       '<div class="websearch-popup"></div>')
                .bind('mouseup focusout', function(){ base._popup(false); });

            base.$wrap = base.$el.closest('.websearch');
            base.$popup = base.$wrap.find('.websearch-popup').hide();
            base.$button = base.$wrap.find('button');

            // setup websearch button & position popup
            base.$button
                .bind('click', function(event){
                    if ( $(this).is('.websearch-search') ) { base._search(); return false; }
                    base._popup(true);
                    return false;
                })
                .filter(':eq(1)')
                .add(base.$popup).bind('keyup focusin', function(event){
                    if (event.type == 'focusin') { base._popup(true); } // focus on button to open popup
                    if (event.which == 27) { base._popup(false); }      // escape to close
                });

            // Build popup contents
            var i, popupContent = [];
            for (i in base.options.websearch) {
                if (base.options.websearch[i][0] !== '') {
                    // add default icon to popup button
                    if (i == base.options.defaultSite) { base._setSearchSite(i); }
                    popupContent.push('<a href="#" class="site" data-name="' + i +
                    '"><span class="icon-websearch ' + base.options.websearch[i][0] + '"></span>' + i + '</a>');
                }
            }
            if (base.options.sortList) { popupContent.sort(); }
            base.$popup
                .html(popupContent.join(' ') || 'No Search Engines Set')
                .find('.site') // links in the popup
                // select site
                .click(function(){
                    base._setSearchSite($(this).attr('data-name'));
                    base._popup(false);
                    return false;
                })
                // highlight site list
                .hover(function(){ $(this).toggleClass('highlight'); })
                // add up/down arrow to site list
                .keyup(function(event){
                    if (event.which == 40) { $(this).next().focus(); }
                    if (event.which == 38) { $(this).prev().focus(); }
                });

            // initiate search by pressing enter or clicking on search button
            base.$el.keyup(function(event){
                if (event.which !== 13) { return; }
                base._search();
            });
            base.$button
                .eq(1).addClass('last'); // last class has rounded corners

            if (base.options.hideSelector) {
                base.$button
                    .addClass('last')
                    .eq(1).hide();
            }

            // popup positioning constants
            base.popupWidth = base.$popup.width();
            base.popupHeight = base.$popup.outerHeight();
            base.buttonHeight = base.$wrap.outerHeight();

            // hide widget
            if (base.options.hidden) { base.$wrap.hide(); }
        };

        base._popup = function(show){
            if (show && base.$popup.is(':visible') || base.options.hideSelector) { return; }
            if (!show) { base.$popup.fadeOut('slow'); return; }
            var buttonLocation = base.$button.position(),
                popupPositionX = ( buttonLocation.left + base.popupWidth < $(window).width() - 50 ) ? buttonLocation.left : $(window).width() - base.popupWidth - 50, // 50 = extra padding
                popupPositionY = ( buttonLocation.top - base.popupHeight < $(window).scrollTop() ) ? buttonLocation.top + base.buttonHeight : buttonLocation.top - base.popupHeight;
            base.$popup.css({ position: 'absolute', left : popupPositionX, top: popupPositionY, width : base.popupWidth }).fadeIn('slow');
        };

          // update icons and text of selected site
        base._setSearchSite = function(name){
            if (typeof name === 'undefined' || name === '' || !base.options.websearch.hasOwnProperty(name)) { return base.$button.attr('title'); } // return current
            var site = base.options.websearch[name];
            base.$el
              .attr('data-search-string', site[1] || '')
              .next().attr('title', name ) // Add site name to title for tooltips
              .find('.icon-websearch-search').attr('class', 'icon-websearch-search ' + site[0] || ''); // update button icon
            base.$el.trigger('change', name);
            return name;
        };

        // Internal search function
        base._search = function(q, tar, opt){
            var query = escape(q || base.$el.val()),
              siteString = base.$el.attr('data-search-string').replace(/\{s\}/g, query);
            if (siteString === '' || query === '') { return; }
            if (base.options.searchResult) {
              base.options.searchResult.call(base.$el, siteString);
            } else {
              window.open(siteString, tar || base.options.windowTarget, opt || base.options.windowOptions);
            }
        };

        // get/set currently selected search site
        base.current = function(name) {
            return (typeof name === 'undefined' || name === '') ? base.$button.attr('title') : this._setSearchSite(name);
        };

        // initiate a search from external to the script
        base.search = function(query, target, options) {
            this._search(query, target, options);
        };

        base.init();
    };
    
    $.websearch.defaultOptions = {
        defaultSite   : "Google",  // Set the default search site.
        windowTarget  : '_blank',  // Choose from '_blank', '_parent', '_self', '_top' or '{framename}'
        windowOptions : '',        // Window options ("menubar=1,resizable=1,width=350,height=250", etc)
        tooltipClass  : 'tooltip', // class added to the button, in case tooltips are to be used (site name and above message are in the button title).
        hideSelector  : false,     // if true, the site selector button will be hidden
        sortList      : true,      // if true, the site selection list will be sorted.
        hidden        : false,     // if true, the entire websearch widget will be hidden.
        searchResult  : null,      // add a search method here in case you want to open the search page in a lightbox.
        websearch     : {          // add/replace/remove site searches; see the webSites variable above for examples.
          // 'Site Name'  : ['css-class',          'search string{s}' ]
          'Google'        : ['ui-icon-google',     'http://www.google.com/search?q={s}']
        }
    };
    
    $.fn.websearch = function(options){
        return this.each(function(){
             // prevent multiple instances
             if (!$(this).is('.websearch-input')) { (new $.websearch(this, options)); }
        });
    };
    
    // This function breaks the chain, but returns
    // the websearch if it has been attached to the object.
    $.fn.getwebsearch = function(){
        this.data("websearch");
    };
    
})(jQuery);
