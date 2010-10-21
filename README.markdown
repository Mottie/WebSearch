**Overview** ([demo][1])

This code is designed to make it easy to add a search widget to your web site.

It utilizes the jQuery widget factory so that makes it dependent on jQuery and several jQuery UI components (listed below). This also makes it compatible with the jQuery UI Themeroller and all of the available themes.

**Usage**

* Html

        <input id="web-search" type="text">

* Script (default settings shown)

        $(document).ready(function(){
            // Set/Replace default search sites
            // ********************************
            // set/replace default  'Name' : [ 'css-class', 'search string/{s}' ]
            // remove default       'Name' : ''
            // ********************************
            // 'Name' can include spaces
            // 'css-class' should be a css class with a 20x20 pixel (ideally 16x16) background image
            // 'search-string' is determined by searching the site, then copying the location URL, replace the query with {s}
            //  var webSites = {
            //   'DuckDuckGo' : ['ui-icon-duckduckgo', 'http://duckduckgo.com/?q={s}'], // Add/replace web site
            //   'WebCrawler' : ''                                                      // Remove WebCrawler from default list
            //  };
            var webSites = { /* 'Name' : [ 'css-class', 'search string{s}' ] */
                'Alta Vista'    : ['ui-icon-altavista',     'http://us.yhs4.search.yahoo.com/yhs/search?fr=altavista&q={s}'],
                'Amazon'        : ['ui-icon-amazon',        'http://www.amazon.com/s/url=search-alias%3Daps&field-keywords={s}'],
                'Ask.com'       : ['ui-icon-ask',           'http://www.ask.com/web?q={s}'],
                'Bing'          : ['ui-icon-bing',          'http://www.bing.com/search?q={s}'], // *** This is already a default site ***
                'Dictionary'    : ['ui-icon-dictionary',    'http://dictionary.reference.com/browse/{s}'], // *** This is already a default site ***
                'Dog Pile'      : ['ui-icon-dogpile',       'http://dogpile.com/dogpile_other/ws/results/Web/{s}/1/417/TopNavigation/Relevance/'],
                'DuckDuckGo'    : ['ui-icon-duckduckgo',    'http://duckduckgo.com/?q={s}'],
                'Google'        : ['ui-icon-google',        'http://www.google.com/search?q={s}'], // *** This is already a default site ***
                'Lycos'         : ['ui-icon-lycos',         'http://search.lycos.com/?tab=web&query={s}'],
                'StackOverflow' : ['ui-icon-stackoverflow', 'http://stackoverflow.com/search?q={s}'], // you can search for tags too "[jQuery] websearch"
                'WebCrawler'    : ['ui-icon-webcrawler',    'http://www.webcrawler.com/webcrawler/ws/results/Web/{s}/1/417/TopNavigation/Relevance/'],
                'Wikipedia'     : ['ui-icon-wikipedia',     'http://en.wikipedia.org/w/index.php?search={s}'], // *** This is already a default site ***
                'Wolfram Alpha' : ['ui-icon-wolfram',       'http://www.wolframalpha.com/input/?i={s}'], // *** This is already a default site ***
                'Yahoo'         : ['ui-icon-yahoo',         'http://search.yahoo.com/search?p={s}'] // *** This is already a default site ***
            };
            $('#web-search').websearch({
                defaultSite     : "Google",  // Set the default search site.
                windowTarget    : '_blank',  // Choose from '_blank', '_parent', '_self', '_top' or '{framename}'
                windowOptions   : '',        // Window options ("menubar=1,resizable=1,width=350,height=250", etc)
                tooltipClass    : 'tooltip', // class added to the button, in case tooltips are to be used (site name and above message are in the button title).
                sortList        : true,      // if true, the site selection list will be sorted.
                hidden          : false,     // if true, the entire websearch widget will be hidden.
                searchResult    : null,      // add a search method here in case you want to open the search page in a lightbox.
                websearch       : webSites   // add/replace/remove site searches; see the webSites variable above for examples.
            });
        })

**Events**

* Change

        $('#web-search').bind('change', function(event,site){
            alert('Search changed to ' + site);
        })


**Methods** (most are from the UI widget interface)

* Destroy

        $('#web-search').websearch('destroy');

* Get

         // Get current search site
         var current = $('#web-search').websearch('current'); // returns "Google"

* Set

         // Set current search site
         var current = $('#web-search').websearch('current', 'Yahoo'); // sets and returns "Yahoo"

* Search

         // Initiate a search 
         // .websearch('search', {query}, {window target}, {window options});
         $('#web-search').websearch('search', 'Homer Simpson', '_blank', 'menubar=0');

* Search Result Method

         // Add a new search method to open the search results inside a colorbox popup window (http://colorpowered.com/colorbox/)
         $('#web-search').websearch({
             searchResult: function(url) {
                 $.colorbox({ width: '80%', height: '80%', iframe: true, href: url });
             }
         })

**Themeing**

* This widget is designed to work with jQuery UI CSS Framework. So it will match your jQuery UI theme. If more customization is needed, look at the example markup below.

        <div class="ui-websearch ui-widget">
            <input type="text" id="web-search" class="ui-websearch-input ui-widget-content ui-corner-left">
            <button class="ui-websearch ui-state-default tooltip ui-widget ui-button-text-only">
                <span class="ui-button-text">
                    <span class="ui-icon ui-icon-websearch ui-icon-google"></span>
                </span>
            </button>
            <button class="ui-state-default ui-corner-right tooltip ui-widget ui-button-text-only">
                <span class="ui-button-text">
                    <span class="ui-icon ui-icon-websearch-popup ui-icon-triangle-1-s"></span>
                </span>
            </button>
            <div class="ui-websearch-popup ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible">
                <a data-name="Google" class="site ui-state-default" href="#">
                    <span class="ui-icon ui-icon-websearch ui-icon-google"></span>
                    Google
                </a>
            </div>
        </div>

**Dependencies**

* jquery
* jquery.ui.core.js
* jquery.ui.widget.js
* jquery.ui.button.js

**Change Log**

* Version 1.1

    * Added an extra button with a down arrow next to the search button to make it's function more clear.
    * Added <code>windowTarget</code> option to replace the <code>openNewWindow</code> and make it more flexible.
    * Added <code>windowOptions</code> option to allow for adding window options.
    * Added <code>searchResult</code> option to allow for search results to popup in a lightbox, see the "Search Result Method" section above for an example.
    * Added a search method to initiate a search without user interaction. See the "Search" section above for an example.
    * Removed <code>openNewWindow</code> option.
    * Removed <code>clickToSearch</code> option.
    * Removed <code>clickMessage</code> option.

* Version 1.0

    * initial commit

 [1]: http://mottie.github.com/WebSearch/