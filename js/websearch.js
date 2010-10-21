/*
 * WebSearch - jQuery UI Widget v1.1
 *
 * Copyright 2010, Rob Garrison (aka Mottie/Fudgey)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 *   jquery.ui.button.js
 */
(function( $, undefined ) {

// plugin global variables
var self, o, wsWrap, wsButton, wsPopup, popupWidth, popupHeight, buttonHeight;

$.widget("ui.websearch", {

	// default options
	options: {
		defaultSite   : "Google",  // Set the default search site.
		windowTarget  : '_blank',  // Choose from '_blank', '_parent', '_self', '_top' or '{framename}'
		windowOptions : '',        // Window options ("menubar=1,resizable=1,width=350,height=250", etc)
		tooltipClass  : 'tooltip', // class added to the button, in case tooltips are to be used (site name and above message are in the button title).
		sortList      : true,      // if true, the site selection list will be sorted.
		hidden        : false,     // if true, the entire websearch widget will be hidden.
		searchResult  : null,      // add a search method here in case you want to open the search page in a lightbox.
		websearch     : {          // add/replace/remove site searches; see the webSites variable above for examples.
			// 'Site Name'  : ['css-class',          'search string{s}' ]
			'Bing'          : ['ui-icon-bing',       'http://www.bing.com/search?q={s}'],
			'Dictionary'    : ['ui-icon-dictionary', 'http://dictionary.reference.com/browse/{s}'],
			'Google'        : ['ui-icon-google',     'http://www.google.com/search?q={s}'],
			'Wikipedia'     : ['ui-icon-wikipedia',  'http://en.wikipedia.org/w/index.php?search={s}'],
			'Wolfram Alpha' : ['ui-icon-wolfram',    'http://www.wolframalpha.com/input/?i={s}'],
			'Yahoo'         : ['ui-icon-yahoo',      'http://search.yahoo.com/search?p={s}']
		}
	},

	_create: function() {
		o = this.options;
		self = this;
		this.element
			.addClass('ui-websearch-input ui-widget-content ui-corner-left')
			.wrap('<div class="ui-websearch ui-widget"/>')
			.after('<button class="ui-websearch ui-state-default ' + o.tooltipClass + '"><span class="ui-icon ui-icon-websearch"></span></button>' +
			       '<button class="ui-state-default ui-corner-right ' + o.tooltipClass + '"><span class="ui-icon ui-icon-websearch-popup ui-icon-triangle-1-s"></span></button>' +
			       '<div class="ui-websearch-popup ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div>')
			.bind('mouseup focusout', function(){ self._popup(false); });

		wsWrap = this.element.closest('.ui-widget');
		wsPopup = wsWrap.find('.ui-websearch-popup').hide();
		wsButton = wsWrap.find('button');

		// setup websearch button & position popup
		wsButton
			.button({ text: false, icons: { primary : null } })
			.removeClass('ui-corner-all ui-button')
			.bind('click', function(event){
				if ( $(this).is('.ui-websearch') ) { self._search(); return false; }
				self._popup(true);
				return false;
			})
			.filter(':eq(1)')
			.add(wsPopup).bind('keyup focusin', function(event){
				if (event.type == 'focusin') { self._popup(true); } // focus on button to open popup
				if (event.which == 27) { self._popup(false); }      // escape to close
			});

		// Build popup contents
		var i, popupContent = [];
		for (i in o.websearch) {
			if (o.websearch[i][0] !== '') {
				// add default icon to popup button
				if (i == o.defaultSite) { self._setSearchSite(i); }
				popupContent.push('<a href="#" class="site ui-state-default" data-name="' + i +
					'"><span class="ui-icon ui-icon-websearch ' + o.websearch[i][0] + '"></span>' + i + '</a>');
			}
		}
		if (o.sortList) { popupContent.sort(); }
		wsPopup
			.html(popupContent.join(' ') || 'No Search Engines Set')
			.find('.site') // links in the popup
			// select site
			.click(function(){
				self._setSearchSite($(this).attr('data-name'));
				self._popup(false);
				return false;
			})
			// highlight site list
			.hover(function(){ $(this).toggleClass('ui-state-highlight'); })
			// add up/down arrow to site list
			.keyup(function(event){
				if (event.which == 40) { $(this).next().focus(); }
				if (event.which == 38) { $(this).prev().focus(); }
			});

		// initiate search by pressing enter or clicking on search button
		this.element.keyup(function(event){
			if (event.which !== 13) { return; }
			self._search();
		});
		wsButton.find('.ui-icon-websearch').bind('click',function(){ self._search(); return false;});

		// popup positioning constants
		popupWidth = wsPopup.width();
		popupHeight = wsPopup.outerHeight();
		buttonHeight = wsWrap.outerHeight();
	
		// hide widget
		if (o.hidden) { wsWrap.hide(); }
	},

	// show (true) or hide (false) the site popup
	_popup : function(show) {
		if (show && wsPopup.is(':visible')) { return; }
		if (!show) { wsPopup.fadeOut('slow'); return; }
		var buttonLocation = wsButton.position(),
			popupPositionX = ( buttonLocation.left + popupWidth < $(window).width() - 50 ) ? buttonLocation.left : $(window).width() - popupWidth - 50, // 50 = extra padding
			popupPositionY = ( buttonLocation.top - popupHeight < $(window).scrollTop() ) ? buttonLocation.top + buttonHeight : buttonLocation.top - popupHeight;
		wsPopup.css({ left : popupPositionX, top: popupPositionY, width : popupWidth }).fadeIn('slow');
	},

	// update icons and text of selected site
	_setSearchSite : function(name){
		if (typeof name === 'undefined' || name === '' || !o.websearch.hasOwnProperty(name)) { return wsButton.attr('title'); } // return current
		var site = o.websearch[name];
		this.element
			.attr('data-search-string', site[1] || '')
			.next().attr('title', name ) // Add site name to title for tooltips
			.find('.ui-icon-websearch').attr('class', 'ui-icon ui-icon-websearch ' + site[0] || ''); // update button icon
		this.element.trigger('change', name);
		return name;
	},

	// Internal search function
	_search : function(q, tar, opt){
		var query = escape(q || this.element.val()),
			siteString = this.element.attr('data-search-string').replace(/\{s\}/g, query);
		if (siteString === '' || query === '') { return; }
		if (o.searchResult) {
			o.searchResult.call(this.element, siteString);
		} else {
			window.open(siteString, tar || o.windowTarget, opt || o.windowOptions);
		}
	},

	// get/set currently selected search site
	current: function(name) {
		return (typeof name === 'undefined' || name === '') ? wsButton.attr('title') : this._setSearchSite(name);
	},

	// initiate a search from external to the script
	search: function(query, target, options) {
		this._search(query, target, options);
	},

	destroy: function() {
		this.element
			.removeClass('ui-websearch-input ui-widget-content ui-corner-left')
			.removeAttr('data-search-string')
			.parent().find('button, .ui-websearch-popup').remove(); 
		this.element.unwrap();
		$.Widget.prototype.destroy.apply(this, arguments); // default destroy
	}

});

})( jQuery );
