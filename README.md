Please do not download directly this code - this is the development version and can be unstable. You can find the [latest
stable version here] (https://github.com/ogobrecht/d3-force-apex-plugin/releases/latest).


# d3-force-apex-plugin

This is a D3 force implementation, playground and Oracle APEX plugin, which uses the
[D3 visualization library] (http://d3js.org/) to render a network layout. It has the following features:

* Works with APEX versions 4.2.x and 5.x
* Interactive customization wizard
* Source data can be a XML string, JSON string or JavaScript Object (JSON)
* Link directions are visible and self references are rendered in a nice way - have a look in the online demos
* Node sizes are calculated between given min and max values depending on the SIZEVALUE attribute in your source data
* Node colors are assigned depending on the given COLORVALUE attribute in your source data - if you provide a IMAGE
  attribute for a node, then the image is used instead of a fill color
* Optional tooltips depending on the given INFOSTRING attribute in your source data
* If you have a node attribute called LINK, you can define on which event the URL should be called - default is
  dblclick - try it out in the online demos by double clicking the node KING
* Nodes can be pinned and the current positions can be saved and loaded to predefine a layout - optionally you can
  align the nodes to a grid when they are dragged around
* With the lasso mode you can select nodes and implement a graphical multi select
* The graph can be zoomed between the two configured min and max scale factors and is callable with the API
* There is a JavaScript API to interact with the graph, also including eight events (node click, node double click,
  node contextmenu, node mouse enter, node mouse leave, link click, lasso start, lasso end)
* All eight events are available in APEX - the plugin region can be AJAX refreshed and triggers then also
  apexbeforerefresh and apexafterrefresh
* NEW in 2.0.0: Automatic label placement after force end to prevent overlapping (optional, per default switched off),
  links can now have a COLOR and a INFOSTRING attribute - see also the changelog


## Requirements

* APEX 4.2 or higher, if used as a plugin
* A modern browser, who is able to work with SVG and CSS3 - for more informations see the
  [D3 Wiki] (https://github.com/mbostock/d3/wiki#browser--platform-support)


## Links

* Download of the [latest version] (https://github.com/ogobrecht/d3-force-apex-plugin/releases/latest)
* Plugin demo on [apex.oracle.com] (https://apex.oracle.com/pls/apex/f?p=18290)
* Standalone demo on [github.io] (http://ogobrecht.github.io/d3-force-apex-plugin/)
* API Reference in the [wiki] (https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference)


## Credits

I would like to say THANK YOU to all the people who share their knowledge. Without this sharing I would not have been
able to create this D3 implementation. Special thanks to Mike Bostock for his great library and to Carsten Czarski for
mentoring me on Oracle APEX plugin development.


## Changelog

This D3 force implementation uses [semantic versioning] (http://semver.org).
You can find the current version by using the customization wizard or by calling a API method:

    // initialize and run a graph
    var example = netGobrechtsD3Force().start();

    // check version
    example.version();

Everything you can do with the customization wizard you can also do during the runtime with the JavaScript API.

    example.width(800).height(600).linkDistance(50).start();

When using the APEX plugin, your variable to access the graph is automatically set by the plugin. You can open
the JavaScript console in your browser and look for "d3_force_YOUR_REGION_STATIC_ID". The example above would be then:

    d3_force_YOUR_REGION_STATIC_ID.width(800).height(600).linkDistance(50).start();

Please refer to the [API Reference] (https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference)
for more informations.


### 2.0.0 (2015-11-07)

* New option preventLabelOverlappingOnForceEnd: If set to true the labels are aligned with a simulated annealing
  function to prevent overlapping when the graph is cooled down (correctly on the force end event and only on labels,
  who are not circular) - thanks to Philippe Duchateau to ask for such a feature and all the testing
* New option labelPlacementIterations: The number of iterations for the preventLabelOverlappingOnForceEnd function -
  default is 250 - as higher the number, as higher the quality of the result - for details refer to the description of
  the simulated annealing function from the author Evan Wang under https://github.com/tinker10/D3-Labeler
* New behaviour: the font size and weight of a label is aligned when you hovering a node with your mouse - this helps
  you to find the right label in graphs with many nodes
* New possible value dotted for the links STYLE attribute: Now you have solid, dashed and dotted available for
  link styles
* New link attribute INFOSTRING: Like for nodes - this is shown as a tooltip, if tooltips are switched on in the
  configuration and you hover the links; ATTENTION: links are very narrow, so this plays nice together with
  the zoomMode; thanks again to Philippe Duchateau for the ideas of this and the next feature :-)
* New link attribute COLOR: This must be a HTML color code like `green` or `#00ff00` because of SVG standard 1.1
  does not support the inheritance of colors to markers and the graph function hast to manage dynamic markers for the colors and therefore the color names are used as identifiers for the markers
* New API method/option transform: behaves like a normal getter/setter (the zoom and zoomSmooth methods implements
  only setters) and can be used in the conf object to initialize the graph with different translate/scale factors
  than [0,0]/1 - works only, if the zoomMode is set to true - the current transform value(an object) is rendered
  in the customization wizard conf object text area like all other options when the current value is different then
  the default value {"translate":[0,0],"scale":1}
* Fixed: With the option alignFixedNodesToGrid it was possible to place nodes direct on the graphs left or top
  border - now the nodes are placed to the gridSize value, if the current position is smaller or equal the half
  of the gridsize
* Fixed: Provided fixed positions on startup not correctly set
* Fixed: No node shown if there is only one record return (thanks to Kenny Wang for reporting this bug)
* Code integration of the D3 lasso and labeler plugins - no more need to load the files for this plugins
* Code replacement of the XML to JSON converter X2JS with an own one
* Code refactoring against JSHint: This refactoring is also the reason for a new major version
  (API changed: renamed graph function, integration of libs, new XML parser)
* Update to D3 v3.5.6


### 1.4.1 (2015-08-05)

* Fixed "Tooltip on wrong positions in complex layouts". This was also the case with APEX 5 and universal theme.
  Thanks to Philippe Duchateau for telling me about this problem.


### 1.4.0 (2015-08-03)

* New possible node attribute COLORLABEL: Since there is an option to render a legend, it makes no sense to render the
  color names as legend labels, if the colorScheme "direct" is used to directly deliver CSS color codes (thanks to
  Philippe Duchateau for telling me about the problems). With other color schemes it is ok, since the COLORVALUE information
  can be any string like department names or ids or city names or whatever. To not to break existing graphs, the
  COLORVALUE is used as the legend label, if the COLORLABEL is not given in the nodes attributes.
* New option onLinkClickFunction: You can register a function which is called when a link is clicked (thanks to
  Niels de Bruijn for requesting this feature). It is not so easy to click a link, because the links are so narrow - if
  this option is needed I recommend to switch on the zoom mode - with zoom and pan it feels very natural to click links.
* New option setDomParentPaddingToZero: Boolean. If true, the style "padding: 0px;" is added to the graphs DOM parent
  element. If false, this style is removed from the graphs DOM parent element.
* The customization wizard shows now in the configuration object only non-default options. This reduces the size of the
  configuration object and is more transparent.
* New API methods "options" and "optionsCustomizationWizard": with this API methods you can get and set the whole
  configuration object with one call. "options" ouput includes all options, who are accessible via the API
  methods including the registered event functions (no APEX dynamic actions, only the functions under the report
  attributes). "optionsCustomizationWizard" output includes only the options, who are accessible via the customization
  wizard. With both methods you can set all options who are accessible via the API in one call.
* Restructuring the online API reference method overview.


### 1.3.0 (2015-06-07)

* New option showLoadingIndicatorOnAjaxCall: if set to true, a loading indicator is shown when used as a APEX plugin
  during the AJAX calls. If you want to show the loading indicator in a standalone implementation you can show and hide
  the loading indicator directly with the API method showLoadingIndicator (SHOW: example.showLoadingIndicator(true);
  HIDE: example.showLoadingIndicator(false);)
* Update to D3 v3.5.5


### 1.2.1 (2015-06-02)

* Fixed "Customize wizard jumps down when dragged on pages with hidden or fixed elements"


### 1.2.0 (2015-05-31)

* Refactor render function, so that the returned graph function is only one line of code and does not spoil the console
  when debug is set to true
* New option zoomMode (thanks to Alexej Schneider to ask for this feature and for testing the new version and his
  valuable feedback): I tried this before and was not happy with the solution, because the pan were disturbing the nodes
  drag functionality - now it is working :-)
  ATTENTION: When zoomMode is set to true then the lassoMode is only working with the pressed alt or shift key
  KNOWN BUG: In iOS it is after the first zoom event no more possible, to drag a node - instead the whole graph is
  moved - this is, because iOS Safari provide a wrong event.target.tagName. Also a problem: your are not able to press
  the alt or shift key - if you want to use lasso and zoom together on a touch device, you have to provide a workaround.
  One possible way is to provide a button, which turns zoom mode on and off with the API zoomMode method - then the user
  has the choice between these two modes - not comfortable, but working.
* New option minZoomFactor: The minimum possible zoom factor
* New option maxZoomFactor: The maximum possible zoom factor
* New method zoom: Can be used to programatically zoom to a point in the graph with the three parameters centerX,
  centerY and viewportWidth. More informations under
  https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference#zoom
* New method zoomSmooth: Does the same as the zoom method, but animated in a nice way:
  https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference#zoomsmooth
* New method nodeDataById: Helper function to get the data of one node. Can be helpful for the two new zoom methods to
  programatically focus a single node
* New option showLegend: renders a legend for all (distinct) COLORVALUE attribute values of the nodes
* New option showLabels: Labels are not new - a label is rendered, when a node has a filled attribute LABEL - new is
  the possibility to switch on and off the labels globally
* Hint in the customize wizard, that the configuration object has to be saved in the region attributes to save the
  configuration permanently (thanks to Renato Nobre to ask me a question about this topic)
* Reorganize the options in the customize wizard thematically: node/link/graph related options


### 1.1.0 (2015-04-19)

* New option lassoMode: boolean - if set to true you can select nodes with a lasso
* New events for lasso mode: lassostart, lassoend - if You register to this events, you get as data an object with all
  nodes, number of selected nodes and also a APEX compatible string of selected node IDs in the form of the multi select
  lists like '1234:567:890' - for details and examples see API reference
* New option alignFixedNodesToGrid: boolean - if set to true nodes are aligned to the nearest grid position on the
  drag end event - works only, if pinMode is set to true (thanks to Carsten Czarski for showing
  me an use case for this option)
* New option gridSize: numeric - default 50 - grid size for the new option alignFixedNodesToGrid
* New possible node attribute IMAGE: URL to an image - if you provide this attribute in your source data (SQL query with
  the APEX plugin), the node is rendered with an background image instead of a fill color (idea by Andrew Weir, thank
  you for your response!) - attention: this is definitly slowing down your visualization - please do not complain about
  this fact ;-)
* New possible node attributes fixed, x, y (all lower case, because of these are also internal attributes of the D3
  force layout): With these attributes you are able to predefine a layout already in your data (SQL query)
* New API method moveFixedNodes(x,y): moves all fixed nodes in the provided direction -
  'exampleGraphVariable.moveFixedNodes(10,-5).resume();' adds 10 to x position and -5 to y position on all fixed nodes -  
  ATTENTION if alignFixedNodesToGrid is set to true this can have unexpected behavior - you must then provide values
  greater then grid size halved to see any changes on your graph, otherwise the positions are falling back to the nearest
  (current) grid position
* New API method releaseFixedNodes
* New API method resume: with this method you can resume the graph force without a complete render cycle - e.g. you call
  the new method releaseFixedNodes and to take your changes into effect you can call then resume
  'exampleGraphVariable.releaseFixedNodes().resume();'
* New API method render: with this method you can render the graph with a complete render cycle - when used standalone
  there is no difference between the start and the render method - when used as APEX plugin the start method try
  to fetch new data with the query provided in your region source and call then the render method - with the render
  method you are now able to rerender the graph in APEX without fetching new data
  'exampleGraphVariable.minNodeRadius(4).maxNodeRadius(20).render();'
* API method positions: In the past this method was only used to predefine a layout before rendering the graph - now
  you can call this method also after rendering is complete and with calling the new method resume you can apply new
  positions at runtime without rerender the graph
  'exampleGraphVariable.positions([...]).resume();'
  (thanks to Mark Russellbrown to show me an unconventional use case for my force implementation and therefore force me
  to think about modification after rendering ;-)
* New third keyword for the option nodeLinkTarget in the customize wizard: "domContainerID" - if you use this keyword,
  then each event on a node, that opens the link is using the DOM container ID of your graph for the link target - this
  means, all your links are opened in the same browser window/tab, but a second graph is using a different browser
  window/tab (thanks to Philippe Duchateau for the question regarding this option) - please have a look in the API
  reference for more details: https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference#nodelinktarget
* Reducing the rendered DOM data by removing unnecessary id attributes on nodes, links and labels
* Input data can now be also an object: you have the choice to deliver graph data in three formats (XML string, JSON
  string or JavaScript Object) - when used as APEX plugin the data is transferred as text - your query has to select
  a single clob result and this clob can also be a XML or JSON string - you have the choice depending on your database
  version and existing libraries
* Fixed "Dragging a node triggers a click event"


### 1.0.5 (2015-02-21)

* Fixed "Links not correctly rendered in IE 9, 10, 11 when showLinkDirection is set to true" (found by Philippe
  Duchateau, thank you for your response!)


### 1.0.4 (2015-02-15)

* Fixed "APEX - unable to view datasets > 32k" (found by Andrew Weir, thank you for your response!)
* Improved error handling: errors are shown as single nodes with error text as label
* Empty nodes array does no longer break render function
* Positions are rounded on export to save space for APEX parameter item


### 1.0.3 (2015-01-30)

* Fixed "APEX - AJAX refresh not working without setting items to submit in region source"
* Correct links from customize wizard to online API documentation
* Activate also debug mode, when customize wizard is started
* Some small cosmetic changes


### 1.0.2 (2015-01-30)

* Fixed "Configuration - Boolean values are not correct initialized" (found by Carsten Czarski, thank you for your response!)
* Fixed "APEX - Page items to submit not working on AJAX refresh" (found by Carsten Czarski, thank you for your response!)
