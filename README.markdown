**WebSearch** (moved jQuery UI widget dependent version: [WebSearchUI][1])

----------

**Overview** ([demo][2])

This code is designed to make it easy to add a search widget to your web site.

 **Note:** This version (independent of jQuery UI widget factory) has different get, set, search and search result methods.

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
            // 'css-class' should be a css class with a 16x16 background image
            // 'search-string' is determined by searching the site, then copying the location URL, replace the query with {s}
            //  var webSites = {
            //   'DuckDuckGo' : ['ui-icon-duckduckgo', 'http://duckduckgo.com/?q={s}'], // Add/replace web site
            //   'Google'     : ''                                                      // Remove Google from default list
            //  };
            var webSites = { /* 'Name' : [ 'css-class', 'search string{s}' ] */
                'Alta Vista'    : ['ui-icon-altavista',     'http://us.yhs4.search.yahoo.com/yhs/search?fr=altavista&q={s}'],
                'Amazon'        : ['ui-icon-amazon',        'http://www.amazon.com/s/url=search-alias%3Daps&field-keywords={s}'],
                'Ask.com'       : ['ui-icon-ask',           'http://www.ask.com/web?q={s}'],
                'Bing'          : ['ui-icon-bing',          'http://www.bing.com/search?q={s}'],
                'Dictionary'    : ['ui-icon-dictionary',    'http://dictionary.reference.com/browse/{s}'],
                'Dog Pile'      : ['ui-icon-dogpile',       'http://dogpile.com/dogpile_other/ws/results/Web/{s}/1/417/TopNavigation/Relevance/'],
                'DuckDuckGo'    : ['ui-icon-duckduckgo',    'http://duckduckgo.com/?q={s}'],
                'Google'        : ['ui-icon-google',        'http://www.google.com/search?q={s}'], // *** This is the default site ***
                'Lycos'         : ['ui-icon-lycos',         'http://search.lycos.com/?tab=web&query={s}'],
                'StackOverflow' : ['ui-icon-stackoverflow', 'http://stackoverflow.com/search?q={s}'],
                'WebCrawler'    : ['ui-icon-webcrawler',    'http://www.webcrawler.com/webcrawler/ws/results/Web/{s}/1/417/TopNavigation/Relevance/'],
                'Wikipedia'     : ['ui-icon-wikipedia',     'http://en.wikipedia.org/w/index.php?search={s}'],
                'Wolfram Alpha' : ['ui-icon-wolfram',       'http://www.wolframalpha.com/input/?i={s}'],
                'Yahoo'         : ['ui-icon-yahoo',         'http://search.yahoo.com/search?p={s}']
            };
            $('#web-search').websearch({
                defaultSite     : "Google",  // Set the default search site.
                windowTarget    : '_blank',  // Choose from '_blank', '_parent', '_self', '_top' or '{framename}'
                windowOptions   : '',        // Window options ("menubar=1,resizable=1,width=350,height=250", etc)
                tooltipClass    : 'tooltip', // class added to the button, in case tooltips are to be used (site name and above message are in the button title).
                hideSelector    : false,     // if true, the site selector button will be hidden
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


**Methods**

* Get

        // Get current search site
        var current = $('#web-search').data('websearch').current(); // returns "Google"

* Set

        // Set current search site
        var current = $('#web-search').data('websearch').current('Yahoo'); // sets and returns "Yahoo"

* Search

        // Initiate a search 
        // search({query}, {window target}, {window options});
        $('#web-search').data('websearch').search('Homer Simpson', '_blank', 'menubar=0');

* Search Results

        // Add a new search result method to open the search results inside a colorbox popup window (http://colorpowered.com/colorbox/)
        $('#web-search').websearch({
            searchResult: function(url) {
                $.colorbox({ width: '80%', height: '80%', iframe: true, href: url });
            }
        })

**Web Site Search String**

* Add, Replace or Remove Sites

 * By default, only Google.com is added to the plugin (changed in version 1.1.1).
 * To disable Google, just add an empty string (see example below)
 * To add or remove a site, set the parameters as follows:

            // set/replace default  'Site Name' : [ 'css-class', 'search string/{s}' ]
            // remove default       'Site Name' : ''
            // 'Site Name' can include spaces
            // 'css-class' should be a css class with a 16x16 background image.
            // 'search-string' is determined by searching the site, then copying the location URL, replace the query with {s}
            
            var webSites = {
            //  'Site Name'  : ['css-class',          'search string{s}' ]
                'DuckDuckGo' : ['ui-icon-duckduckgo', 'http://duckduckgo.com/?q={s}'], // Add/replace web site
                'Google'     : ''                                                      // Remove Google from default list
            };

* Determining a String - This is the method I used to determine each site's search string. There may be a better method, but this is what worked for me.

 * If I didn't include a web site that you need, then you can determine its search string by going to the site, entering any query that is easily recognizable, like "Homer Simpson".
 * For Dogpile, you'll find this as the browser location:

            http://dogpile.com/dogpile/ws/results/Web/Homer%20Simpson/1/417/TopNavigation/Relevance/iq=true/zoom=off/_iceUrlFlag=7?_IceUrl=true

 * At this point you can see the query is `Homer%20Simpson` but there are a whole bunch of extra parameters
 * My first attempt would be to strip out all the extra parameters and try this, which didn't work:

            http://dogpile.com/dogpile/ws/results/Web/Homer%20Simpson/

 * In subsequent attempts I just added back each parameter to the browser location until I found one that worked:

            http://dogpile.com/dogpile_other/ws/results/Web/Homer%20Simpson/1/417/TopNavigation/Relevance/

 * Now just replace the query with `{s}` and you have your search string:

            http://dogpile.com/dogpile_other/ws/results/Web/{s}/1/417/TopNavigation/Relevance/

 * Other sites like Google proved to be much easier.

* Extra Search String Parameters

 * You can set the WebSearch site string to have specific targets, for instance if you want to use Google to search your own site then modify the string as below. The `site:mysite.com ` is one of [Googles advanced search parameters][3]. It must be separated from the query string by either a space or plus (+) sign.

            http://www.google.com/search?q=site:mysite.com+{s}

 * In the StackOverflow string, you can target specific tags. Again, make sure it is separated from the query:

            http://stackoverflow.com/search?q=[jquery] {s}

 * Each site uses different "advanced" parameters, so I won't list them all here.

**Themeing**

* This widget is independent of the jQuery UI CSS Framework. Most of the color properties have been located at the top of the search.css file to make it easier to modify.

        <div class="websearch">
            <input type="text" id="web-search" class="websearch-input">
            <button class="websearch-search tooltip" title="Google">
                <span class="icon-websearch-search ui-icon-google"></span>
            </button>
            <button class="websearch-select tooltip">
                <span class="icon-websearch icon-websearch-select"></span>
            </button>
            <div class="websearch-popup">
                <a data-name="Google" class="site" href="#">
                    <span class="icon-websearch ui-icon-google"></span>
                    Google
                </a>
            </div>
        </div>

**Change Log**

* Version 1.1.1

    * Added <code>hideSelector</code> option to allow hiding the site selector button
    * Replaced the WebSearchUI with this version.
    * Improved the sharpness of the search site icons.
    * Removed destroy method from non-jQuery UI version.

* Version 1.1

    * Added an extra button with a down arrow next to the search button to make it's function more clear.
    * Added <code>windowTarget</code> option to replace the <code>openNewWindow</code> and make it more flexible.
    * Added <code>windowOptions</code> option to allow for adding window options.
    * Added <code>searchResult</code> option to allow for search results to popup in a lightbox, see the "Search Result Method" section above for an example.
    * Added a search method to initiate a search without user interaction. See the "Search" section above for an example. Thanks Tentonaxe!
    * Removed <code>openNewWindow</code> option.
    * Removed <code>clickToSearch</code> option.
    * Removed <code>clickMessage</code> option.

* Version 1.0

    * initial commit

 [1]: http://github.com/Mottie/WebSearchUI
 [2]: http://mottie.github.com/WebSearch/