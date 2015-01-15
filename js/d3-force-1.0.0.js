function net_gobrechts_d3_force ( pDomContainerId, pOptions, pApexPluginId ) {

  "use strict";

  /*************************************************************************
   * Setup Configuration
   */

  // create global object
  var v = {"version":"1.0.0"};
  v.conf = {};
  v.data = {};
  v.tools = {};

  // save parameter for later use
  v.conf.domContainerId = pDomContainerId || 'd3Force' + Math.floor(Math.random()*1000000);
  v.confUser            = pOptions || {};
  v.conf.apexPluginId   = pApexPluginId;

  // configure debug mode for APEX, can be overwritten by configuration object
  v.conf.debugPrefix    = 'D3 Force in DOM container #' + v.conf.domContainerId + ': ';
  if ( v.conf.apexPluginId && apex.jQuery('#pdebug').length == 1 ) {
    v.conf.debug = true;
  }
  else {
    v.conf.debug = false;
  }

  // default configuration
  v.confDefaults = {
    "showBorder":{"type":"bool", "val":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#showBorder"},
    "showSelfLinks":{"type":"bool", "val":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#showSelfLinks"},
    "showLinkDirection":{"type":"bool", "val":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#showLinkDirection"},
    "showTooltips":{"type":"bool", "val":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#showTooltips"},
    "tooltipPosition":{"type":"select", "val":"node", "options":["node","svgTopLeft","svgTopRight"], "link":"https://github.com/ogobrecht/d3-force-apex-plugin#tooltipPosition"},
    "colorScheme":{"type":"select", "val":"color20", "options":["color20","color20b","color20c","color10","direct"], "link":"https://github.com/ogobrecht/d3-force-apex-plugin#colorScheme"},
    "labelsCircular":{"type":"bool", "val":false, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#labelsCircular"},
    "dragMode":{"type":"bool", "val":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#dragMode"},
    "pinMode":{"type":"bool", "val":false, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#pinMode"},
    "nodeEventToStopPinMode":{"type":"select", "val":"contextmenu", "options":["none","dblclick","contextmenu"], "link":"https://github.com/ogobrecht/d3-force-apex-plugin#nodeEventToStopPinMode"},
    "onNodeContextmenuPreventDefault":{"type":"bool", "val":false, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#onNodeContextmenuPreventDefault"},
    "nodeEventToOpenLink":{"type":"select", "val":"dblclick", "options":["none","click","dblclick","contextmenu"], "link":"https://github.com/ogobrecht/d3-force-apex-plugin#nodeEventToOpenLink"},
    "nodeLinkTarget":{"type":"text", "val":"_blank", "link":"https://github.com/ogobrecht/d3-force-apex-plugin#nodeLinkTarget"},
    "autoRefresh":{"type":"bool", "val":false, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#autoRefresh"},
    "refreshInterval":{"type":"number", "val":5000, "min":3000, "max":60000, "step":1000, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#refreshInterval"},
    "useDomParentWidth":{"type":"bool", "val":false, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#useDomParentWidth"},
    "width":{"type":"range", "val":500, "min":300, "max":1200, "step":50, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#width"},
    "height":{"type":"range", "val":500, "min":300, "max":1200, "step":50, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#height"},
    "minNodeRadius":{"type":"range", "val":6, "min":3, "max":12, "step":1, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#minNodeRadius"},
    "maxNodeRadius":{"type":"range", "val":18, "min":12, "max":36, "step":2, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#maxNodeRadius"},
    "labelDistance":{"type":"range", "val":12, "min":2, "max":20, "step":2, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#labelDistance"},
    "selfLinkDistance":{"type":"range", "val":20, "min":10, "max":30, "step":2, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#selfLinkDistance"},
    "linkDistance":{"type":"range", "val":80, "min":20, "max":120, "step":10, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#linkDistance"},
    //"chargeDistance":{"type":"number", "val":null, "min":300, "max":3000, "step":100, "internal":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#chargeDistance"},
    "charge":{"type":"range", "val":-350, "min":-1000, "max":0, "step":50, "internal":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#charge"},
    "gravity":{"type":"range", "val":0.1, "min":0, "max":1, "step":0.05, "internal":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#gravity"},
    "linkStrength":{"type":"range", "val":1, "min":0, "max":1, "step":0.05, "internal":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#linkStrength"},
    "friction":{"type":"range", "val":0.9, "min":0, "max":1, "step":0.05, "internal":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#friction"},
    "theta":{"type":"range", "val":0.8, "min":0, "max":1, "step":0.05, "internal":true, "link":"https://github.com/ogobrecht/d3-force-apex-plugin#theta"}
  };

  // create intial configuration
  v.conf.customize                       = false;
  v.conf.debug                           = v.confUser.debug                           || false;
  v.conf.width                           = v.confUser.width                           || v.confDefaults.width.val;
  v.conf.height                          = v.confUser.height                          || v.confDefaults.height.val;
  v.conf.minNodeRadius                   = v.confUser.minNodeRadius                   || v.confDefaults.minNodeRadius.val;
  v.conf.maxNodeRadius                   = v.confUser.maxNodeRadius                   || v.confDefaults.maxNodeRadius.val;
  v.conf.linkDistance                    = v.confUser.linkDistance                    || v.confDefaults.linkDistance.val;
  v.conf.selfLinkDistance                = v.confUser.selfLinkDistance                || v.confDefaults.selfLinkDistance.val;
  v.conf.labelDistance                   = v.confUser.labelDistance                   || v.confDefaults.labelDistance.val;
  v.conf.colorScheme                     = v.confUser.colorScheme                     || v.confDefaults.colorScheme.val;
  v.conf.useDomParentWidth               = v.confUser.useDomParentWidth               || v.confDefaults.useDomParentWidth.val;
  v.conf.showBorder                      = v.confUser.showBorder                      || v.confDefaults.showBorder.val;
  v.conf.showSelfLinks                   = v.confUser.showSelfLinks                   || v.confDefaults.showSelfLinks.val;
  v.conf.showLinkDirection               = v.confUser.showLinkDirection               || v.confDefaults.showLinkDirection.val;
  v.conf.showTooltips                    = v.confUser.showTooltips                    || v.confDefaults.showTooltips.val;
  v.conf.tooltipPosition                 = v.confUser.tooltipPosition                 || v.confDefaults.tooltipPosition.val;
  v.conf.labelsCircular                  = v.confUser.labelsCircular                  || v.confDefaults.labelsCircular.val;
  v.conf.dragMode                        = v.confUser.dragMode                        || v.confDefaults.dragMode.val;
  v.conf.pinMode                         = v.confUser.pinMode                         || v.confDefaults.pinMode.val;
  v.conf.nodeEventToStopPinMode          = v.confUser.nodeEventToStopPinMode          || v.confDefaults.nodeEventToStopPinMode.val;
  v.conf.nodeEventToOpenLink             = v.confUser.nodeEventToOpenLink             || v.confDefaults.nodeEventToOpenLink.val;
  v.conf.onNodeMouseenterFunction        = v.confUser.onNodeMouseenterFunction        || null;
  v.conf.onNodeMouseleaveFunction        = v.confUser.onNodeMouseleaveFunction        || null;
  v.conf.onNodeClickFunction             = v.confUser.onNodeClickFunction             || null;
  v.conf.onNodeDblclickFunction          = v.confUser.onNodeDblclickFunction          || null;
  v.conf.onNodeContextmenuFunction       = v.confUser.onNodeContextmenuFunction       || null;
  v.conf.onNodeContextmenuPreventDefault = v.confUser.onNodeContextmenuPreventDefault || v.confDefaults.onNodeContextmenuPreventDefault.val;
  v.conf.autoRefresh                     = v.confUser.autoRefresh                     || v.confDefaults.autoRefresh.val;
  v.conf.refreshInterval                 = v.confUser.refreshInterval                 || v.confDefaults.refreshInterval.val;
  v.conf.nodeLinkTarget                  = v.confUser.nodeLinkTarget                  || v.confDefaults.nodeLinkTarget.val;
  v.conf.charge                          = v.confUser.charge                          || v.confDefaults.charge.val;
  v.conf.chargeDistance                  = v.confUser.chargeDistance                  || null;
  v.conf.linkStrength                    = v.confUser.linkStrength                    || v.confDefaults.linkStrength.val;
  v.conf.friction                        = v.confUser.friction                        || v.confDefaults.friction.val;
  v.conf.theta                           = v.confUser.theta                           || v.confDefaults.theta.val;
  v.conf.gravity                         = v.confUser.gravity                         || v.confDefaults.gravity.val;

  v.conf.sampleData       = false;
  v.data.sampleData       = '<data>' +
    '<nodes ID="7839" LABEL="KING is THE KING, you know?" COLORVALUE="10" SIZEVALUE="5000" LABELCIRCULAR="true" LINK="http://apex.oracle.com/"' +
    ' INFOSTRING="This visualization is based on the well known emp table." />' +
    '<nodes ID="7698" LABEL="BLAKE" COLORVALUE="30" SIZEVALUE="2850"/>' +
    '<nodes ID="7782" LABEL="CLARK" COLORVALUE="10" SIZEVALUE="2450"/>' +
    '<nodes ID="7566" LABEL="JONES" COLORVALUE="20" SIZEVALUE="2975"/>' +
    '<nodes ID="7788" LABEL="SCOTT" COLORVALUE="20" SIZEVALUE="3000"/>' +
    '<nodes ID="7902" LABEL="FORD" COLORVALUE="20" SIZEVALUE="3000"/>' +
    '<nodes ID="7369" LABEL="SMITH" COLORVALUE="20" SIZEVALUE="800"/>' +
    '<nodes ID="7499" LABEL="ALLEN" COLORVALUE="30" SIZEVALUE="1600"/>' +
    '<nodes ID="7521" LABEL="WARD" COLORVALUE="30" SIZEVALUE="1250"/>' +
    '<nodes ID="7654" LABEL="MARTIN" COLORVALUE="30" SIZEVALUE="1250"/>' +
    '<nodes ID="7844" LABEL="TURNER" COLORVALUE="30" SIZEVALUE="1500"/>' +
    '<nodes ID="7876" LABEL="ADAMS" COLORVALUE="20" SIZEVALUE="1100"/>' +
    '<nodes ID="7900" LABEL="JAMES" COLORVALUE="30" SIZEVALUE="950"/>' +
    '<nodes ID="7934" LABEL="MILLER" COLORVALUE="10" SIZEVALUE="1300"/>' +
    '<nodes ID="8888" LABEL="Who am I?" COLORVALUE="green" SIZEVALUE="2000" INFOSTRING="This is a good question. Think about it." />' +
    '<nodes ID="9999" LABEL="Where I am?" COLORVALUE="#f00" SIZEVALUE="1000" INFOSTRING="This is a good question. What do you think?" />' +
    '<links FROMID="7839" TOID="7839" STYLE="dashed"/>' +
    '<links FROMID="7698" TOID="7839" STYLE="solid"/>' +
    '<links FROMID="7782" TOID="7839" STYLE="solid"/>' +
    '<links FROMID="7566" TOID="7839" STYLE="solid"/>' +
    '<links FROMID="7788" TOID="7566" STYLE="solid"/>' +
    '<links FROMID="7902" TOID="7566" STYLE="solid"/>' +
    '<links FROMID="7369" TOID="7902" STYLE="solid"/>' +
    '<links FROMID="7499" TOID="7698" STYLE="solid"/>' +
    '<links FROMID="7521" TOID="7698" STYLE="solid"/>' +
    '<links FROMID="7654" TOID="7698" STYLE="solid"/>' +
    '<links FROMID="7844" TOID="7698" STYLE="solid"/>' +
    '<links FROMID="7876" TOID="7788" STYLE="solid"/>' +
    '<links FROMID="7900" TOID="7698" STYLE="solid"/>' +
    '<links FROMID="7934" TOID="7782" STYLE="solid"/>' +
    '</data>';


  /*************************************************************************
   * Setup DOM
   */

  // create DOM container element, if not existing (if we have an APEX context, it is already created from the APEX engine )
  if ( document.querySelector('#' + v.conf.domContainerId) === null ){
    v.conf.domContainer = d3.select('body').append('div')
      .attr('id', v.conf.domContainerId);
  }
  else {
    v.conf.domContainer = d3.select('#' + v.conf.domContainerId);
    d3.selectAll('#' + v.conf.domContainerId + '_tooltip, #' + v.conf.domContainerId + '_customizing').remove();
  }

  // create SVG element, if not existing (if we have an APEX context, it is already created from the APEX engine )
  if ( document.querySelector('#' + v.conf.domContainerId + ' svg') === null ){
    v.conf.domSvg = v.conf.domContainer.append('svg');
  }
  else {
    v.conf.domSvg = d3.select('#' + v.conf.domContainerId + ' svg');
    d3.select('#' + v.conf.domContainerId + ' svg defs').remove();
  }

  // configure SVG element
  v.conf.domSvg
    .attr('id', v.conf.domContainerId + '_svg')
    .attr('class', 'net_gobrechts_d3_force')
    .classed('border', v.conf.showBorder)
    .attr('width', v.conf.width)
    .attr('height', v.conf.height);

  // create definitions element inside the SVG element
  v.conf.domSvgDefs = v.conf.domSvg.append('defs');

  // create marker definitions
  v.conf.domSvgDefs
    .append('svg:marker')
    .attr('id', 'blackTriangle')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 10)
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .attr('markerUnits', 'strokeWidth')
    .attr('fill', '#555')
    .append('svg:path')
    .attr('d', 'M0,0 L10,5 L0,10');

  v.conf.domSvgDefs
    .append('svg:marker')
    .attr('id', 'greyTriangle')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 10)
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .attr('markerUnits', 'strokeWidth')
    .attr('fill', '#bbb')
    .append('svg:path')
    .attr('d', 'M0,0 L10,5 L0,10');

  // create tooltip container
  v.conf.domTooltip = v.conf.domContainer.append('div')
      .attr('id', v.conf.domContainerId + '_tooltip')
      .attr('class', 'net_gobrechts_d3_force_tooltip')
      .style('top', '0px')
      .style('left', '0px');


  /*************************************************************************
   * Setup Helper Functions
   */

  // log function for debug mode
  v.tools.log = function(message, omitDebugPrefix) {
    if (v.conf.debug){
      if (omitDebugPrefix) {
        console.log(message);
      }
      else {
        console.log( v.conf.debugPrefix + message);
      }
    }
  };

  // log error function
  v.tools.logError = function(message, omitDebugPrefix) {
    console.log( v.conf.debugPrefix + 'ERROR: ' + message);
  };

  // trigger APEX events, if we have an APEX context
  v.tools.triggerApexEvent = function(domNode, event, data) {
    if (v.conf.apexPluginId) apex.event.trigger(domNode, event, data);
  };

  // check, if two nodes are neighbors
  v.tools.neighboring = function (a, b) {
    return ( v.data.neighbors.indexOf(a.ID+':'+b.ID) > -1 ||
             v.data.neighbors.indexOf(b.ID+':'+a.ID) > -1 );
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
    var win = window.open(node.LINK, v.conf.nodeLinkTarget);
    win.focus();
  };

  // on node mouse enter function
  v.tools.onNodeMouseenter = function(node){
    var position;
    v.nodes.classed('highlight', function(n){ return v.tools.neighboring(n, node); });
    v.links.classed('highlight', function(l){ return l.source.ID == node.ID || l.target.ID == node.ID;});
    v.selfLinks.classed('highlight', function(l){ return l.FROMID == node.ID; });
    d3.select(this).classed('highlight', true);
    v.tools.log('Event mouseenter triggered');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_mouseenter', node);
    if (typeof(v.conf.onNodeMouseenterFunction) == 'function') v.conf.onNodeMouseenterFunction.call(this, d3.event, node);
    if (v.conf.showTooltips && node.INFOSTRING) {
      v.conf.domTooltip.html(node.INFOSTRING).style('display', 'block');
      if (v.conf.tooltipPosition === 'svgTopLeft') {
        position = v.tools.getOffsetRect(document.querySelector('#' + v.conf.domContainerId + ' svg'));
        v.conf.domTooltip
          .style('top', position.top + 'px')
          .style('left', position.left + 'px');
      }
      else if (v.conf.tooltipPosition === 'svgTopRight') {
        position = v.tools.getOffsetRect(document.querySelector('#' + v.conf.domContainerId + ' svg'));
        v.conf.domTooltip
          .style('top', position.top + 'px')
          .style('left', position.right -
            parseInt(v.conf.domTooltip.style('width')) -
            2 * parseInt(v.conf.domTooltip.style('border-width')) -
            parseInt(v.conf.domTooltip.style('padding-left')) -
            parseInt(v.conf.domTooltip.style('padding-right')) +
            'px');
      }
      else { // all other cases defaults to 'node', so also invalid values are reset to 'node'
        v.conf.domTooltip
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 'px');
      }
    }
  };

  // on node mouse leave function
  v.tools.onNodeMouseleave = function(node){
    v.nodes.classed('highlight', false);
    v.links.classed('highlight', false);
    v.selfLinks.classed('highlight', false);
    v.labels.classed('highlight', false);
    v.tools.log('Event mouseleave triggered');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_mouseleave', node);
    if (typeof(v.conf.onNodeMouseleaveFunction) == 'function') v.conf.onNodeMouseleaveFunction.call(this, d3.event, node);
    if (v.conf.showTooltips) v.conf.domTooltip.style('display', 'none');
  };

  // on node click function
  v.tools.onNodeClick = function(node){
    if (node.LINK && v.conf.nodeEventToOpenLink == 'click') v.tools.openLink(node);
    if (v.conf.pinMode && v.conf.nodeEventToStopPinMode == 'click') d3.select(this).classed('fixed', node.fixed = false);
    v.tools.log('Event click triggered');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_click', node);
    if (typeof(v.conf.onNodeClickFunction) == 'function') v.conf.onNodeClickFunction.call(this, d3.event, node);
  };

  // on node double click function
  v.tools.onNodeDblclick = function(node){
    if (node.LINK && v.conf.nodeEventToOpenLink == 'dblclick') v.tools.openLink(node);
    if (v.conf.pinMode && v.conf.nodeEventToStopPinMode == 'dblclick') d3.select(this).classed('fixed', node.fixed = false);
    v.tools.log('Event dblclick triggered');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_dblclick', node);
    if (typeof(v.conf.onNodeDblclickFunction) == 'function') v.conf.onNodeDblclickFunction.call(this, d3.event, node);
  };

  // on node contextmenu function
  v.tools.onNodeContextmenu = function(node){
    if (v.conf.onNodeContextmenuPreventDefault) d3.event.preventDefault();
    if (node.LINK && v.conf.nodeEventToOpenLink == 'contextmenu') v.tools.openLink(node);
    if (v.conf.pinMode && v.conf.nodeEventToStopPinMode == 'contextmenu') d3.select(this).classed('fixed', node.fixed = false);
    v.tools.log('Event contextmenu triggered');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_contextmenu', node);
    if (typeof(v.conf.onNodeContextmenuFunction) == 'function') v.conf.onNodeContextmenuFunction.call(this, d3.event, node);
  };

  // converter function for XML data
  v.tools.x2js = new X2JS( {attributePrefix:'none'} );

  // get inner width for the SVG parents element
  v.tools.getSvgParentInnerWidth = function(){
    var svg = d3.select('#' + v.conf.domContainerId + '_svg');
    var parent = d3.select( svg.node().parentNode );
    return parseInt(parent.style('width')) -
      parseInt(parent.style('padding-left')) -
      parseInt(parent.style('padding-right')) -
      parseInt(svg.style('border-width')) * 2 ;
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
    var bottom  = box.bottom + scrollTop - clientTop;
    var right = box.right + scrollLeft - clientLeft;
    return { top: Math.round(top), left: Math.round(left), bottom: Math.round(bottom), right: Math.round(right) };
  };

  // dragability for customizing container
  v.tools.customizeDrag = d3.behavior.drag()
    .on('dragstart', function() {
        var mouseToBody = d3.mouse(document.body);
        v.conf.domCustomizePosition = v.tools.getOffsetRect(document.querySelector('#' + v.conf.domContainerId + '_customizing'));
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
      v.conf.domCustomizePosition = v.tools.getOffsetRect(document.querySelector('#' + v.conf.domContainerId + '_customizing'));
    });


  // customizing function
  v.tools.customizeChart = function(){
    var tab, row, td, form, value, i=0, tdConfObject;
    // set initial position
    if (!v.conf.domCustomizePosition) {
      v.conf.domCustomizePosition = v.tools.getOffsetRect(document.querySelector('#' + v.conf.domContainerId + ' svg'));
      v.conf.domCustomizePosition.left = v.conf.domCustomizePosition.left + v.conf.width -100 ;
      v.conf.domCustomizePosition.top = v.conf.domCustomizePosition.top + 8 ;
    }
    if (document.querySelector('#' + v.conf.domContainerId + '_customizing') !== null ) {
      v.conf.domCustomize.remove();
    }
      v.conf.domCustomize = v.conf.domContainer.append('div')
        .attr('id', v.conf.domContainerId + '_customizing')
        .attr('class', 'net_gobrechts_d3_force_customize')
        .style('left', v.conf.domCustomizePosition.left + 'px')
        .style('top', v.conf.domCustomizePosition.top + 'px');
      v.conf.domCustomize.append('span')
        .attr('class','drag')
        .text('Customize "' + v.conf.domContainerId + '"' )
        .call(v.tools.customizeDrag);
      v.conf.domCustomize.append('span')
        .attr('class', 'close link')
        .text('Close')
        .on('click', function(){
          v.conf.customize = false;
          render();
        });
      tab = v.conf.domCustomize.append('table');
      for (var key in v.confDefaults) {
        if (v.confDefaults.hasOwnProperty(key)) {
          row = tab.append('tr');
          row.append('td')
            .attr('class','label')
            .html('<a href="https://github.com/ogobrecht/d3-force-apex-plugin#' + 
                  key + '" target="github_d3_force">' + 
                  key + '</a>');
          if (v.confDefaults[key].type == 'range') {
            td = row.append('td')
              .classed('warning', v.confDefaults[key].internal );
            form = td.append('input')
              .attr('type', 'range')
              .attr('name', key)
              .attr('value', v.conf[key])
              .attr('min', v.confDefaults[key].min)
              .attr('max', v.confDefaults[key].max)
              .attr('step', v.confDefaults[key].step)
              .on('change', function(){
                v.conf[this.name] = parseFloat(this.value);
                v.tools.createCustomizingConfObject();
                render();
              });
          }
          else if (v.confDefaults[key].type == 'number') {
            td = row.append('td')
              .classed('warning', v.confDefaults[key].internal );
            form = td.append('input')
              .attr('type', 'number')
              .attr('name', key)
              .attr('value', v.conf[key])
              .attr('min', v.confDefaults[key].min)
              .attr('max', v.confDefaults[key].max)
              .attr('step', v.confDefaults[key].step)
              .on('change', function(){
                v.conf[this.name] = ( isNaN(parseFloat(this.value)) ? null : this.value );
                v.tools.createCustomizingConfObject();
                render();
              });
          }
          else if (v.confDefaults[key].type == 'bool') {
            td = row.append('td')
              .classed('warning', v.confDefaults[key].internal );
            form = td.append('input')
              .attr('type', 'checkbox')
              .attr('name', key)
              .on('change', function(){
                v.conf[this.name] = ( this.checked ? true : false );
                v.tools.createCustomizingConfObject();
                render();
              });
            if (v.conf[key] === true ){
              form.attr('checked', 'checked');
            }
          }
          else if (v.confDefaults[key].type == 'text') {
            td = row.append('td')
              .classed('warning', v.confDefaults[key].internal );
            form = td.append('input')
              .attr('type', 'text')
              .attr('name', key)
              .attr('value', v.conf[key])
              .on('change', function(){
                v.conf[this.name] = this.value;
                v.tools.createCustomizingConfObject();
                render();
              });
          }
          else if (v.confDefaults[key].type == 'select') {
            td = row.append('td')
              .classed('warning', v.confDefaults[key].internal );
            form = td.append('select')
              .attr('name', key)
              .attr('value', v.conf[key])
              .on('change', function(){
                v.conf[this.name] = this.options[this.selectedIndex].value;
                v.tools.createCustomizingConfObject();
                render();
              });
            v.confDefaults[key].options.forEach(function(d){
              value = d;
              form.append('option')
                .attr('value',d)
                .attr('selected', function(){
                  return (value == v.conf[key] ? 'selected': null );
                })
                .text(d);
            });
          }
          // third column td only in the first row
          i += 1;
          if (i == 1) {
            tdConfObject = row.append('td')
              .style('vertical-align','top')
              .style('padding-left','5px');
          }
        }
      }
      // third column spans over all rows
      tdConfObject
          .attr('rowspan', i)
          .html('Your Configuration Object<br><textarea id="' + v.conf.domContainerId + '_conf_object"></textarea><br><br>' +
                '<span class="link" id="' + v.conf.domContainerId + '_get_current_positions">Get Current Positions</span><br>' +
                '<textarea id="' + v.conf.domContainerId + '_positions"></textarea><br><br>' +
                'Copyrights<br><br>' +
                '<a href="https://github.com/ogobrecht/d3-force-apex-plugin" target="github_d3_force">D3 Force APEX Plugin</a> (' + v.version + ')<br>' +
                'Ottmar Gobrecht<br><br>' +
                '<a href="http://d3js.org" target="d3js_org">D3.js</a> (' + d3.version + ')<br>' +
                'Mike Bostock<br><br>' +
                '<a href="https://code.google.com/p/x2js/" target="code_google_com">X2JS</a> (' + v.tools.x2js.getVersion() + ' modified)<br>' +
                'Abdulla Abdurakhmanov<br><br>'
               );
    v.tools.createCustomizingConfObject();
    d3.select('#' + v.conf.domContainerId + '_get_current_positions').on('click', function(){
      d3.select('#' + v.conf.domContainerId + '_positions').text( render.positions() );
    });
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
    d3.select('#' + v.conf.domContainerId + '_conf_object').text(conf);
  };

  v.tools.createCurrentPositionsObject = function(){
    v.conf.domCustomizingPositions.text( render.positions() );
  };

  // TICK function: core helper for force layout
  v.tick = function() {
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
  };

  // create force reference
  v.force = d3.layout.force()
    .on('tick', v.tick);

  // create drag reference
  v.drag = v.force.drag();


  /*************************************************************************
   * RENDER FUNCTION - has to be called on each data refresh
   */

  function render (rawDataString){

    // trigger apex event
    v.tools.triggerApexEvent(document.querySelector('#' + v.conf.domContainerId), 'apexbeforerefresh');

    // write debug infos
    v.tools.log('Start rendering...');

    if (!rawDataString && !v.data.rawDataString){
      v.tools.logError('Houston, we have a problem - we have to provide sample data...');
      v.conf.sampleData = true;
      rawDataString = v.data.sampleData;
    }
    else if (rawDataString) {
      v.conf.sampleData = false;
    }

    // if we have incoming data, than we do our transformations here, otherwise we use the existing data
    if (rawDataString) {

      // convert incoming data depending on type
      if ( rawDataString.trim().substr(0,1) == '<' ) {
        try { v.data.rawDataString = v.tools.x2js.xml_str2json(rawDataString); }
        catch(e){ v.tools.logError('Unable to convert XML string to JSON: ' + e.message); }
      }
      else if ( rawDataString.trim().substr(0,1) == '{' ) {
        try { v.data.rawDataString = JSON.parse(rawDataString); }
        catch(e){ v.tools.logError('Unable to parse JSON data string: ' + e.message); }
      }
      else {
        v.tools.logError('Your data is not starting with "<" or "{" - rendering of graph not possible - keeping the old data ...');
      }

      // write debug infos
	    v.tools.log('Raw data string:');
      v.tools.log(rawDataString, true);
      v.tools.log('Converted JSON object:');
      v.tools.log(v.data.rawDataString, true);

      // create references to our ajax data
      v.data.links = v.data.rawDataString.data.links;
      v.data.nodes = v.data.rawDataString.data.nodes;

      // switch links to point to node objects instead of id's (needed for force layout)
      v.data.id_lookup = []; // helper array to lookup node objects by id's
      v.data.nodes.forEach( function(n, i){
        n.SIZEVALUE   = parseFloat(n.SIZEVALUE); // convert size to float value
        n.index  = i;                            // add index attribute
        n.LABELCIRCULAR = !!n.LABELCIRCULAR;     // convert labelCircular to boolean
        v.data.id_lookup[n.ID] = n;              // add object reference to lookup array
      });
      v.data.links.forEach( function(l, i) {
        l.source = v.data.id_lookup[l.FROMID]; // add attribute source as a node reference to the link
        l.target = v.data.id_lookup[l.TOID];   // add attribute target as a node reference to the link
      });

      // sort out links with invalid node references
      v.data.links = v.data.links.filter( function(l){
        return typeof l.source != 'undefined' && typeof l.target != 'undefined';
      });

      // create helper array to lookup if nodes are neighbors
      v.data.neighbors = v.data.links.map(function(l){
        return l.FROMID + ':' + l.TOID;
      });

    } //END: if (rawDataString)

    // show/hide border of SVG area
    v.conf.domSvg.classed('border', v.conf.showBorder);

    // helper function to get up to 20 different colors from the framework or direkt color from the node
    if      (v.conf.colorScheme == 'color20')  { v.tools.color = d3.scale.category20();  }
    else if (v.conf.colorScheme == 'color20b') { v.tools.color = d3.scale.category20b(); }
    else if (v.conf.colorScheme == 'color20c') { v.tools.color = d3.scale.category20c(); }
    else if (v.conf.colorScheme == 'color10')  { v.tools.color = d3.scale.category10();  }
    else if (v.conf.colorScheme == 'direct')   { v.tools.color = function(d){return d;}; }
    else {   v.conf.colorScheme = 'color20';     v.tools.color = d3.scale.category20();  }

    // save positions to user provided positions (only once directly after user provided the data and start() is called )
    if (v.conf.positions){
      var count = 0;
      v.conf.positions.forEach(function(d, i){
        if (v.data.id_lookup[d.ID] !== undefined){
          v.data.id_lookup[d.ID].x = d.x;
          v.data.id_lookup[d.ID].y = d.y;
          v.data.id_lookup[d.ID].px = d.x;
          v.data.id_lookup[d.ID].py = d.y;
          v.data.id_lookup[d.ID].fixed = d.fixed;
          if (d.fixed == 1) count++;
        }
      });
      if (count > 0) v.conf.pinMode = true;
      v.conf.positions = null; // reset, because we want only apply the positions once
    }
    // save positions from existing nodes
    else {
      v.conf.domSvg.selectAll('circle.node')
        .data(v.data.nodes, function(n){return v.conf.domContainerId + '_' + n.ID;}) // identify nodes by id
        .each(function(d){
          v.data.id_lookup[d.ID].x = parseFloat( d3.select(this).attr('cx') );
          v.data.id_lookup[d.ID].y = parseFloat( d3.select(this).attr('cy') );
        });
    }

    // helper function to calculate node radius from "size" attribute
    v.tools.radius = d3.scale.sqrt()
      .range([v.conf.minNodeRadius,v.conf.maxNodeRadius])
      .domain( d3.extent(v.data.nodes, function(n){return parseFloat(n.SIZEVALUE);}) );

    // calculate nodes radius, reset pin mode
    v.data.nodes.forEach( function(n){
      n.radius = v.tools.radius(n.SIZEVALUE);          // add or recalculate radius attribute
      if (!v.conf.pinMode && n.fixed) n.fixed = false; // release fixed nodes
    });

    // LINKS
    v.links = v.conf.domSvg.selectAll('line.link')
      .data( v.data.links.filter( function(l) { return l.FROMID != l.TOID; } ),
             function(l){return v.conf.domContainerId + '_link_' + l.FROMID + '_' + l.TOID;})
      .classed('marker', v.conf.showLinkDirection)
      .classed('dashed', function(l){return(l.STYLE === 'dashed');});
    v.links.enter().append('svg:line')
      .attr('id', function(l) { return v.conf.domContainerId + '_link_' + l.FROMID + '_' + l.TOID; })
      .attr('class', 'link')
      .classed('marker', v.conf.showLinkDirection)
      .classed('dashed', function(l){return(l.STYLE === 'dashed');});
    v.links.exit().remove();

    // SELFLINKS
    v.selfLinks = v.conf.domSvg.selectAll('path.link')
      .data( v.data.links.filter( function(l) { return l.FROMID == l.TOID && v.conf.showSelfLinks; } ),
             function(l){return v.conf.domContainerId + '_link_' + l.FROMID + '_' + l.TOID;})
      .attr('d', function(l) { return v.tools.getSelfLinkPath(l); })
      .classed('marker', v.conf.showLinkDirection)
      .classed('dashed', function(l){return(l.STYLE == 'dashed');});
    v.selfLinks.enter().append('svg:path')
      .attr('id', function(l) { return v.conf.domContainerId + '_link_' + l.FROMID + '_' + l.TOID; })
      .attr('class', 'link')
      .attr('d', function(l) { return v.tools.getSelfLinkPath(l); })
      .classed('marker', v.conf.showLinkDirection)
      .classed('dashed', function(l){return(l.STYLE == 'dashed');});
    v.selfLinks.exit().remove();

    // LABELS

    // normal text lables
      v.labels = v.conf.domSvg.selectAll('text.label')
      .data(v.data.nodes.filter( function(n) { return !n.LABELCIRCULAR && !v.conf.labelsCircular; } ),
            function(n){return v.conf.domContainerId + '_label_' + n.ID;})
      .text( function(n){return n.LABEL;});
    v.labels.enter().append('svg:text')
      .attr('id', function(n) { return v.conf.domContainerId + '_label_' + n.ID; })
      .attr('class', 'label')
      .text( function(n){return n.LABEL;});
    v.labels.exit().remove();

    // paths for circular labels
    v.labelPaths = v.conf.domSvgDefs.selectAll('path.label')
      .data(v.data.nodes.filter( function(n) { return n.LABELCIRCULAR || v.conf.labelsCircular ; } ),
            function(n){return v.conf.domContainerId + '_textPath_' + n.ID;})
      .attr('d', function(n){return v.tools.getLabelPath(n);});
    v.labelPaths.enter().append('svg:path')
      .attr('id', function(n){ return v.conf.domContainerId + '_textPath_' + n.ID;})
      .attr('class', 'label')
      .attr('d', function(n){return v.tools.getLabelPath(n);});
    v.labelPaths.exit().remove();

    // circular labels
    v.labelsCircular = v.conf.domSvg.selectAll('text.labelCircular')
      .data(v.data.nodes.filter( function(n) { return n.LABELCIRCULAR || v.conf.labelsCircular ; } ),
            function(n){return v.conf.domContainerId + '_labelCircular_' + n.ID;})
      .each(function(n){
        d3.select('#' + v.conf.domContainerId + '_pathReference_' + n.ID).text(n.LABEL);
      });
    v.labelsCircular.enter().append('svg:text')
      .attr('id', function(n) { return v.conf.domContainerId + '_labelCircular_' + n.ID; })
      .attr('class', 'labelCircular')
      .append('svg:textPath')
      .attr('id', function(n){ return v.conf.domContainerId + '_pathReference_' + n.ID;})
      .attr('xlink:href', function(n){return '#' + v.conf.domContainerId + '_textPath_' + n.ID;})
      .text(function(n){return n.LABEL;});
    v.labelsCircular.exit().remove();

    // NODES
    v.nodes = v.conf.domSvg.selectAll('circle.node')
      .data(v.data.nodes, function(n){return v.conf.domContainerId + '_node_' + n.ID;})
      .attr('r', function(n){return n.radius;})
      .style('fill', null) // to delete the color first, otherwise new invalid colors are not reseted to black
      .style('fill', function(n){return v.tools.color(n.COLORVALUE);});
    v.nodes.enter().append('svg:circle')
      .attr('id', function(n){return v.conf.domContainerId + '_node_' + n.ID;})
      .attr('class', 'node')
      .attr('r', function(n){return n.radius;})
      .style('fill', function(n){return v.tools.color(n.COLORVALUE);})
      .on('mouseenter', v.tools.onNodeMouseenter)
      .on('mouseleave', v.tools.onNodeMouseleave)
      .on('click', v.tools.onNodeClick)
      .on('dblclick', v.tools.onNodeDblclick)
      .on('contextmenu', v.tools.onNodeContextmenu);
    v.nodes.exit().remove();

    // CUSTOMIZING LINK
    if ( !v.conf.customize && (v.conf.debug || document.querySelector('#apex-dev-toolbar') !== null) ) {
      if (document.querySelector('#' + v.conf.domContainerId + ' svg .customize_me') === null) {
        v.conf.domSvg.append('svg:text')
          .attr('class', 'link customize_me')
          .attr('x', 5)
          .attr('y', 15)
          .attr('text-anchor', 'start')
          .text('Customize Me')
          .on('click', function(){
            v.conf.customize = true;
            render();
          });
      }
    }
    else {
      v.conf.domSvg.select('#' + v.conf.domContainerId + ' svg .customize_me').remove();
    }

    // drag mode
    if (v.conf.dragMode) {
      v.nodes.call(v.drag);
    }
    else {
      // http://stackoverflow.com/questions/13136355/d3-js-remove-force-drag-from-a-selection
      v.nodes.on('mousedown.drag', null);
    }

    // pin mode - http://bl.ocks.org/mbostock/3750558
    if (v.conf.pinMode && v.conf.dragMode) {
      v.drag.on('dragstart', function(n){d3.select(this).classed('fixed', n.fixed = true);});
    }
    else {
      v.drag.on('dragstart', null);
    }

    // compute width of DOM container and register/unregister resize event
    if (v.conf.useDomParentWidth) {
      v.conf.domContainerWidth = v.tools.getSvgParentInnerWidth();
      d3.select(window).on('resize', function(){
        var old_width = v.conf.domContainerWidth;
        var new_width = v.tools.getSvgParentInnerWidth();
        if (old_width !== new_width) {
          v.conf.domContainerWidth = new_width;
          render();
        }
      });
    } else {
      d3.select(window).on('resize', null);
    }

    // START VISUALIZATION
    v.conf.domSvg
      .attr('width', (v.conf.useDomParentWidth ? v.conf.domContainerWidth : v.conf.width))
      .attr('height', v.conf.height);
    v.force
      .nodes(v.data.nodes)
      .links(v.data.links)
      .size([(v.conf.useDomParentWidth ? v.conf.domContainerWidth : v.conf.width),v.conf.height])
      .friction(v.conf.friction)
      .charge(v.conf.charge)
      .theta(v.conf.theta)
      .gravity(v.conf.gravity)
      .linkDistance(v.conf.linkDistance)
      .linkStrength(v.conf.linkStrength)
      .start();

    // start auto refresh, if configured
    if (v.conf.autoRefresh && v.conf.refreshInterval && !v.conf.interval) {
      v.conf.interval = window.setInterval( function(){render.start();}, v.conf.refreshInterval );
      v.tools.log('Auto refresh started with an interval of ' + v.conf.refreshInterval + ' milliseconds');
    }
    else if (v.conf.autoRefresh === false && v.conf.interval){
      clearInterval(v.conf.interval);
      v.conf.interval = null;
      v.tools.log('Auto refresh stopped');
    }

    // create customizing form
    if (v.conf.customize) v.tools.customizeChart();
    else d3.select('#' + v.conf.domContainerId + '_customizing').remove();

    // trigger apex event
    v.tools.triggerApexEvent(document.querySelector('#' + v.conf.domContainerId), 'apexafterrefresh');

  } //END function render


  /*************************************************************************
   * Public functions
   */

  // public start function: get data and start visualization
  render.start = function(pRawDataString){
    // try to use the input data - this means also, we can overwrite the data from APEX with raw data (textarea or whatever you like...)
    if (pRawDataString) {
      render(pRawDataString);
    }
    // if we have no pRawDataString, then we try to use the APEX context (if APEX plugin ID is set)
    else if ( v.conf.apexPluginId ) {
      apex.server.plugin(
        v.conf.apexPluginId,
        {},
        { success: function(rawDataString){
            // we have 'nothing', when there are no queries defined in APEX or when the queries returns empty data
            if ( rawDataString.trim() != 'no_data_found' ) { render(rawDataString); }
            else { render(); }
          },
          error: function(){ v.tools.logError('Unable to load new data - AJAX call terminated with errors'); },
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

  render.showBorder = function(value) {
    if (!arguments.length) return v.conf.showBorder;
    v.conf.showBorder = value;
    return render;
  };

  render.showSelfLinks = function(value) {
    if (!arguments.length) return v.conf.showSelfLinks;
    v.conf.showSelfLinks = value;
    return render;
  };

  render.showLinkDirection = function(value) {
    if (!arguments.length) return v.conf.showLinkDirection;
    v.conf.showLinkDirection = value;
    return render;
  };

  render.showTooltips = function(value) {
    if (!arguments.length) return v.conf.showTooltips;
    v.conf.showTooltips = value;
    return render;
  };

  render.tooltipPosition = function(value) {
    if (!arguments.length) return v.conf.tooltipPosition;
    v.conf.tooltipPosition = value;
    return render;
  };

  render.colorScheme = function(value) {
    if (!arguments.length) return v.conf.colorScheme;
    v.conf.colorScheme = value;
    return render;
  };

  render.labelsCircular = function(value) {
    if (!arguments.length) return v.conf.labelsCircular;
    v.conf.labelsCircular = value;
    return render;
  };

  render.dragMode = function(value) {
    if (!arguments.length) return v.conf.dragMode;
    v.conf.dragMode = value;
    return render;
  };

  render.pinMode = function(value) {
    if (!arguments.length) return v.conf.pinMode;
    v.conf.pinMode = value;
    return render;
  };

  render.nodeEventToStopPinMode = function(value) {
    if (!arguments.length) return v.conf.nodeEventToStopPinMode;
    v.conf.nodeEventToStopPinMode = value;
    return render;
  };

  render.onNodeContextmenuPreventDefault = function(value) {
    if (!arguments.length) return v.conf.onNodeContextmenuPreventDefault;
    v.conf.onNodeContextmenuPreventDefault = value;
    return render;
  };

  render.nodeEventToOpenLink = function(value) {
    if (!arguments.length) return v.conf.nodeEventToOpenLink;
    v.conf.nodeEventToOpenLink = value;
    return render;
  };

  render.nodeLinkTarget = function(value) {
    if (!arguments.length) return v.conf.nodeLinkTarget;
    v.conf.nodeLinkTarget = value;
    return render;
  };

  render.autoRefresh = function(value) {
    if (!arguments.length) return v.conf.autoRefresh;
    v.conf.autoRefresh = value;
    return render;
  };

  render.refreshInterval = function(value) {
    if (!arguments.length) return v.conf.refreshInterval;
    v.conf.refreshInterval = value;
    return render;
  };

  render.useDomParentWidth = function(value) {
    if (!arguments.length) return v.conf.useDomParentWidth;
    v.conf.useDomParentWidth = value;
    return render;
  };

  render.width = function(value) {
    if (!arguments.length) return v.conf.width;
    v.conf.width = value;
    return render;
  };

  render.height = function(value) {
    if (!arguments.length) return v.conf.height;
    v.conf.height = value;
    return render;
  };

  render.minNodeRadius = function(value) {
    if (!arguments.length) return v.conf.minNodeRadius;
    v.conf.minNodeRadius = value;
    return render;
  };

  render.maxNodeRadius = function(value) {
    if (!arguments.length) return v.conf.maxNodeRadius;
    v.conf.maxNodeRadius = value;
    return render;
  };

  render.labelDistance = function(value) {
    if (!arguments.length) return v.conf.labelDistance;
    v.conf.labelDistance = value;
    return render;
  };

  render.selfLinkDistance = function(value) {
    if (!arguments.length) return v.conf.selfLinkDistance;
    v.conf.selfLinkDistance = value;
    return render;
  };

  render.linkDistance = function(value) {
    if (!arguments.length) return v.conf.linkDistance;
    v.conf.linkDistance = value;
    return render;
  };

  render.charge = function(value) {
    if (!arguments.length) return v.conf.charge;
    v.conf.charge = value;
    return render;
  };

  render.gravity = function(value) {
    if (!arguments.length) return v.conf.gravity;
    v.conf.gravity = value;
    return render;
  };

  render.chargeDistance = function(value) {
    if (!arguments.length) return v.conf.chargeDistance;
    v.conf.chargeDistance = value;
    return render;
  };

  render.linkStrength = function(value) {
    if (!arguments.length) return v.conf.linkStrength;
    v.conf.linkStrength = value;
    return render;
  };

  render.friction = function(value) {
    if (!arguments.length) return v.conf.friction;
    v.conf.friction = value;
    return render;
  };

  render.theta = function(value) {
    if (!arguments.length) return v.conf.theta;
    v.conf.theta = value;
    return render;
  };

  render.positions = function(value){
    if (!arguments.length){
      var positions = '[\n';
      v.data.nodes.forEach( function(n){
        positions += ('{"ID":"' + n.ID + '","x":' + n.x + ',"y":' + n.y + ',"fixed":' + (n.fixed ? 1 : 0) + '},\n');
      });
      return positions.substr(0, positions.length - 2) + '\n]';
    }
    else {
      v.conf.positions = value;
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

  render.sampleData = function(rawDataString){
    if (!arguments.length) return v.data.sampleData;
    v.data.sampleData = rawDataString;
    return render;
  };
  
  render.customize = function(value) {
    if (!arguments.length) return v.conf.customize;
    v.conf.customize = value;
    return render;
  };

  render.debug = function(value) {
    if (!arguments.length) return v.conf.debug;
    v.conf.debug = value;
    return render;
  };

  // public inspect function: to inspect the global object, which holds all data, functions and references
  render.inspect = function(){
    return v;
  };

  render.version = function(){
    return v.version;
  };

  /*************************************************************************
   * Startup code - runs ones after the initialization of a new chart - example:
   * var myChart = net_gobrechts_d3_force( pDomContainerId, pConf, pApexPluginId ).start();
   */

  // bind to the apexrefresh event, so that this region can be refreshed by a dynamic action
  if (v.conf.apexPluginId) {
    apex.jQuery('#' + v.conf.domContainerId).bind('apexrefresh', function(){render.start();} );
  }

  // final return
  return render;

}
