function net_gobrechts_d3_force ( pDomContainerId, pOptions, pApexPluginId, pApexPageItemsToSubmit ) {
  /*********************************************************************************************************************
   * D3 Force Implementation, Playground and Oracle APEX Plugin: https://github.com/ogobrecht/d3-force-apex-plugin
   *
   * @param pDomContainerId:       The DOM container, where the graph should be rendered
   * @param pOptions:              The configuration object to configure the graph, see also the API reference
   * @param pApexPluginId:         If used as APEX plugin, this ID is the plugin identifier for the AJAX calls
   * @param pApexPageItemsToSubmit If used as APEX plugin, these page items are submitted before the AJAX call
   * @returns {render}             The render function is returned to allow method chaining
   */
  
  "use strict";

  /*********************************************************************************************************************
   * Setup Configuration
   */

  // create global object
  var v = {"version":"1.1.0"};
  v.dom = {};
  v.conf = {};
  v.data = {};
  v.tools = {};
  v.status = {};
  
  // helper to check boolean values
  v.tools.parseBool = function(value){
    switch(String(value).trim().toLowerCase()){
      case "true": case "yes": case "1": return true; 
      case "false": case "no": case "0": case "": return false; 
      default: return false;
    }
  };

  // save parameter for later use
  v.dom.containerId        = pDomContainerId || 'D3Force' + Math.floor(Math.random()*1000000);
  v.confUser                   = pOptions || {};
  v.conf.apexPluginId          = pApexPluginId;
  v.conf.apexPageItemsToSubmit = pApexPageItemsToSubmit;

  // configure debug mode for APEX, can be overwritten by configuration object
  v.conf.debugPrefix    = 'D3 Force in DOM container #' + v.dom.containerId + ': ';
  v.conf.debug = ( v.conf.apexPluginId && apex.jQuery('#pdebug').length == 1 );

  // monitoring variables
  v.status.forceTickCounter = 0;
  v.status.forceStartTime = 0;
  v.status.forceRunning = false;
  v.status.graphStarted = false;
  v.status.graphReady = false;
  v.status.graphOldPositions = null;

  // default configuration
  v.confDefaults = {
    "showBorder":{"type":"bool", "val":true, "options":[true,false]},
    "showSelfLinks":{"type":"bool", "val":true, "options":[true,false]},
    "showLinkDirection":{"type":"bool", "val":true, "options":[true,false]},
    "showTooltips":{"type":"bool", "val":true, "options":[true,false]},
    "tooltipPosition":{"type":"text", "val":"svgTopRight", "options":["node","svgTopLeft","svgTopRight"]},
    "colorScheme":{"type":"text", "val":"color20", "options":["color20","color20b","color20c","color10","direct"]},
    "labelsCircular":{"type":"bool", "val":false, "options":[true,false]},
    "dragMode":{"type":"bool", "val":true, "options":[true,false]},
    "pinMode":{"type":"bool", "val":false, "options":[true,false]},
    "lassoMode":{"type":"bool", "val":false, "options":[true,false]},
    "alignFixedNodesToGrid":{"type":"bool", "val":false, "options":[true,false]},
    "gridSize":{"type":"number", "val":50, "options":[150,140,130,120,110,100,90,80,70,60,50,40,30,20,10]},
    "nodeEventToStopPinMode":{"type":"text", "val":"contextmenu", "options":["none","dblclick","contextmenu"]},
    "onNodeContextmenuPreventDefault":{"type":"bool", "val":false, "options":[true,false]},
    "nodeEventToOpenLink":{"type":"text", "val":"dblclick", "options":["none","click","dblclick","contextmenu"]},
    "nodeLinkTarget":{"type":"text", "val":"_blank", "options":["none","_blank","nodeID","domContainerID"]},
    "autoRefresh":{"type":"bool", "val":false, "options":[true,false]},
    "refreshInterval":{"type":"number", "val":5000, "options":[60000,30000,15000,10000,5000,2500]},
    "useDomParentWidth":{"type":"bool", "val":false, "options":[true,false]},
    "width":{"type":"number", "val":500, "options":[1200,1150,1100,1050,1000,950,900,850,800,750,700,650,600,550,500,450,400,350,300]},
    "height":{"type":"number", "val":500, "options":[1200,1150,1100,1050,1000,950,900,850,800,750,700,650,600,550,500,450,400,350,300]},
    "minNodeRadius":{"type":"number", "val":6, "options":[12,11,10,9,8,7,6,5,4,3,2,1]},
    "maxNodeRadius":{"type":"number", "val":18,"options":[36,34,32,30,28,26,24,22,20,18,16,14,12]},
    "labelDistance":{"type":"number", "val":12, "options":[30,28,26,24,22,20,18,16,14,12,10,8,6,4,2]},
    "selfLinkDistance":{"type":"number", "val":20, "options":[30,28,26,24,22,20,18,16,14,12,10,8]},
    "linkDistance":{"type":"number", "val":80, "options":[120,110,100,90,80,70,60,50,40,30,20]},
    //"chargeDistance":{"type":"number", "val":null, "internal":true},
    "charge":{"type":"number", "val":-350, "options":[-1000,-950,-900,-850,-800,-750,-700,-650,-600,-550,-500,-450,-400,-350,-300,-250,-200,-150,-100,-50,0], "internal":true},
    "gravity":{"type":"number", "val":0.1, "options":[1.00,0.95,0.90,0.85,0.80,0.75,0.70,0.65,0.60,0.55,0.50,0.45,0.40,0.35,0.30,0.25,0.20,0.15,0.1,0.05,0.00], "internal":true},
    "linkStrength":{"type":"number", "val":1, "options":[1.00,0.95,0.90,0.85,0.80,0.75,0.70,0.65,0.60,0.55,0.50,0.45,0.40,0.35,0.30,0.25,0.20,0.15,0.10,0.05,0.00], "internal":true},
    "friction":{"type":"number", "val":0.9, "options":[1.00,0.95,0.90,0.85,0.80,0.75,0.70,0.65,0.60,0.55,0.50,0.45,0.40,0.35,0.30,0.25,0.20,0.15,0.10,0.05,0.00], "internal":true},
    "theta":{"type":"number", "val":0.8, "options":[1,0.95,0.9,0.85,0.8,0.75,0.7,0.65,0.6,0.55,0.5,0.45,0.4,0.35,0.3,0.25,0.2,0.15,0.1,0.05,0], "internal":true}
  };

  // create intial configuration
  v.conf.customize = false;
  v.conf.debug = (typeof v.confUser.debug  !== 'undefined' ?  v.tools.parseBool(v.confUser.debug) : false);
  v.conf.showBorder = (typeof v.confUser.showBorder !== 'undefined' ? v.tools.parseBool(v.confUser.showBorder) : v.confDefaults.showBorder.val);
  v.conf.showSelfLinks = (typeof v.confUser.showSelfLinks !== 'undefined' ? v.tools.parseBool(v.confUser.showSelfLinks) : v.confDefaults.showSelfLinks.val);
  v.conf.showLinkDirection = (typeof v.confUser.showLinkDirection !== 'undefined' ? v.tools.parseBool(v.confUser.showLinkDirection) : v.confDefaults.showLinkDirection.val);
  v.conf.showTooltips = (typeof v.confUser.showTooltips !== 'undefined' ? v.tools.parseBool(v.confUser.showTooltips) : v.confDefaults.showTooltips.val);
  v.conf.tooltipPosition = v.confUser.tooltipPosition || v.confDefaults.tooltipPosition.val;
  v.conf.colorScheme = v.confUser.colorScheme || v.confDefaults.colorScheme.val;
  v.conf.labelsCircular = (typeof v.confUser.labelsCircular !== 'undefined' ? v.tools.parseBool(v.confUser.labelsCircular) : v.confDefaults.labelsCircular.val);
  v.conf.dragMode = (typeof v.confUser.dragMode !== 'undefined' ? v.tools.parseBool(v.confUser.dragMode) : v.confDefaults.dragMode.val);
  v.conf.pinMode = (typeof v.confUser.pinMode !== 'undefined' ? v.tools.parseBool(v.confUser.pinMode) : v.confDefaults.pinMode.val);
  v.conf.lassoMode = (typeof v.confUser.lassoMode !== 'undefined' ? v.tools.parseBool(v.confUser.lassoMode) : v.confDefaults.lassoMode.val);
  v.conf.alignFixedNodesToGrid = (typeof v.confUser.alignFixedNodesToGrid !== 'undefined' ? v.tools.parseBool(v.confUser.alignFixedNodesToGrid) : v.confDefaults.alignFixedNodesToGrid.val);
  v.conf.gridSize = (v.confUser.gridSize && v.confUser.gridSize > 0 ? v.confUser.gridSize : v.confDefaults.gridSize.val);
  v.conf.nodeEventToStopPinMode = v.confUser.nodeEventToStopPinMode || v.confDefaults.nodeEventToStopPinMode.val;
  v.conf.onNodeContextmenuPreventDefault = (typeof v.confUser.onNodeContextmenuPreventDefault !== 'undefined' ? v.tools.parseBool(v.confUser.onNodeContextmenuPreventDefault) : v.confDefaults.onNodeContextmenuPreventDefault.val);
  v.conf.nodeEventToOpenLink = v.confUser.nodeEventToOpenLink || v.confDefaults.nodeEventToOpenLink.val;
  v.conf.nodeLinkTarget = v.confUser.nodeLinkTarget || v.confDefaults.nodeLinkTarget.val;
  v.conf.autoRefresh = (typeof v.confUser.autoRefresh !== 'undefined' ? v.tools.parseBool(v.confUser.autoRefresh) : v.confDefaults.autoRefresh.val);
  v.conf.refreshInterval = v.confUser.refreshInterval || v.confDefaults.refreshInterval.val;
  v.conf.useDomParentWidth = (typeof v.confUser.useDomParentWidth !== 'undefined' ? v.tools.parseBool(v.confUser.useDomParentWidth) : v.confDefaults.useDomParentWidth.val);
  v.conf.width = v.confUser.width || v.confDefaults.width.val;
  v.conf.height = v.confUser.height || v.confDefaults.height.val;
  v.conf.minNodeRadius = v.confUser.minNodeRadius || v.confDefaults.minNodeRadius.val;
  v.conf.maxNodeRadius = v.confUser.maxNodeRadius || v.confDefaults.maxNodeRadius.val;
  v.conf.labelDistance = v.confUser.labelDistance || v.confDefaults.labelDistance.val;
  v.conf.selfLinkDistance = v.confUser.selfLinkDistance || v.confDefaults.selfLinkDistance.val;
  v.conf.linkDistance = v.confUser.linkDistance || v.confDefaults.linkDistance.val;
  v.conf.chargeDistance = v.confUser.chargeDistance || null;
  v.conf.charge = v.confUser.charge || v.confDefaults.charge.val;
  v.conf.gravity = v.confUser.gravity || v.confDefaults.gravity.val;
  v.conf.linkStrength = v.confUser.linkStrength || v.confDefaults.linkStrength.val;
  v.conf.friction = v.confUser.friction || v.confDefaults.friction.val;
  v.conf.theta = v.confUser.theta || v.confDefaults.theta.val;
  v.conf.onNodeMouseenterFunction = v.confUser.onNodeMouseenterFunction || null;
  v.conf.onNodeMouseleaveFunction = v.confUser.onNodeMouseleaveFunction || null;
  v.conf.onNodeClickFunction = v.confUser.onNodeClickFunction || null;
  v.conf.onNodeDblclickFunction = v.confUser.onNodeDblclickFunction || null;
  v.conf.onNodeContextmenuFunction = v.confUser.onNodeContextmenuFunction || null;
  v.conf.onLassoStartFunction = v.confUser.onLassoStartFunction || null;
  v.conf.onLassoEndFunction = v.confUser.onLassoEndFunction || null;
  v.conf.currentTabPosition = null;
  v.conf.sampleData = false;
  
  // initialize sample data
  v.data.sampleData = '<data>' +
    '<nodes ID="7839" LABEL="KING is THE KING, you know?" COLORVALUE="10" SIZEVALUE="5000" LABELCIRCULAR="true" LINK="http://apex.oracle.com/" INFOSTRING="This visualization is based on the well known emp table." />' +
    '<nodes ID="7698" LABEL="BLAKE" COLORVALUE="30" SIZEVALUE="2850" />' +
    '<nodes ID="7782" LABEL="CLARK" COLORVALUE="10" SIZEVALUE="2450" />' +
    '<nodes ID="7566" LABEL="JONES" COLORVALUE="20" SIZEVALUE="2975" />' +
    '<nodes ID="7788" LABEL="SCOTT" COLORVALUE="20" SIZEVALUE="3000" />' +
    '<nodes ID="7902" LABEL="FORD" COLORVALUE="20" SIZEVALUE="3000" />' +
    '<nodes ID="7369" LABEL="SMITH" COLORVALUE="20" SIZEVALUE="800" />' +
    '<nodes ID="7499" LABEL="ALLEN" COLORVALUE="30" SIZEVALUE="1600" />' +
    '<nodes ID="7521" LABEL="WARD" COLORVALUE="30" SIZEVALUE="1250" />' +
    '<nodes ID="7654" LABEL="MARTIN" COLORVALUE="30" SIZEVALUE="1250" />' +
    '<nodes ID="7844" LABEL="TURNER" COLORVALUE="30" SIZEVALUE="1500" />' +
    '<nodes ID="7876" LABEL="ADAMS" COLORVALUE="20" SIZEVALUE="1100" />' +
    '<nodes ID="7900" LABEL="JAMES" COLORVALUE="30" SIZEVALUE="950" />' +
    '<nodes ID="7934" LABEL="MILLER" COLORVALUE="10" SIZEVALUE="1300" />' +
    '<nodes ID="8888" LABEL="Who am I?" COLORVALUE="green" SIZEVALUE="2000" LINK="https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference#nodelinktarget" INFOSTRING="This is a good question. Think about it." />' +
    '<nodes ID="9999" LABEL="Where I am?" COLORVALUE="#f00" SIZEVALUE="1000" LINK="https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference#nodelinktarget" INFOSTRING="This is a good question. What do you think?" />' +
    '<links FROMID="7839" TOID="7839" STYLE="dashed" />' +
    '<links FROMID="7698" TOID="7839" STYLE="solid" />' +
    '<links FROMID="7782" TOID="7839" STYLE="solid" />' +
    '<links FROMID="7566" TOID="7839" STYLE="solid" />' +
    '<links FROMID="7788" TOID="7566" STYLE="solid" />' +
    '<links FROMID="7902" TOID="7566" STYLE="solid" />' +
    '<links FROMID="7369" TOID="7902" STYLE="solid" />' +
    '<links FROMID="7499" TOID="7698" STYLE="solid" />' +
    '<links FROMID="7521" TOID="7698" STYLE="solid" />' +
    '<links FROMID="7654" TOID="7698" STYLE="solid" />' +
    '<links FROMID="7844" TOID="7698" STYLE="solid" />' +
    '<links FROMID="7876" TOID="7788" STYLE="solid" />' +
    '<links FROMID="7900" TOID="7698" STYLE="solid" />' +
    '<links FROMID="7934" TOID="7782" STYLE="solid" />' +
    '</data>';


  /*********************************************************************************************************************
   * Setup DOM
   */

  // create DOM container element, if not existing (if we have an APEX context, it is already created from the APEX engine )
  if ( document.querySelector('#' + v.dom.containerId) === null ){
    v.dom.container = d3.select('body').append('div')
      .attr('id', v.dom.containerId)
  }
  else {
    v.dom.container = d3.select('#' + v.dom.containerId);
    d3.selectAll('#' + v.dom.containerId + '_tooltip, #' + v.dom.containerId + '_customizing').remove();
  }

  // create SVG element, if not existing (if we have an APEX context, it is already created from the APEX plugin )
  if ( document.querySelector('#' + v.dom.containerId + ' svg') === null ){
    v.dom.svg = v.dom.container.append('svg');
  }
  else {
    v.dom.svg = d3.select('#' + v.dom.containerId + ' svg');
    d3.selectAll('#' + v.dom.containerId + ' svg *').remove();
  }

  // configure SVG element
  v.dom.svg
    .attr('id', v.dom.containerId + '_svg')
    .attr('class', 'net_gobrechts_d3_force')
    .classed('border', v.conf.showBorder)
    .attr('width', v.conf.width)
    .attr('height', v.conf.height);
  
  // create overlay to fetch lasso & zoom events
  v.dom.svgOverlay = v.dom.svg.append('rect')
    .attr('class', 'overlay')
    .attr('width',v.conf.width)
    .attr('height',v.conf.height);
  
  // create definitions element inside the SVG element
  v.dom.svgDefs = v.dom.svg.append('defs');

  // create marker definitions
  v.dom.svgDefs
    .append('svg:marker')
    .attr('id', v.dom.containerId + '_highlightedTriangle')
    .attr('class', 'highlighted')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 10)
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .attr('markerUnits', 'strokeWidth')
    .append('svg:path')
    .attr('d', 'M0,0 L10,5 L0,10');

  v.dom.svgDefs
    .append('svg:marker')
    .attr('id', v.dom.containerId + '_normalTriangle')
    .attr('class', 'normal')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 10)
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .attr('markerUnits', 'strokeWidth')
    .append('svg:path')
    .attr('d', 'M0,0 L10,5 L0,10');

  // create tooltip container
  v.dom.tooltip = v.dom.container.append('div')
      .attr('id', v.dom.containerId + '_tooltip')
      .attr('class', 'net_gobrechts_d3_force_tooltip')
      .style('top', '0px')
      .style('left', '0px');


  /*********************************************************************************************************************
   * Setup Helper Functions
   */  

  // log function for debug mode
  v.tools.log = function(message, omitDebugPrefix) {
    if (v.conf.debug){
      if (omitDebugPrefix) console.log(message);
      else console.log( v.conf.debugPrefix + message);
    }
    if (v.conf.customize && v.conf.domCustomizeLog) v.conf.domCustomizeLog.text ( message + '\n' + v.conf.domCustomizeLog.text() );
  };

  // log error function
  v.tools.logError = function(message) {
    console.log( v.conf.debugPrefix + 'ERROR: ' + message);
    if (v.conf.customize && v.conf.domCustomizeLog) v.conf.domCustomizeLog.text ( 'ERROR: ' + message + '\n' + v.conf.domCustomizeLog.text() );
  };
  
  // trigger APEX events, if we have an APEX context
  v.tools.triggerApexEvent = function(domNode, event, data) {
    if (v.conf.apexPluginId) apex.event.trigger(domNode, event, data);
  };

  // helper function to calculate node radius from "size" attribute
  v.tools.setRadiusFunction = function(){
    v.tools.radius = d3.scale.sqrt()
      .range([v.conf.minNodeRadius,v.conf.maxNodeRadius])
      .domain( d3.extent(v.data.nodes, function(n){return parseFloat(n.SIZEVALUE);}) );
  };

  // check, if two nodes are neighbors
  v.tools.neighboring = function (a, b) {
    return ( v.data.neighbors.indexOf(a.ID+':'+b.ID) > -1 ||
             v.data.neighbors.indexOf(b.ID+':'+a.ID) > -1 );
  };

  // get nearest grid position
  v.tools.getNearestGridPosition = function(currentPos, maxPos) {
    currentPos = Math.round(currentPos);
    var offset, position;
    if ( currentPos >= maxPos ) {
      offset = maxPos % v.conf.gridSize;
      position = maxPos - offset;
      if (position = maxPos) {
        position = position - v.conf.gridSize;
      }
    }
    else if ( currentPos <= 0 ) {
      position = v.conf.gridSize;
    }
    else {
      offset = currentPos % v.conf.gridSize;
      position = ( offset > v.conf.gridSize/2 ? currentPos - offset + v.conf.gridSize : currentPos - offset);
      if (position >= maxPos) {
        position = position - v.conf.gridSize;
      }
    }
    return position;
  };

  // adjust link x/y
  v.tools.adjustSourceX = function(l){
    return l.source.x + Math.cos(v.tools.calcAngle(l)) * (l.source.radius);
  };
  v.tools.adjustSourceY = function(l){
    return l.source.y + Math.sin(v.tools.calcAngle(l)) * (l.source.radius);
  };
  v.tools.adjustTargetX = function(l){
    return l.target.x - Math.cos(v.tools.calcAngle(l)) * (l.target.radius);
  };
  v.tools.adjustTargetY = function(l){
    return l.target.y - Math.sin(v.tools.calcAngle(l)) * (l.target.radius);
  };
  v.tools.calcAngle = function(l){
    return Math.atan2(l.target.y - l.source.y, l.target.x - l.source.x);
  };

  // create a path for self links
  v.tools.getSelfLinkPath = function(l){
    var ri = l.source.radius;
    var ro = l.source.radius + v.conf.selfLinkDistance;
    var x = 0; // we position the path later with transform/translate
    var y = 0;
    var pathStart = {"source":{"x":0,"y":0,"radius":ri},
                   "target":{"x":(x + ro/2),"y":(y + ro),"radius":ri}};
    var pathEnd = {"source":{"x":(x - ro/2),"y":(y + ro),"radius":ri},
                   "target":{"x":x,"y":y,"radius":ri}};
    var path = 'M' + v.tools.adjustSourceX(pathStart) + ',' + v.tools.adjustSourceY(pathStart);
    path += ' L' + (x + ro/2) + ',' + (y + ro);
    path += ' A' + ro + ',' + ro + ' 0 0,1 ' + (x - ro/2) + ',' + (y + ro);
    path += ' L' + v.tools.adjustTargetX( pathEnd ) + ',' + v.tools.adjustTargetY( pathEnd );
    return path;
  };

  // create a path for labels - example: d='M100,100 a20,20 0 0,1 40,0'
  v.tools.getLabelPath = function(n){
    var r = n.radius + v.conf.labelDistance;
    var x = 0; // we position the path later with transform/translate
    var y = 0;
    var path = 'M' + (x - r) + ',' + y;
    //path += ' a' + r + ',' + r + ' 0 0,1 ' + (r * 2) + ',0';
    path += ' a' + r + ',' + r + ' 0 0,1 ' + (r * 2) + ',0';
    path += ' a' + r + ',' + r + ' 0 0,1 -' + (r * 2) + ',0';
    return path;
  };

  // open link function
  v.tools.openLink = function(node) {
    var win;
    if (v.conf.nodeLinkTarget == "none") {
      window.location.assign(node.LINK);
    }
    else if (v.conf.nodeLinkTarget == "nodeID") {
      win = window.open(node.LINK, node.ID);
      win.focus();
    }
    else if (v.conf.nodeLinkTarget == "domContainerID") {
      win = window.open(node.LINK, v.dom.containerId);
      win.focus();
    }
    else {
      win = window.open(node.LINK, v.conf.nodeLinkTarget);
      win.focus();
    }
  };

  // on node mouse enter function
  v.tools.onNodeMouseenter = function(node){
    var position;
    v.nodes.classed('highlighted', function(n){ return v.tools.neighboring(n, node); });
    v.links
      .classed('highlighted', function(l){return l.source.ID == node.ID || l.target.ID == node.ID;})
      .style('marker-end', function(l){
        if (v.conf.showLinkDirection) {
          return 'url(#'+v.dom.containerId+'_' + 
              (l.source.ID == node.ID || l.target.ID == node.ID ? 'highlighted' : 'normal') + 
              'Triangle)';
        }
        else {
          return null;
        }
      });
    v.selfLinks
      .classed('highlighted', function(l){ return l.FROMID == node.ID; })
      .style('marker-end', function(l){
        if (v.conf.showLinkDirection) {
          return 'url(#'+v.dom.containerId+'_' + 
              (l.source.ID == node.ID || l.target.ID == node.ID ? 'highlighted' : 'normal') + 
              'Triangle)';
        }
        else {
          return null;
        }
      });
    d3.select(this).classed('highlighted', true);
    v.tools.log('Event mouseenter triggered.');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_mouseenter', node);
    if (typeof(v.conf.onNodeMouseenterFunction) == 'function') v.conf.onNodeMouseenterFunction.call(this, d3.event, node);
    if (v.conf.showTooltips && node.INFOSTRING) {
      v.dom.tooltip.html(node.INFOSTRING).style('display', 'block');
      if (v.conf.tooltipPosition === 'svgTopLeft') {
        position = v.tools.getOffsetRect(document.querySelector('#' + v.dom.containerId + ' svg'));
        v.dom.tooltip
          .style('top', position.top + 
            (v.dom.svg.style('border-width') ? parseInt(v.dom.svg.style('border-width')) : 1) +
            'px')
          .style('left', position.left + 
            (v.dom.svg.style('border-width') ? parseInt(v.dom.svg.style('border-width')) : 1) +
            'px');
      }
      else if (v.conf.tooltipPosition === 'svgTopRight') {
        position = v.tools.getOffsetRect(document.querySelector('#' + v.dom.containerId + ' svg'));
        v.dom.tooltip
          .style('top', position.top + 
            parseInt( (v.dom.svg.style('border-width') ? parseInt(v.dom.svg.style('border-width')) : 1) ) + 
            'px')
          .style('left', position.left +
            parseInt(v.dom.svg.style('width')) +
            parseInt( (v.dom.svg.style('border-width') ? parseInt(v.dom.svg.style('border-width')) : 1) ) -
            parseInt(v.dom.tooltip.style('width')) -
            2 * parseInt( (v.dom.tooltip.style('border-width') ? parseInt(v.dom.tooltip.style('border-width')) : 0) ) -
            parseInt(v.dom.tooltip.style('padding-left')) -
            parseInt(v.dom.tooltip.style('padding-right')) +
            'px');
      }
      else { // all other cases defaults to 'node', so also invalid values are reset to 'node'
        v.dom.tooltip
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 'px');
      }
    }
  };

  // on node mouse leave function
  v.tools.onNodeMouseleave = function(node){
    v.nodes.classed('highlighted', false);
    v.links
      .classed('highlighted', false)
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.dom.containerId+'_normalTriangle)':null) );
    v.selfLinks
      .classed('highlighted', false)
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.dom.containerId+'_normalTriangle)':null) );
    v.labels.classed('highlighted', false);
    v.tools.log('Event mouseleave triggered.');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_mouseleave', node);
    if (typeof(v.conf.onNodeMouseleaveFunction) == 'function') v.conf.onNodeMouseleaveFunction.call(this, d3.event, node);
    if (v.conf.showTooltips) v.dom.tooltip.style('display', 'none');
  };

  // on node click function
  v.tools.onNodeClick = function(node){
    if (d3.event.defaultPrevented) {
      return null; // ignore drag
    } 
    else {
      if (node.LINK && v.conf.nodeEventToOpenLink == 'click') v.tools.openLink(node);
      if (v.conf.nodeEventToStopPinMode == 'click') d3.select(this).classed('fixed', node.fixed = 0);
      v.tools.log('Event click triggered.');
      v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_click', node);
      if (typeof(v.conf.onNodeClickFunction) == 'function') v.conf.onNodeClickFunction.call(this, d3.event, node);
    }  
  };

  // on node double click function
  v.tools.onNodeDblclick = function(node){
    if (node.LINK && v.conf.nodeEventToOpenLink == 'dblclick') v.tools.openLink(node);
    if (v.conf.nodeEventToStopPinMode == 'dblclick') d3.select(this).classed('fixed', node.fixed = 0);
    v.tools.log('Event dblclick triggered.');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_dblclick', node);
    if (typeof(v.conf.onNodeDblclickFunction) == 'function') v.conf.onNodeDblclickFunction.call(this, d3.event, node);
  };

  // on node contextmenu function
  v.tools.onNodeContextmenu = function(node){
    if (v.conf.onNodeContextmenuPreventDefault) d3.event.preventDefault();
    if (node.LINK && v.conf.nodeEventToOpenLink == 'contextmenu') v.tools.openLink(node);
    if (v.conf.nodeEventToStopPinMode == 'contextmenu') d3.select(this).classed('fixed', node.fixed = 0);
    v.tools.log('Event contextmenu triggered.');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_contextmenu', node);
    if (typeof(v.conf.onNodeContextmenuFunction) == 'function') v.conf.onNodeContextmenuFunction.call(this, d3.event, node);
  };

  // on lasso start function
  v.tools.onLassoStart = function(nodes){
    var data = {};
    data.nodes = nodes;
    data.numberOfNodes = nodes.size();
    data.numberOfSelectedNodes = 0;
    data.idsOfSelectedNodes = null;
    v.tools.log('Event lassostart triggered.');
    v.tools.triggerApexEvent(document.querySelector('#' + v.dom.containerId), 'net_gobrechts_d3_force_lassostart', data);
    if (typeof(v.conf.onLassoStartFunction) == 'function') v.conf.onLassoStartFunction.call(v.dom.svg, d3.event, data);
  };

  // on lasso end function
  v.tools.onLassoEnd = function(nodes){
    var data = {};
    data.nodes = nodes;
    data.numberOfNodes = nodes.size();
    data.numberOfSelectedNodes = 0;
    data.idsOfSelectedNodes = '';
    nodes.each(function(n){
      if (n.selected) {
        data.idsOfSelectedNodes += (n.ID + ':');
        data.numberOfSelectedNodes++;
      }
    });
    data.idsOfSelectedNodes = (data.idsOfSelectedNodes.length > 0 ? data.idsOfSelectedNodes.substr(0, data.idsOfSelectedNodes.length -1):null);
    v.tools.log('Event lassoend triggered.');
    v.tools.triggerApexEvent(document.querySelector('#' + v.dom.containerId), 'net_gobrechts_d3_force_lassoend', data);
    if (typeof(v.conf.onLassoEndFunction) == 'function') v.conf.onLassoEndFunction.call(v.dom.svg, d3.event, data);
  };

  // converter function for XML data
  v.tools.x2js = new X2JS( {attributePrefix:'none'} );

  // get inner width for the SVG parents element
  v.tools.getSvgParentInnerWidth = function(){
    var parent = d3.select( v.dom.svg.node().parentNode );
    return parseInt(parent.style('width')) -
      parseInt(parent.style('padding-left')) -
      parseInt(parent.style('padding-right')) -
      (v.dom.svg.style('border-width') ? parseInt(v.dom.svg.style('border-width')) : 1) * 2 ;
  };

  // get offset for an element relative to the document: http://javascript.info/tutorial/coordinates
  v.tools.getOffsetRect = function(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top  = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return { top: Math.round(top), left: Math.round(left) };
  };

  // create customize link
  v.tools.createCustomizeLink = function() {
    if (!v.conf.customize && (v.conf.debug || document.querySelector('#apex-dev-toolbar') || document.querySelector('#apexDevToolbar') )) {
      if (document.querySelector('#' + v.dom.containerId + ' svg text.link') === null) {
        v.dom.svg.append('svg:text')
          .attr('class', 'link')
          .attr('x', 5)
          .attr('y', 15)
          .attr('text-anchor', 'start')
          .text('Customize Me')
          .on('click', function () {
            render.customize(true);
          });
      }
    }
  };

  // remove customize link
  v.tools.removeCustomizeLink = function() {
    v.dom.svg.select('#' + v.dom.containerId + ' svg text.link').remove();
  };

  // dragability for customizing container
  v.tools.customizeDrag = d3.behavior.drag()
    .on('dragstart', function() {
        var mouseToBody = d3.mouse(document.body);
        v.conf.domCustomizePosition = v.tools.getOffsetRect(document.querySelector('#' + v.dom.containerId + '_customizing'));
        v.conf.domCustomizePosition.mouseLeft = mouseToBody[0] - v.conf.domCustomizePosition.left;
        v.conf.domCustomizePosition.mouseTop = mouseToBody[1] -  v.conf.domCustomizePosition.top;
    })
    .on('drag', function() {
        var mouseToBody = d3.mouse(document.body);
      v.conf.domCustomize
        .style('left', Math.max(0,
                                mouseToBody[0] - v.conf.domCustomizePosition.mouseLeft) + 'px')
        .style('top', Math.max(0,
                                mouseToBody[1] - v.conf.domCustomizePosition.mouseTop) + 'px');
    })
    .on('dragend', function(){
      //v.conf.domCustomizePosition = v.tools.getOffsetRect(document.querySelector('#' + v.dom.containerId + '_customizing'));
      v.conf.domCustomizePosition = v.tools.getOffsetRect(v.conf.domCustomize.node());
    });
  
  // customizing function
  v.tools.createCustomizeWizard = function(){
    if (v.conf.customize) {
      var tab, row, td, form, i = 0, tdConfObject, currentOption, valueInOptions;
      v.tools.removeCustomizeLink();
      // set initial position
      if (!v.conf.domCustomizePosition) {
        v.conf.domCustomizePosition = v.tools.getOffsetRect(v.dom.svg.node());
        v.conf.domCustomizePosition.left = v.conf.domCustomizePosition.left + v.conf.width + 8;
      }
      if (document.querySelector('#' + v.dom.containerId + '_customizing') !== null) {
        v.conf.domCustomize.remove();
      }
      v.conf.domCustomize = v.dom.container.append('div')
        .attr('id', v.dom.containerId + '_customizing')
        .attr('class', 'net_gobrechts_d3_force_customize')
        .style('left', v.conf.domCustomizePosition.left + 'px')
        .style('top', v.conf.domCustomizePosition.top + 'px');
      v.conf.domCustomize.append('span')
        .attr('class', 'drag')
        .call(v.tools.customizeDrag)
        .append('span')
        .attr('class', 'title')
        .text('Customize "' + v.dom.containerId + '"');
      v.conf.domCustomize.append('a')
        .attr('class', 'close focus')
        .attr('tabindex', 1)
        .text('Close')
        .on('click', function () {
          v.conf.customize = false;
          v.tools.removeCustomizeWizard();
          v.tools.createCustomizeLink();
        })
        .on('keydown', function () {
          if (d3.event.keyCode == 13) {
            v.conf.customize = false;
            v.tools.removeCustomizeWizard();
            v.tools.createCustomizeLink();
          }
        });
      tab = v.conf.domCustomize.append('table');
      for (var key in v.confDefaults) {
        if (v.confDefaults.hasOwnProperty(key)) {
          i += 1;
          row = tab.append('tr');
          row.append('td')
            .attr('class', 'label')
            .html('<a href="https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference#' +
            key.toLowerCase() + '" target="github_d3_force" tabindex="' + i + 100 + '">' +
            key + '</a>');
          td = row.append('td');
          form = td.append('select')
            .attr('id', v.dom.containerId + '_' + key)
            .attr('name', key)
            .attr('value', v.conf[key])
            .attr('tabindex', i + 1)
            .classed('warning', v.confDefaults[key].internal)
            .on('change', function () {
              v.conf.currentTabPosition = this.id;
              if (v.confDefaults[this.name].type == 'text') {
                v.conf[this.name] = this.options[this.selectedIndex].value;
              }
              else if (v.confDefaults[this.name].type == 'number') {
                v.conf[this.name] = parseFloat(this.options[this.selectedIndex].value);
              }
              else if (v.confDefaults[this.name].type == 'bool') {
                v.conf[this.name] = ( this.options[this.selectedIndex].value == 'true' );
              }
              render();
            });
          valueInOptions = false;
          v.confDefaults[key].options.forEach(function (option) {
            currentOption = option;
            form.append('option')
              .attr('value', option)
              .attr('selected', function () {
                if (v.confDefaults[key].type == 'text' || v.confDefaults[key].type == 'bool') {
                  if (currentOption == v.conf[key]) {
                    valueInOptions = true;
                    return 'selected';
                  }
                  else {
                    return null;
                  }
                }
                else if (v.confDefaults[key].type == 'number') {
                  if (parseFloat(currentOption) == v.conf[key]) {
                    valueInOptions = true;
                    return 'selected';
                  }
                  else {
                    return null;
                  }
                }
              })
              .text(option);
          });
          // append current value if not existing in default options
          if (!valueInOptions) {
            form.append('option')
              .attr('value', v.conf[key])
              .attr('selected', 'selected')
              .text(v.conf[key]);
            v.confDefaults[key].options.push(v.conf[key]);
          }
          // third column td only in the first row
          if (i == 1) {
            tdConfObject = row.append('td')
              .style('vertical-align', 'top')
              .style('padding-left', '5px');
          }
        }
      }
      // third column spans over all rows
      tdConfObject
        .attr('rowspan', i)
        .html('Your Configuration Object<br><textarea id="' + v.dom.containerId + '_conf_object" tabindex="' + 
        (i + 2) + '" readonly></textarea><br><br>' + 'Current Positions<br>' + '<textarea id="' + v.dom.containerId + 
        '_positions" tabindex="' + (i + 3) + '" readonly>' + 
        (v.status.forceRunning ? 'Force started - wait for end event to show positions...' : JSON.stringify(render.positions()) ) + 
        '</textarea><br><br>' + 'Debug Log (descending)<br>' + '<textarea id="' + v.dom.containerId + '_log" tabindex="' + 
        (i + 4) + '" readonly></textarea><br><br>' + 'Copyrights<br><br>' +
        '<a href="https://github.com/ogobrecht/d3-force-apex-plugin" target="github_d3_force" tabindex="' + (i + 5) + 
        '">D3 Force APEX Plugin</a> (' + v.version + ')<br>' +
        'Ottmar Gobrecht<br><br>' + '<a href="http://d3js.org" target="d3js_org" tabindex="' + (i + 6) + 
        '">D3.js</a> (' + d3.version + ')<br>' + 'Mike Bostock<br><br>' +
        '<a href="https://code.google.com/p/x2js/" target="code_google_com" tabindex="' + (i + 7) + 
        '">X2JS</a> (' + v.tools.x2js.getVersion() + ' modified)<br>' + 'Abdulla Abdurakhmanov<br><br>');
      v.conf.domCustomizeConfObject = d3.select('#' + v.dom.containerId + '_conf_object');
      v.conf.domCustomizePositions = d3.select('#' + v.dom.containerId + '_positions');
      v.conf.domCustomizeLog = d3.select('#' + v.dom.containerId + '_log');
      v.tools.createCustomizingConfObject();
      if (v.conf.currentTabPosition) document.getElementById(v.conf.currentTabPosition).focus();
      else document.querySelector('#' + v.dom.containerId + '_customizing select').focus();
    }
    else {
      v.tools.removeCustomizeWizard();
      v.tools.createCustomizeLink();
    }
  };

  v.tools.removeCustomizeWizard = function(){
    d3.select('#' + v.dom.containerId + '_customizing').remove();
  };
  
  v.tools.createCustomizingConfObject = function() {
    var conf = '{\n';
      for (var key in v.confDefaults) {
        if (v.confDefaults.hasOwnProperty(key)) {
          if (v.confDefaults[key].type == 'range'  ||
              v.confDefaults[key].type == 'number' ||
              v.confDefaults[key].type == 'bool'   ) {
            conf += '"' + key + '":' + v.conf[key] + ',\n';
          }
          else {
            conf += '"' + key + '":"' + v.conf[key] + '",\n';
          }
        }
      }
    conf = conf.substr(0, conf.length - 2) + '\n}';
    v.conf.domCustomizeConfObject.text(conf);
  };

  // check user agent: http://stackoverflow.com/questions/16135814/check-for-ie-10
  v.conf.userAgent = navigator.userAgent;
  v.conf.userAgent_IE_9_to_11 = false;
  // Hello IE 9 - 11
  if ( navigator.appVersion.indexOf("MSIE 9") !== -1 || 
       navigator.appVersion.indexOf("MSIE 10") !== -1 ||
       v.conf.userAgent.indexOf("Trident") !== -1 && v.conf.userAgent.indexOf("rv:11") !== -1 ) {
    v.conf.userAgent_IE_9_to_11 = true;
    v.tools.logError('Houston, we have a problem - user agent is IE 9, 10 or 11 - we have to provide a fix for markers: http://stackoverflow.com/questions/15588478/internet-explorer-10-not-showing-svg-path-d3-js-graph');
  }

  // create force reference
  v.force = d3.layout.force()
    .on('start', function(){
      v.tools.log('Force started.');
      if (v.conf.customize && v.conf.domCustomizePositions) v.conf.domCustomizePositions.text( 'Force started - wait for end event to show positions...' );
      v.status.forceTickCounter = 0;
      v.status.forceStartTime = new Date().getTime();
      v.status.forceRunning = true;
    })
    .on('tick', function() {
      // hello IE 9 - 11: http://stackoverflow.com/questions/15588478/internet-explorer-10-not-showing-svg-path-d3-js-graph
      if ( v.conf.userAgent_IE_9_to_11 && v.conf.showLinkDirection) {
        v.links.each( function(){ this.parentNode.insertBefore(this,this); });
        v.selfLinks.each( function(){ this.parentNode.insertBefore(this,this); });
      }
      v.selfLinks
        .attr('transform', function(l) { return 'translate(' + l.source.x + ',' + l.source.y + ')'; });
      v.links
        .attr('x1', function(l) { return v.tools.adjustSourceX(l); })
        .attr('y1', function(l) { return v.tools.adjustSourceY(l); })
        .attr('x2', function(l) { return v.tools.adjustTargetX(l); })
        .attr('y2', function(l) { return v.tools.adjustTargetY(l); });
      v.labels
        .attr('x', function(n) { return n.x; })
        .attr('y', function(n) { return n.y - n.radius - v.conf.labelDistance; });
      v.labelPaths
        .attr('transform', function(n) { return 'translate(' + n.x + ',' + n.y + ')'; });
      v.nodes
        .attr('cx', function(n) { return n.x; })
        .attr('cy', function(n) { return n.y; });
      v.status.forceTickCounter += 1;
    })
    .on('end', function(){
      v.status.forceRunning = false;
      var milliseconds = new Date().getTime() - v.status.forceStartTime;
      var seconds = (milliseconds / 1000).toFixed(1);
      var ticksPerSecond = Math.round(v.status.forceTickCounter / (milliseconds / 1000));
      var millisecondsPerTick = Math.round( milliseconds / v.status.forceTickCounter );
      if (v.conf.customize && v.conf.domCustomizePositions) v.conf.domCustomizePositions.text( JSON.stringify(render.positions()) );
      v.tools.log('Force ended.');
      v.tools.log(seconds + ' seconds, ' + v.status.forceTickCounter + ' ticks to cool down (' + 
        ticksPerSecond + ' ticks/s, ' + millisecondsPerTick + ' ms/tick).');
    });

  // create drag reference
  v.drag = v.force.drag();

  // create lasso reference
  v.lasso = d3.lasso()
    .closePathDistance(100)  // max distance for the lasso loop to be closed
    .closePathSelect(true)   // can items be selected by closing the path?
    .hoverSelect(true)       // can items by selected by hovering over them?
    .area(v.dom.svgOverlay); // area where the lasso can be started

  /*********************************************************************************************************************
   * RENDER FUNCTION - public name is "start" -> see also render.start method
   */

  function render (pData){
    var message, counter;
    v.status.graphStarted = true;
    
    v.tools.triggerApexEvent(document.querySelector('#' + v.dom.containerId), 'apexbeforerefresh');

    // if we start the rendering the first time and there is no input data, then provide sample data
    if (!pData && !v.status.graphReady){
      v.tools.logError('Houston, we have a problem - we have to provide sample data.');
      v.conf.sampleData = true;
      pData = v.data.sampleData;
    }
    else if (pData) {
      v.conf.sampleData = false;
    }

    // if we have incoming data, than we do our transformations here, otherwise we use the existing data
    if (pData) {
      
      if (v.status.graphReady) v.status.graphOldPositions = render.positions();

      // data is an object
      if (pData.constructor === Object) {
        v.data.dataStringConverted = pData;
        if (v.conf.debug) {
          v.tools.log('Data object:');
          v.tools.log(v.data.dataStringConverted, true);
        }
      }
      // data is a string
      else if (pData.constructor === String) {
        // convert incoming data depending on type
        if ( pData.trim().substr(0,1) == '<' ) {
          try { 
            v.data.dataStringConverted = v.tools.x2js.xml_str2json(pData); 
            if (v.data.dataStringConverted === null) {
              message = 'Unable to convert XML string.';
              v.tools.logError(message);
              v.data.dataStringConverted = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
            }
          }
          catch(e){ 
            message = 'Unable to convert XML string: ' + e.message + '.';
            v.tools.logError(message);
            v.data.dataStringConverted = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
          }
        }
        else if ( pData.trim().substr(0,1) == '{' ) {
          try { v.data.dataStringConverted = JSON.parse(pData); }
          catch(e){ 
            message = 'Unable to parse JSON string: ' + e.message + '.';
            v.tools.logError(message);
            v.data.dataStringConverted = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
          }
        }
        else {
          message = 'Your data string is not starting with "<" or "{" - parsing not possible.';
          v.tools.logError(message);
          v.data.dataStringConverted = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
        }
        if (v.conf.debug) {
          v.tools.log('Data string:');
          v.tools.log(pData, true);
          v.tools.log('Converted data object:');
          v.tools.log(v.data.dataStringConverted, true);
        }
      }
      // data has unknown format
      else {
        message = 'Unable to parse your data - input data can be a XML string, JSON string or JavaScript object.';
        v.tools.logError(message);
        v.data.dataStringConverted = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
      }
      
      // create references to our new data
      if (v.data.dataStringConverted !== null) {
        if (v.data.dataStringConverted.hasOwnProperty("data") && v.data.dataStringConverted.data !== null) {
          if (v.data.dataStringConverted.data.hasOwnProperty("nodes") && v.data.dataStringConverted.data.nodes !== null) {
            v.data.nodes = v.data.dataStringConverted.data.nodes;
            if (v.data.nodes.length == 0) {
              message = "Your data contains an empty nodes array.";
              v.tools.logError(message);
              v.data.nodes = [{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}];
            }
          }
          else {
            message = "Your data contains no nodes.";
            v.tools.logError(message);
            v.data.nodes = [{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}];
          }
          if (v.data.dataStringConverted.data.hasOwnProperty("links") && v.data.dataStringConverted.data.links !== null) {
            v.data.links = v.data.dataStringConverted.data.links;
          }
          else {
            v.data.links = [];
          }
        }
        else {
          message = "Missing root element named data.";
          v.tools.logError(message);
          v.data = {"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]};
        }
      }
      else {
        message = "Unable to parse your data - please consult the API reference for possible data formats.";
        v.tools.logError(message);
        v.data = {"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]};
      }

      v.tools.setRadiusFunction();
      
      // switch links to point to node objects instead of id's (needed for force layout) and calculate attributes
      v.data.id_lookup = []; // helper array to lookup node objects by id's
      v.data.nodes.forEach( function(n){
        n.SIZEVALUE = parseFloat(n.SIZEVALUE);                // convert size to float value
        n.LABELCIRCULAR = v.tools.parseBool(n.LABELCIRCULAR); // convert labelCircular to boolean
        if (n.fixed) n.fixed = v.tools.parseBool(n.fixed);    // convert fixed to boolean
        if (n.x) n.x = parseFloat(n.x);                       // convert X position to float value
        if (n.y) n.y = parseFloat(n.y);                       // convert Y position to float value
        v.data.id_lookup[n.ID] = n;                           // add object reference to lookup array
      });
      v.data.links.forEach( function(l, i) {
        l.source = v.data.id_lookup[l.FROMID]; // add attribute source as a node reference to the link
        l.target = v.data.id_lookup[l.TOID];   // add attribute target as a node reference to the link
      });
      
      // sort out links with invalid node references
      v.data.links = v.data.links.filter( function(l){ return typeof l.source != 'undefined' && typeof l.target != 'undefined'; });

      // create helper array to lookup if nodes are neighbors
      v.data.neighbors = v.data.links.map(function(l){ return l.FROMID + ':' + l.TOID; });

      // apply user provided positions once (new data has priority)
      if (v.conf.positions) {
        if (v.conf.positions.constructor === Array) {
          v.conf.positions.forEach(function (n) {
            if (v.data.id_lookup[n.ID] !== undefined) {
              if (!v.data.id_lookup[n.ID].fixed) v.data.id_lookup[n.ID].fixed = n.fixed;
              if (!v.data.id_lookup[n.ID].x) v.data.id_lookup[n.ID].x = v.data.id_lookup[n.ID].px = n.x;
              if (!v.data.id_lookup[n.ID].y) v.data.id_lookup[n.ID].y = v.data.id_lookup[n.ID].py = n.y;
            }
          });
        }
        else {
          v.tools.logError('Unable to set node positions: positions method parameter must be an array of node positions')
        }
      }
      // apply old positions (new data has priority - if graph was ready, than user provided positions are already present in old positions)
      // see also render.positions method
      else if (v.status.graphOldPositions){
        v.status.graphOldPositions.forEach(function (n) {
          if (v.data.id_lookup[n.ID] !== undefined) {
            if (!v.data.id_lookup[n.ID].fixed) v.data.id_lookup[n.ID].fixed = n.fixed;
            if (!v.data.id_lookup[n.ID].x) v.data.id_lookup[n.ID].x = v.data.id_lookup[n.ID].px = n.x;
            if (!v.data.id_lookup[n.ID].y) v.data.id_lookup[n.ID].y = v.data.id_lookup[n.ID].py = n.y;
          }
        });
      }
      // clear positions
      v.conf.positions = null;
      v.status.graphOldPositions = null;

    } //END: if (pData)
    
    // calculate nodes radius
    v.tools.setRadiusFunction();
    v.data.nodes.forEach( function(n){ n.radius = v.tools.radius(n.SIZEVALUE); }); 
    
    render.showBorder(v.conf.showBorder);

    render.useDomParentWidth(v.conf.useDomParentWidth);

    // LINKS
    v.links = v.dom.svg.selectAll('line.link')
      .data( v.data.links.filter( function(l) { return l.FROMID != l.TOID; } ),
             function(l){return l.FROMID + '_' + l.TOID;});
    v.links.enter().append('svg:line')
      .attr('class', 'link');
    v.links.exit().remove();
    // update all
    v.links
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.dom.containerId+'_normalTriangle)':null) )
      .classed('dashed', function(l){return(l.STYLE === 'dashed');});

    // SELFLINKS
    v.selfLinks = v.dom.svg.selectAll('path.link')
      .data( v.data.links.filter( function(l) { return l.FROMID == l.TOID && v.conf.showSelfLinks; } ),
             function(l){return l.FROMID + '_' + l.TOID;});
    v.selfLinks.enter().append('svg:path')
      .attr('id', function(l) { return v.dom.containerId + '_link_' + l.FROMID + '_' + l.TOID; })
      .attr('class', 'link');
    v.selfLinks.exit().remove();
    // update all
    v.selfLinks
      .attr('d', function(l) { return v.tools.getSelfLinkPath(l); })
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.dom.containerId+'_normalTriangle)':null) )
      .classed('dashed', function(l){return(l.STYLE == 'dashed');});

    // PATTERN for nodes with image attribute set
    v.patterns = v.dom.svgDefs.selectAll('pattern')
      .data( v.data.nodes.filter( function(n){return(n.IMAGE?true:false);} ), 
             function(n){return n.ID;} );
    v.patterns.enter().append('svg:pattern')
        .attr('id', function(n){ return v.dom.containerId + '_pattern_' + n.ID;})
      .append('svg:image');
    v.patterns.exit().remove();
    // update all
    v.patterns.each(function(n){
      d3.select(this)
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', function(n){ return n.radius * 2;})
        .attr('width', function(n){ return n.radius * 2;});
      d3.select(this.firstChild)
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', function(n){ return n.radius * 2;})
        .attr('width', function(n){ return n.radius * 2;})
        .attr('xlink:href', function(n){return n.IMAGE;});
    });

    // NODES
    v.nodes = v.dom.svg.selectAll('circle.node')
      .data( v.data.nodes, 
             function(n){return n.ID;});
    v.nodes.enter().append('svg:circle')
      .attr('class', 'node')
      .on('mouseenter', v.tools.onNodeMouseenter)
      .on('mouseleave', v.tools.onNodeMouseleave)
      .on('click', v.tools.onNodeClick)
      .on('dblclick', v.tools.onNodeDblclick)
      .on('contextmenu', v.tools.onNodeContextmenu);
    v.nodes.exit().remove();
    // update all
    v.nodes.attr('r', function(n){return n.radius;});


    // LABELS

    // normal text lables
      v.labels = v.dom.svg.selectAll('text.label')
      .data( v.data.nodes.filter( function(n) { return !n.LABELCIRCULAR && !v.conf.labelsCircular; } ),
             function(n){return n.ID;} );
    v.labels.enter().append('svg:text')
      .attr('class', 'label');
    v.labels.exit().remove();
    // update all
    v.labels.text( function(n){return n.LABEL;});

    // paths for circular labels
    v.labelPaths = v.dom.svgDefs.selectAll('path.label')
      .data( v.data.nodes.filter( function(n) { return n.LABELCIRCULAR || v.conf.labelsCircular ; } ),
             function(n){return n.ID;} );
    v.labelPaths.enter().append('svg:path')
      .attr('id', function(n){ return v.dom.containerId + '_textPath_' + n.ID;})
      .attr('class', 'label');
    v.labelPaths.exit().remove();
    // update all
    v.labelPaths.attr('d', function(n){return v.tools.getLabelPath(n);});

    // circular labels
    v.labelsCircular = v.dom.svg.selectAll('text.labelCircular')
      .data( v.data.nodes.filter( function(n) { return n.LABELCIRCULAR || v.conf.labelsCircular; } ),
             function(n){return n.ID;} );
    v.labelsCircular.enter().append('svg:text')
        .attr('class', 'labelCircular')
      .append('svg:textPath')
        .attr('xlink:href', function(n){return '#' + v.dom.containerId + '_textPath_' + n.ID;});
    v.labelsCircular.exit().remove();
    // update all
    v.labelsCircular.each(function(n){ d3.select(this.firstChild).text(n.LABEL); });
    
    render.colorScheme(v.conf.colorScheme);

    render.debug(v.conf.debug);
    
    render.alignFixedNodesToGrid(v.conf.alignFixedNodesToGrid); 
    
    render.dragMode(v.conf.dragMode);

    render.pinMode(v.conf.pinMode);

    render.lassoMode(v.conf.lassoMode);
    
    // START VISUALIZATION
    v.dom.svg
      .attr('width', (v.conf.useDomParentWidth ? v.dom.containerWidth : v.conf.width))
      .attr('height', v.conf.height);
    v.dom.svgOverlay
      .attr('width', (v.conf.useDomParentWidth ? v.dom.containerWidth : v.conf.width))
      .attr('height', v.conf.height);
    v.force
      .nodes(v.data.nodes)
      .links(v.data.links)
      .size([(v.conf.useDomParentWidth ? v.dom.containerWidth : v.conf.width),v.conf.height])
      .friction(v.conf.friction)
      .charge(v.conf.charge)
      .theta(v.conf.theta)
      .gravity(v.conf.gravity)
      .linkDistance(v.conf.linkDistance)
      .linkStrength(v.conf.linkStrength)
      .start();

    render.autoRefresh(v.conf.autoRefresh);

    if (v.conf.customize) v.tools.createCustomizeWizard();
    else v.tools.createCustomizeLink();
    
    v.status.graphReady = true;
    
    v.tools.triggerApexEvent(document.querySelector('#' + v.dom.containerId), 'apexafterrefresh');

  } //END function render


  /*********************************************************************************************************************
   * Public functions
   */

  // public start function: get data and start visualization
  render.start = function(pData){
    var firstChar;
    // try to use the input data - this means also, we can overwrite the data from APEX with raw data (textarea or whatever you like...)
    if (pData) {
      render(pData);
    }
    // if we have no data, then we try to use the APEX context (if APEX plugin ID is set)
    else if ( v.conf.apexPluginId ) {
      apex.server.plugin(
        v.conf.apexPluginId,
        { p_debug: $v('pdebug'),
          pageItems: v.conf.apexPageItemsToSubmit.split(",")
        },
        { success: function(dataString){
            // dataString starts NOT with "<" or "{", when there are no queries defined in APEX or
            // when the queries returns empty data or when a error occurs on the APEX backend side
            firstChar = dataString.trim().substr(0,1);
            if ( firstChar == '<' || firstChar == '{' ) {
              render(dataString);
            }
            else if (dataString.trim().substr(0,16) == "no_query_defined") {
              render(); // this will keep the old data or using the sample data, if no old data existing
              v.tools.logError('No query defined.');
            }
            else if (dataString.trim().substr(0,22) == "query_returned_no_data") {
              render('{"data":{"nodes":[{"ID":"1","LABEL":"ERROR: No data.","COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}}');
              v.tools.logError('Query returned no data.');
            }
            else {
              render('{"data":{"nodes":[{"ID":"1","LABEL":"ERROR: ' + dataString + '.","COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}}');
              v.tools.logError(dataString);
            }
          },
          error: function(xhr, status, errorThrown){
            render('{"data":{"nodes":[{"ID":"1","LABEL":"AJAX call terminated with errors.","COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}}');
            v.tools.logError('AJAX call terminated with errors: ' + errorThrown + '.');
          },
          dataType: 'text'
        }
      );
    }
    // if we have no raw data and no APEX context, then we start to render without data (the render function will then provide sample data)
    else {
      render();
    }
    return render;
  };

  render.render = function(pData) {
    render(pData);
    return render;
  };
  
  render.resume = function() {
    v.force.resume();
    if (v.conf.customize) v.tools.createCustomizeWizard();
    return render;
  };

  render.showBorder = function(value) {
    if (!arguments.length) return v.conf.showBorder;
    v.conf.showBorder = value;
    if (v.status.graphStarted) {
      v.dom.svg.classed('border', v.conf.showBorder);
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.showSelfLinks = function(value) {
    if (!arguments.length) return v.conf.showSelfLinks;
    v.conf.showSelfLinks = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.showLinkDirection = function(value) {
    if (!arguments.length) return v.conf.showLinkDirection;
    v.conf.showLinkDirection = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.showTooltips = function(value) {
    if (!arguments.length) return v.conf.showTooltips;
    v.conf.showTooltips = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.tooltipPosition = function(value) {
    if (!arguments.length) return v.conf.tooltipPosition;
    v.conf.tooltipPosition = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.colorScheme = function(value) {
    if (!arguments.length) return v.conf.colorScheme;
    v.conf.colorScheme = value;
    if (v.status.graphStarted) {
      if      (v.conf.colorScheme == 'color20')  { v.tools.color = d3.scale.category20();  }
      else if (v.conf.colorScheme == 'color20b') { v.tools.color = d3.scale.category20b(); }
      else if (v.conf.colorScheme == 'color20c') { v.tools.color = d3.scale.category20c(); }
      else if (v.conf.colorScheme == 'color10')  { v.tools.color = d3.scale.category10();  }
      else if (v.conf.colorScheme == 'direct')   { v.tools.color = function(d){return d;}; }
      else {   
        v.conf.colorScheme = 'color20';     
        v.tools.color = d3.scale.category20();  
      }
      v.nodes
        .style('fill', null) // to delete the color first, otherwise new invalid colors are not reseted to black
        .style('fill', function(n){return (n.IMAGE?'url(#'+v.dom.containerId+'_pattern_'+n.ID+')':v.tools.color(n.COLORVALUE));});
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.labelsCircular = function(value) {
    if (!arguments.length) return v.conf.labelsCircular;
    v.conf.labelsCircular = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.dragMode = function(value) {
    if (!arguments.length) return v.conf.dragMode;
    v.conf.dragMode = value;
    if (v.status.graphStarted) {
      if (v.conf.dragMode) {
        v.nodes.call(v.drag);
      }
      else {
        // http://stackoverflow.com/questions/13136355/d3-js-remove-force-drag-from-a-selection
        v.nodes.on('mousedown.drag', null);
      }
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.pinMode = function(value) {
    if (!arguments.length) return v.conf.pinMode;
    v.conf.pinMode = value;
    if (v.status.graphStarted) {
      if (v.conf.pinMode) {
        v.drag.on('dragstart', function (n) {
          d3.select(this).classed('fixed', n.fixed = 1);
        });
      }
      else {
        v.drag.on('dragstart', null);
      }
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.lassoMode = function(value) {
    if (!arguments.length) return v.conf.lassoMode;
    v.conf.lassoMode = value;
    if (v.status.graphStarted) {
      if (v.conf.lassoMode) {
        v.dom.svg.call(v.lasso);
        v.lasso.items(v.nodes);  //v.dom.svg.selectAll("circle.node"));
        v.lasso.on("start", function(){
          v.lasso.items().classed("selected",false);
          v.tools.onLassoStart(v.lasso.items());
        });
        v.lasso.on("draw", function() {
          v.lasso.items().filter(function(d) {return d.possible===true})
            .classed("selected", true);
          v.lasso.items().filter(function(d) {return d.possible===false})
            .classed("selected", false);
        });
        v.lasso.on("end", function() {
          v.lasso.items().filter(function(d) {return d.selected===true})
            .classed("selected", true);
          v.lasso.items().filter(function(d) {return d.selected===false})
            .classed("selected", false);
          v.tools.onLassoEnd(v.lasso.items());
        });
      }
      else {
        v.dom.svgOverlay.on('mousedown.drag', null);
        v.nodes.classed("selected", false);
      }
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };
  
  render.alignFixedNodesToGrid = function(value) {
    if (!arguments.length) return v.conf.alignFixedNodesToGrid;
    v.conf.alignFixedNodesToGrid = value;
    if (v.status.graphStarted) {
      // align fixed nodes to grid
      if (v.conf.alignFixedNodesToGrid) {
        v.nodes.each(function(n) {
          if (n.fixed) {
            n.x = n.px = v.tools.getNearestGridPosition(n.x, v.conf.width);
            n.y = n.py = v.tools.getNearestGridPosition(n.y, v.conf.height);
          }
        });
        v.drag.on('dragend', function (n) {
          n.x = n.px = v.tools.getNearestGridPosition(n.x, v.conf.width);
          n.y = n.py = v.tools.getNearestGridPosition(n.y, v.conf.height);
        });
      }
      else {
        v.drag.on('dragend', null);
      }
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };
  
  render.moveFixedNodes = function(x,y) {
    if (v.status.graphStarted) {
      if (!x) x = 0;
      if (!y) y = 0;
      if (x != 0 || y != 0) {
        v.nodes.each(function (n) {
          if (n.fixed) {
            n.x = n.px = (v.conf.alignFixedNodesToGrid ? v.tools.getNearestGridPosition(n.x + x, v.conf.width) : n.x + x);
            n.y = n.py = (v.conf.alignFixedNodesToGrid ? v.tools.getNearestGridPosition(n.y + y, v.conf.width) : n.y + y);
          }
        });
      }
    }
    return render;
  };

  render.gridSize = function(value) {
    if (!arguments.length) return v.conf.gridSize;
    v.conf.gridSize = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.nodeEventToStopPinMode = function(value) {
    if (!arguments.length) return v.conf.nodeEventToStopPinMode;
    v.conf.nodeEventToStopPinMode = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.onNodeContextmenuPreventDefault = function(value) {
    if (!arguments.length) return v.conf.onNodeContextmenuPreventDefault;
    v.conf.onNodeContextmenuPreventDefault = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.nodeEventToOpenLink = function(value) {
    if (!arguments.length) return v.conf.nodeEventToOpenLink;
    v.conf.nodeEventToOpenLink = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.nodeLinkTarget = function(value) {
    if (!arguments.length) return v.conf.nodeLinkTarget;
    v.conf.nodeLinkTarget = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.autoRefresh = function(value) {
    if (!arguments.length) return v.conf.autoRefresh;
    v.conf.autoRefresh = value;
    if (v.status.graphStarted) {
      if (v.conf.autoRefresh && v.conf.refreshInterval && !v.conf.interval) {
        v.conf.interval = window.setInterval( function(){render.start();}, v.conf.refreshInterval );
        v.tools.log('Auto refresh started with an interval of ' + v.conf.refreshInterval + ' milliseconds.');
      }
      else if (!v.conf.autoRefresh && v.conf.interval){
        clearInterval(v.conf.interval);
        v.conf.interval = null;
        v.tools.log('Auto refresh stopped.');
      }
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.refreshInterval = function(value) {
    if (!arguments.length) return v.conf.refreshInterval;
    v.conf.refreshInterval = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.useDomParentWidth = function(value) {
    if (!arguments.length) return v.conf.useDomParentWidth;
    v.conf.useDomParentWidth = value;
    if (v.status.graphStarted) {
      if (v.conf.useDomParentWidth) {
        v.dom.containerWidth = v.tools.getSvgParentInnerWidth();
        d3.select(window).on('resize', function(){
          var old_width = v.dom.containerWidth;
          var new_width = v.tools.getSvgParentInnerWidth();
          if (old_width !== new_width) {
            v.dom.containerWidth = new_width;
            render();
          }
        });
      } 
      else {
        d3.select(window).on('resize', null);
      }
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.width = function(value) {
    if (!arguments.length) return v.conf.width;
    v.conf.width = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.height = function(value) {
    if (!arguments.length) return v.conf.height;
    v.conf.height = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.minNodeRadius = function(value) {
    if (!arguments.length) return v.conf.minNodeRadius;
    v.conf.minNodeRadius = value;
    if (v.status.graphReady) {
      v.tools.setRadiusFunction();
      v.nodes.each( function(n){n.radius = v.tools.radius(n.SIZEVALUE);});
      v.nodes.attr('r', function(n){return n.radius;});
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.maxNodeRadius = function(value) {
    if (!arguments.length) return v.conf.maxNodeRadius;
    v.conf.maxNodeRadius = value;
    if (v.status.graphReady) {
      v.tools.setRadiusFunction();
      v.nodes.each( function(n){n.radius = v.tools.radius(n.SIZEVALUE);});
      v.nodes.attr('r', function(n){return n.radius;});
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.labelDistance = function(value) {
    if (!arguments.length) return v.conf.labelDistance;
    v.conf.labelDistance = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.selfLinkDistance = function(value) {
    if (!arguments.length) return v.conf.selfLinkDistance;
    v.conf.selfLinkDistance = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.linkDistance = function(value) {
    if (!arguments.length) return v.conf.linkDistance;
    v.conf.linkDistance = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.charge = function(value) {
    if (!arguments.length) return v.conf.charge;
    v.conf.charge = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.gravity = function(value) {
    if (!arguments.length) return v.conf.gravity;
    v.conf.gravity = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.chargeDistance = function(value) {
    if (!arguments.length) return v.conf.chargeDistance;
    v.conf.chargeDistance = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.linkStrength = function(value) {
    if (!arguments.length) return v.conf.linkStrength;
    v.conf.linkStrength = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.friction = function(value) {
    if (!arguments.length) return v.conf.friction;
    v.conf.friction = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.theta = function(value) {
    if (!arguments.length) return v.conf.theta;
    v.conf.theta = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
    }
    return render;
  };

  render.positions = function(value){
    if (!arguments.length){
      var positions = [];
      v.data.nodes.forEach( function(n){
        positions.push( {"ID":n.ID,"x":Math.round(n.x),"y":Math.round(n.y),"fixed":( n.fixed ? 1 : 0)} );
      });
      return positions;
    }
    else {
      if (v.status.graphReady) {
        if (value.constructor === Array) {
          value.forEach(function (n) {
            if (v.data.id_lookup[n.ID] !== undefined) {
              v.data.id_lookup[n.ID].fixed = v.tools.parseBool(n.fixed);
              v.data.id_lookup[n.ID].x = v.data.id_lookup[n.ID].px = n.x;
              v.data.id_lookup[n.ID].y = v.data.id_lookup[n.ID].py = n.y;
            }
          });
        }
        else {
          v.tools.logError('Unable to set node positions: positions method parameter must be an array of node positions')
        }
      }
      else {
        v.conf.positions = value; // we do positioning later after start() is called
      }
      return render;
    }
  };

  render.onNodeMouseenterFunction = function(value) {
    if (!arguments.length) return v.conf.onNodeMouseenterFunction;
    v.conf.onNodeMouseenterFunction = value;
    return render;
  };

  render.onNodeMouseleaveFunction = function(value) {
    if (!arguments.length) return v.conf.onNodeMouseleaveFunction;
    v.conf.onNodeMouseleaveFunction = value;
    return render;
  };

  render.onNodeClickFunction = function(value) {
    if (!arguments.length) return v.conf.onNodeClickFunction;
    v.conf.onNodeClickFunction = value;
    return render;
  };

  render.onNodeDblclickFunction = function(value) {
    if (!arguments.length) return v.conf.onNodeDblclickFunction;
    v.conf.onNodeDblclickFunction = value;
    return render;
  };

  render.onNodeContextmenuFunction = function(value) {
    if (!arguments.length) return v.conf.onNodeContextmenuFunction;
    v.conf.onNodeContextmenuFunction = value;
    return render;
  };

  render.onLassoStartFunction = function(value) {
    if (!arguments.length) return v.conf.onLassoStartFunction;
    v.conf.onLassoStartFunction = value;
    return render;
  };

  render.onLassoEndFunction = function(value) {
    if (!arguments.length) return v.conf.onLassoEndFunction;
    v.conf.onLassoEndFunction = value;
    return render;
  };
  
  render.sampleData = function(value){
    if (!arguments.length) return v.data.sampleData;
    v.data.sampleData = value;
    return render;
  };
  
  render.data = function(){
    return v.data.dataStringConverted;
  };
  
  render.customize = function(value) {
    if (!arguments.length) return v.conf.customize;
    v.conf.customize = value;
    if (v.status.graphStarted) {
      if (v.conf.customize) v.tools.createCustomizeWizard();
      else v.tools.removeCustomizeWizard();
    }
    return render;
  };

  render.debug = function(value) {
    if (!arguments.length) return v.conf.debug;
    v.conf.debug = value;
    if (v.status.graphStarted) {
      if (v.conf.debug) v.tools.createCustomizeLink();
      else v.tools.removeCustomizeLink();
    }
    return render;
  };

  render.releaseFixedNodes = function() {
    if (v.status.graphStarted) v.nodes.each(function(n){n.fixed = 0;});
    return render;
  };  

  render.userAgent = function(){
    return v.conf.userAgent;
  };
  
  // public inspect function: to inspect the global object, which holds all data, functions and references
  render.inspect = function(){
    return v;
  };

  render.version = function(){
    return v.version;
  };

  /*********************************************************************************************************************
   * Startup code - runs one time after the initialization of a new chart - example:
   * var myChart = net_gobrechts_d3_force( pDomContainerId, pConf, pApexPluginId ).start();
   */

  // bind to the apexrefresh event, so that this region can be refreshed by a dynamic action
  if (v.conf.apexPluginId) {
    apex.jQuery('#' + v.dom.containerId).bind('apexrefresh', function(){render.start();} );
  }

  // final return
  return render;

}
