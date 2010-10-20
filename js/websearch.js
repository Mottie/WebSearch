/*
 * WebSearch - jQuery UI Widget
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
	var o, wsWrap, wsButton, wsPopup;

 $.widget("ui.websearch", {
	// default options
	options: {

		defaultSite   : "Google",  // Set the default search site
		openNewWindow : true,      // if true, searches will open in a new window/tab
		clicktoSearch : true,      // if true, left clicking on the icon will initiate the search & right click will open the site selector
		clickMessage  : ['(left click to search, right click to switch)', '(press enter to search, click here to change)'], // messages added to the button title
		tooltipClass  : 'tooltip', // class added to the button, in case tooltips are to be used (site name and above message are in the button title)
		sortList      : true,      // if true, the site selection list will be sorted
		hidden        : false,     // if true, the entire websearch widget will be hidden
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
		var self = this,
				menuClick = (o.clicktoSearch) ? 'click contextmenu' : 'click';
		this.element
			.addClass('ui-websearch-input ui-widget-content ui-corner-left')
			.wrap('<div class="ui-websearch ui-widget"/>')
			.after('<button class="ui-state-default ui-corner-right ' + o.tooltipClass + '"><span class="ui-icon ui-icon-websearch"></span></button>' +
			       '<div class="ui-websearch-popup ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div>')
			.bind('mouseup', function(){ self._popup(false); });

		wsWrap = this.element.closest('.ui-widget');
		wsPopup = wsWrap.find('.ui-websearch-popup').hide();
		wsButton = wsWrap.find('button');

		// setup websearch button & position popup
		wsButton
			.button({ icons: { primary : null } })
			.removeClass('ui-corner-all')
			.bind(menuClick, function(event){
				if (wsPopup.is(':visible')) { wsPopup.fadeOut('slow'); return; }
				if (o.clicktoSearch && event.which == 1) { self._search(); return; }
				var popupWidth = wsPopup.width() || 400,
					popupHeight = wsPopup.height(),
					buttonHeight = self.element.outerHeight(),
					buttonLocation = wsButton.position(),
					popupPositionX = ( buttonLocation.left + popupWidth < $(window).width() - 50 ) ? buttonLocation.left : $(window).width() - popupWidth - 50,
					popupPositionY = ( buttonLocation.top - popupHeight < $(window).scrollTop() ) ? buttonLocation.top +  buttonHeight : buttonLocation.top - popupHeight;
				wsPopup.css({ left : popupPositionX, top: popupPositionY, width : popupWidth }).fadeIn('slow');
				return false;
			})
			.bind('keyup', function(event){
				if (event.which == 38 || event.which == 40) { self._popup(true); } // up/down arrow to open
				if (event.which == 27) { self._popup(false); } // escape to close
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
			.find('.site')
			.click(function(){
				self._setSearchSite($(this).attr('data-name'));
				self._popup(false);
				return false;
			})
			.hover(function(){ $(this).toggleClass('ui-state-highlight'); });

		// initiate search by pressing enter
		this.element.keyup(function(event){
			if (event.which !== 13) { return; }
			self._search();
		});

		// hide widget
		if (o.hidden) { wsWrap.hide(); }
	},

	// show (true) or hide (false) the site popup
	_popup : function(show) {
		if (!show) { wsPopup.fadeOut('slow'); return; }
		var popupWidth = wsPopup.width() || 400,
			buttonLocation = wsButton.position().left,
			popupPosition = ( buttonLocation + popupWidth < $(window).width() - 50 ) ? buttonLocation : $(window).width() - popupWidth - 50;
		wsPopup.css({ left : popupPosition, width : popupWidth }).fadeIn('slow');
	},

	// update icons and text of selected site
	_setSearchSite : function(name){
		if (typeof name === 'undefined' || name === '' || !this.options.websearch.hasOwnProperty(name)) { return; }
		var o = this.options, site = this.options.websearch[name];
		this.element
			.attr('data-search-string', site[1] || '')
			.next().attr('title', name + ': ' + ((o.clicktoSearch) ? o.clickMessage[0] : o.clickMessage[1] || '') ) // include tips
			.find('span.ui-icon').attr('class','ui-icon ui-icon-websearch ' + site[0] || ''); // update button icon
		this.element.trigger( 'change', name );
		return name;
	},

	_search : function(){
		var query = escape(this.element.val()),
			siteString = this.element.attr('data-search-string').replace(/\{s\}/g, query);
		if (siteString === '' || query === '') { return; }
		if (this.options.openNewWindow) {
			window.open(siteString, '_newtab'); // new tab for firefox (prevents popup blocker message)
		} else {
			document.location.href = siteString;
		}
	},

	current: function(name) {
		return (typeof name === 'undefined' || name === '') ? wsButton.attr('title').split(':')[0] : this._setSearchSite(name);
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
