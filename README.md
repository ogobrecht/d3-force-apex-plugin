Please do not download directly this code - this is the development version and can be unstable. You can find the [latest
stable version here] (https://github.com/ogobrecht/d3-force-apex-plugin/releases/latest). 


# d3-force-apex-plugin

This is a D3 force implementation, playground and Oracle APEX plugin, which uses the
[D3 visualization library] (http://d3js.org/) to render a network layout. It has the following features:

* Interactive customizing wizard
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
* There is a JavaScript API to interact with the graph, also including seven events for the nodes (click, dblclick,
  contextmenu, mouseenter, mouseleave, lassostart, lassoend)
* All seven events are available in APEX - the plugin region can be AJAX refreshed and triggers then also
  apexbeforerefresh and apexafterrefresh


## Requirements

* APEX 4.2, if used as a plugin
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
You can find the current version by using the customize wizard or by calling a API method:

    // initialize and run a graph
    var example = net_gobrechts_d3_force().start();

    // check version
    example.version();

Everything you can do with the customize wizard you can also do during the runtime with the JavaScript API.

    example.width(800).height(600).linkDistance(50).start();

When using the APEX plugin, your variable to access the graph is automatically set by the plugin. You can open
the JavaScript console in your browser and look for "d3_force_YOUR_REGION_STATIC_ID". The example above would be then:

    d3_force_YOUR_REGION_STATIC_ID.width(800).height(600).linkDistance(50).start();

Please refer to the [API Reference] (https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference)
for more informations.


### 1.2.0 (2015-05-23)

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
