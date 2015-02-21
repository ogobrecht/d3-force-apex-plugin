function net_gobrechts_d3_force ( pDomContainerId, pOptions, pApexPluginId, pApexPageItemsToSubmit ) {

  "use strict";

  /*************************************************************************
   * Setup Configuration
   */

  // create global object
  var v = {"version":"1.0.5"};
  v.conf = {};
  v.data = {};
  v.tools = {};

  // save parameter for later use
  v.conf.domContainerId        = pDomContainerId || 'D3Force' + Math.floor(Math.random()*1000000);
  v.confUser                   = pOptions || {};
  v.conf.apexPluginId          = pApexPluginId;
  v.conf.apexPageItemsToSubmit = pApexPageItemsToSubmit;

  // configure debug mode for APEX, can be overwritten by configuration object
  v.conf.debugPrefix    = 'D3 Force in DOM container #' + v.conf.domContainerId + ': ';
  if ( v.conf.apexPluginId && apex.jQuery('#pdebug').length == 1 ) {
    v.conf.debug = true;
  }
  else {
    v.conf.debug = false;
  }

  // monitoring variables
  v.tickCounter
  v.startTime

  // default configuration
  v.confDefaults = {
    "showBorder":{"type":"bool", "val":true, "options":[true,false]},
    "showSelfLinks":{"type":"bool", "val":true, "options":[true,false]},
    "showLinkDirection":{"type":"bool", "val":true, "options":[true,false]},
    "showTooltips":{"type":"bool", "val":true, "options":[true,false]},
    "tooltipPosition":{"type":"text", "val":"node", "options":["node","svgTopLeft","svgTopRight"]},
    "colorScheme":{"type":"text", "val":"color20", "options":["color20","color20b","color20c","color10","direct"]},
    "labelsCircular":{"type":"bool", "val":false, "options":[true,false]},
    "dragMode":{"type":"bool", "val":true, "options":[true,false]},
    "pinMode":{"type":"bool", "val":false, "options":[true,false]},
    "nodeEventToStopPinMode":{"type":"text", "val":"contextmenu", "options":["none","dblclick","contextmenu"]},
    "onNodeContextmenuPreventDefault":{"type":"bool", "val":false, "options":[true,false]},
    "nodeEventToOpenLink":{"type":"text", "val":"dblclick", "options":["none","click","dblclick","contextmenu"]},
    "nodeLinkTarget":{"type":"text", "val":"_blank", "options":["none","_blank","nodeID"]},
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
  v.conf.customize                       = false;
  v.conf.debug                           = v.confUser.debug                                   || false;
  v.conf.showBorder                      = (typeof v.confUser.showBorder                      !== 'undefined' ? v.confUser.showBorder : v.confDefaults.showBorder.val);
  v.conf.showSelfLinks                   = (typeof v.confUser.showSelfLinks                   !== 'undefined' ? v.confUser.showSelfLinks : v.confDefaults.showSelfLinks.val);
  v.conf.showLinkDirection               = (typeof v.confUser.showLinkDirection               !== 'undefined' ? v.confUser.showLinkDirection : v.confDefaults.showLinkDirection.val);
  v.conf.showTooltips                    = (typeof v.confUser.showTooltips                    !== 'undefined' ? v.confUser.showTooltips : v.confDefaults.showTooltips.val);
  v.conf.tooltipPosition                 = v.confUser.tooltipPosition                         || v.confDefaults.tooltipPosition.val;
  v.conf.colorScheme                     = v.confUser.colorScheme                             || v.confDefaults.colorScheme.val;
  v.conf.labelsCircular                  = (typeof v.confUser.labelsCircular                  !== 'undefined' ? v.confUser.labelsCircular : v.confDefaults.labelsCircular.val);
  v.conf.dragMode                        = (typeof v.confUser.dragMode                        !== 'undefined' ? v.confUser.dragMode : v.confDefaults.dragMode.val);
  v.conf.pinMode                         = (typeof v.confUser.pinMode                         !== 'undefined' ? v.confUser.pinMode : v.confDefaults.pinMode.val);
  v.conf.nodeEventToStopPinMode          = v.confUser.nodeEventToStopPinMode                  || v.confDefaults.nodeEventToStopPinMode.val;
  v.conf.onNodeContextmenuPreventDefault = (typeof v.confUser.onNodeContextmenuPreventDefault !== 'undefined' ? v.confUser.onNodeContextmenuPreventDefault : v.confDefaults.onNodeContextmenuPreventDefault.val);
  v.conf.nodeEventToOpenLink             = v.confUser.nodeEventToOpenLink                     || v.confDefaults.nodeEventToOpenLink.val;
  v.conf.nodeLinkTarget                  = v.confUser.nodeLinkTarget                          || v.confDefaults.nodeLinkTarget.val;
  v.conf.autoRefresh                     = (typeof v.confUser.autoRefresh                     !== 'undefined' ? v.confUser.autoRefresh : v.confDefaults.autoRefresh.val);
  v.conf.refreshInterval                 = v.confUser.refreshInterval                         || v.confDefaults.refreshInterval.val;
  v.conf.useDomParentWidth               = (typeof v.confUser.useDomParentWidth               !== 'undefined' ? v.confUser.useDomParentWidth : v.confDefaults.useDomParentWidth.val);
  v.conf.width                           = v.confUser.width                                   || v.confDefaults.width.val;
  v.conf.height                          = v.confUser.height                                  || v.confDefaults.height.val;
  v.conf.minNodeRadius                   = v.confUser.minNodeRadius                           || v.confDefaults.minNodeRadius.val;
  v.conf.maxNodeRadius                   = v.confUser.maxNodeRadius                           || v.confDefaults.maxNodeRadius.val;
  v.conf.labelDistance                   = v.confUser.labelDistance                           || v.confDefaults.labelDistance.val;
  v.conf.selfLinkDistance                = v.confUser.selfLinkDistance                        || v.confDefaults.selfLinkDistance.val;
  v.conf.linkDistance                    = v.confUser.linkDistance                            || v.confDefaults.linkDistance.val;
  v.conf.chargeDistance                  = v.confUser.chargeDistance                          || null;
  v.conf.charge                          = v.confUser.charge                                  || v.confDefaults.charge.val;
  v.conf.gravity                         = v.confUser.gravity                                 || v.confDefaults.gravity.val;
  v.conf.linkStrength                    = v.confUser.linkStrength                            || v.confDefaults.linkStrength.val;
  v.conf.friction                        = v.confUser.friction                                || v.confDefaults.friction.val;
  v.conf.theta                           = v.confUser.theta                                   || v.confDefaults.theta.val;
  v.conf.onNodeMouseenterFunction        = v.confUser.onNodeMouseenterFunction                || null;
  v.conf.onNodeMouseleaveFunction        = v.confUser.onNodeMouseleaveFunction                || null;
  v.conf.onNodeClickFunction             = v.confUser.onNodeClickFunction                     || null;
  v.conf.onNodeDblclickFunction          = v.confUser.onNodeDblclickFunction                  || null;
  v.conf.onNodeContextmenuFunction       = v.confUser.onNodeContextmenuFunction               || null;
  v.conf.currentTabPosition              = null;
  v.conf.sampleData                      = false;
  v.data.sampleData                      = '<data>' +
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
      .attr('id', v.conf.domContainerId)
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
    .attr('id', v.conf.domContainerId + '_highlightedTriangle')
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

  v.conf.domSvgDefs
    .append('svg:marker')
    .attr('id', v.conf.domContainerId + '_normalTriangle')
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
      if (omitDebugPrefix) console.log(message);
      else console.log( v.conf.debugPrefix + message);
    }
    if (v.conf.customize) v.conf.domCustomizeLog.text ( message + '\n' + v.conf.domCustomizeLog.text() );
  };

  // log error function
  v.tools.logError = function(message, omitDebugPrefix) {
    console.log( v.conf.debugPrefix + 'ERROR: ' + message);
    if (v.conf.customize) v.conf.domCustomizeLog.text ( 'ERROR: ' + message + '\n' + v.conf.domCustomizeLog.text() );
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
    var win;
    if (v.conf.nodeLinkTarget == "none") {
      window.location.assign(node.LINK);
    }
    else if (v.conf.nodeLinkTarget == "nodeID") {
      win = window.open(node.LINK, node.ID);
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
          return 'url(#'+v.conf.domContainerId+'_' + 
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
          return 'url(#'+v.conf.domContainerId+'_' + 
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
      v.conf.domTooltip.html(node.INFOSTRING).style('display', 'block');
      if (v.conf.tooltipPosition === 'svgTopLeft') {
        position = v.tools.getOffsetRect(document.querySelector('#' + v.conf.domContainerId + ' svg'));
        v.conf.domTooltip
          .style('top', position.top + 
            (v.conf.domSvg.style('border-width') ? parseInt(v.conf.domSvg.style('border-width')) : 1) +
            'px')
          .style('left', position.left + 
            (v.conf.domSvg.style('border-width') ? parseInt(v.conf.domSvg.style('border-width')) : 1) +
            'px');
      }
      else if (v.conf.tooltipPosition === 'svgTopRight') {
        position = v.tools.getOffsetRect(document.querySelector('#' + v.conf.domContainerId + ' svg'));
        v.conf.domTooltip
          .style('top', position.top + 
            parseInt( (v.conf.domSvg.style('border-width') ? parseInt(v.conf.domSvg.style('border-width')) : 1) ) + 
            'px')
          .style('left', position.left +
            parseInt(v.conf.domSvg.style('width')) +
            parseInt( (v.conf.domSvg.style('border-width') ? parseInt(v.conf.domSvg.style('border-width')) : 1) ) -
            parseInt(v.conf.domTooltip.style('width')) -
            2 * parseInt( (v.conf.domTooltip.style('border-width') ? parseInt(v.conf.domTooltip.style('border-width')) : 0) ) -
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
    v.nodes.classed('highlighted', false);
    v.links
      .classed('highlighted', false)
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.conf.domContainerId+'_normalTriangle)':null) );
    v.selfLinks
      .classed('highlighted', false)
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.conf.domContainerId+'_normalTriangle)':null) );
    v.labels.classed('highlighted', false);
    v.tools.log('Event mouseleave triggered.');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_mouseleave', node);
    if (typeof(v.conf.onNodeMouseleaveFunction) == 'function') v.conf.onNodeMouseleaveFunction.call(this, d3.event, node);
    if (v.conf.showTooltips) v.conf.domTooltip.style('display', 'none');
  };

  // on node click function
  v.tools.onNodeClick = function(node){
    if (node.LINK && v.conf.nodeEventToOpenLink == 'click') v.tools.openLink(node);
    if (v.conf.pinMode && v.conf.nodeEventToStopPinMode == 'click') d3.select(this).classed('fixed', node.fixed = false);
    v.tools.log('Event click triggered.');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_click', node);
    if (typeof(v.conf.onNodeClickFunction) == 'function') v.conf.onNodeClickFunction.call(this, d3.event, node);
  };

  // on node double click function
  v.tools.onNodeDblclick = function(node){
    if (node.LINK && v.conf.nodeEventToOpenLink == 'dblclick') v.tools.openLink(node);
    if (v.conf.pinMode && v.conf.nodeEventToStopPinMode == 'dblclick') d3.select(this).classed('fixed', node.fixed = false);
    v.tools.log('Event dblclick triggered.');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_dblclick', node);
    if (typeof(v.conf.onNodeDblclickFunction) == 'function') v.conf.onNodeDblclickFunction.call(this, d3.event, node);
  };

  // on node contextmenu function
  v.tools.onNodeContextmenu = function(node){
    if (v.conf.onNodeContextmenuPreventDefault) d3.event.preventDefault();
    if (node.LINK && v.conf.nodeEventToOpenLink == 'contextmenu') v.tools.openLink(node);
    if (v.conf.pinMode && v.conf.nodeEventToStopPinMode == 'contextmenu') d3.select(this).classed('fixed', node.fixed = false);
    v.tools.log('Event contextmenu triggered.');
    v.tools.triggerApexEvent(this, 'net_gobrechts_d3_force_contextmenu', node);
    if (typeof(v.conf.onNodeContextmenuFunction) == 'function') v.conf.onNodeContextmenuFunction.call(this, d3.event, node);
  };

  // converter function for XML data
  v.tools.x2js = new X2JS( {attributePrefix:'none'} );

  // get inner width for the SVG parents element
  v.tools.getSvgParentInnerWidth = function(){
    var parent = d3.select( v.conf.domSvg.node().parentNode );
    return parseInt(parent.style('width')) -
      parseInt(parent.style('padding-left')) -
      parseInt(parent.style('padding-right')) -
      (v.conf.domSvg.style('border-width') ? parseInt(v.conf.domSvg.style('border-width')) : 1) * 2 ;
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
      //v.conf.domCustomizePosition = v.tools.getOffsetRect(document.querySelector('#' + v.conf.domContainerId + '_customizing'));
      v.conf.domCustomizePosition = v.tools.getOffsetRect(v.conf.domCustomize.node());
    });


  // customizing function
  v.tools.customizeChart = function(){
    var tab, row, td, form, i=0, tdConfObject, currentOption, valueInOptions;
    // set initial position
    if (!v.conf.domCustomizePosition) {
      v.conf.domCustomizePosition = v.tools.getOffsetRect(v.conf.domSvg.node());
      v.conf.domCustomizePosition.left = v.conf.domCustomizePosition.left + v.conf.width + 8 ;
      v.conf.domCustomizePosition.top = v.conf.domCustomizePosition.top ;
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
        .call(v.tools.customizeDrag)
        .append('span')
        .attr('class', 'title')
        .text('Customize "' + v.conf.domContainerId + '"' );
      v.conf.domCustomize.append('a')
        .attr('class', 'close focus')
        .attr('tabindex', 1)
        .text('Close')
        .on('click', function(){ v.conf.customize = false; render(); })
        .on('keydown', function(){ 
          if (d3.event.keyCode == 13) {
            v.conf.customize = false; 
            render();
          }
        });
      tab = v.conf.domCustomize.append('table');
      for (var key in v.confDefaults) {
        if (v.confDefaults.hasOwnProperty(key)) {
          i += 1;
          row = tab.append('tr');
          row.append('td')
            .attr('class','label')
            .html('<a href="https://github.com/ogobrecht/d3-force-apex-plugin/wiki/API-Reference#' + 
                  key.toLowerCase() + '" target="github_d3_force" tabindex="' + i + 100 + '">' +
                  key + '</a>');
          td = row.append('td');
          form = td.append('select')
            .attr('id', v.conf.domContainerId + '_' + key)
            .attr('name', key)
            .attr('value', v.conf[key])
            .attr('tabindex', i + 1)
            .classed('warning', v.confDefaults[key].internal)
            .on('change', function(){
              v.conf.currentTabPosition = this.id;
              if (v.confDefaults[this.name].type == 'text') {
                v.conf[this.name] = this.options[this.selectedIndex].value;
              }
              else if (v.confDefaults[this.name].type == 'number') {
                v.conf[this.name] = ( parseFloat(this.options[this.selectedIndex].value) );
              }
              else if (v.confDefaults[this.name].type == 'bool') {
                v.conf[this.name] = ( this.options[this.selectedIndex].value == 'true' ? true : false );
              }
              v.tools.createCustomizingConfObject();
              render();
            });
          valueInOptions = false;
          v.confDefaults[key].options.forEach(function(option){
            currentOption = option;
            form.append('option')
              .attr('value', option)
              .attr('selected', function(){
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
              .style('vertical-align','top')
              .style('padding-left','5px');
          }
        }
      }
      // third column spans over all rows
      tdConfObject
          .attr('rowspan', i)
          .html('Your Configuration Object<br><textarea id="' + v.conf.domContainerId + '_conf_object" tabindex="' + (i + 2) + '" readonly></textarea><br><br>' +
                'Current Positions<br>' +
                '<textarea id="' + v.conf.domContainerId + '_positions" tabindex="' + (i + 3) + '" readonly>Force started - wait for end event to show positions...</textarea><br><br>' +
                'Debug Log (descending)<br>' +
                '<textarea id="' + v.conf.domContainerId + '_log" tabindex="' + (i + 4) + '" readonly></textarea><br><br>' +
                'Copyrights<br><br>' +
                '<a href="https://github.com/ogobrecht/d3-force-apex-plugin" target="github_d3_force" tabindex="' + (i + 5) + '">D3 Force APEX Plugin</a> (' + v.version + ')<br>' +
                'Ottmar Gobrecht<br><br>' +
                '<a href="http://d3js.org" target="d3js_org" tabindex="' + (i + 6) + '">D3.js</a> (' + d3.version + ')<br>' +
                'Mike Bostock<br><br>' +
                '<a href="https://code.google.com/p/x2js/" target="code_google_com" tabindex="' + (i + 7) + '">X2JS</a> (' + v.tools.x2js.getVersion() + ' modified)<br>' +
                'Abdulla Abdurakhmanov<br><br>'
               );
    v.conf.domCustomizeConfObject = d3.select('#' + v.conf.domContainerId + '_conf_object');
    v.conf.domCustomizePositions = d3.select('#' + v.conf.domContainerId + '_positions');
    v.conf.domCustomizeLog = d3.select('#' + v.conf.domContainerId + '_log');
    v.tools.createCustomizingConfObject();
    if (v.conf.currentTabPosition) document.getElementById(v.conf.currentTabPosition).focus();
    else document.querySelector('#' + v.conf.domContainerId + '_customizing select').focus();
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
      if (v.conf.customize) v.conf.domCustomizePositions.text( 'Force started - wait for end event to show positions...' );
      v.tickCounter = 0
      v.startTime = new Date().getTime();
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
      v.tickCounter += 1;
    })
    .on('end', function(){
      var milliseconds = new Date().getTime() - v.startTime;
      var seconds = (milliseconds / 1000).toFixed(1);
      var ticksPerSecond = Math.round(v.tickCounter / (milliseconds / 1000));
      var millisecondsPerTick = Math.round( milliseconds / v.tickCounter );
      if (v.conf.customize) v.conf.domCustomizePositions.text( render.positions() );
      v.tools.log('Force ended.');
      v.tools.log(seconds + ' seconds, ' + v.tickCounter + ' ticks to cool down (' + 
        ticksPerSecond + ' ticks/s, ' + millisecondsPerTick + ' ms/tick).');
    });

  // create drag reference
  v.drag = v.force.drag();
  

  /*************************************************************************
   * RENDER FUNCTION - has to be called on each data refresh
   */

  function render (rawDataString){
    var message;

    // trigger apex event
    v.tools.triggerApexEvent(document.querySelector('#' + v.conf.domContainerId), 'apexbeforerefresh');

    // create customizing form
    if (v.conf.customize) v.tools.customizeChart();
    else d3.select('#' + v.conf.domContainerId + '_customizing').remove();

    if (!rawDataString && !v.data.rawDataString){
      v.tools.logError('Houston, we have a problem - we have to provide sample data.');
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
        try { 
          v.data.rawDataString = v.tools.x2js.xml_str2json(rawDataString); 
          if (v.data.rawDataString === null) {
            message = 'Unable to convert XML data.';
            v.tools.logError(message);
            v.data.rawDataString = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
          }
        }
        catch(e){ 
          message = 'Unable to convert XML data: ' + e.message + '.';
          v.tools.logError(message);
          v.data.rawDataString = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
        }
      }
      else if ( rawDataString.trim().substr(0,1) == '{' ) {
        try { v.data.rawDataString = JSON.parse(rawDataString); }
        catch(e){ 
          message = 'Unable to parse JSON data: ' + e.message + '.';
          v.tools.logError(message);
          v.data.rawDataString = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
        }
      }
      else {
        message = 'Your data is not starting with "<" or "{" - parsing not possible.';
        v.tools.logError(message);
        v.data.rawDataString = {"data":{"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}};
      }

      // write debug infos
	    v.tools.log('Raw data string:');
      v.tools.log(rawDataString, true);
      v.tools.log('Converted JSON object:');
      v.tools.log(v.data.rawDataString, true);
      

      // create references to our ajax data
      if (v.data.hasOwnProperty("rawDataString") && v.data.rawDataString !== null) {
        if (v.data.rawDataString.hasOwnProperty("data") && v.data.rawDataString.data !== null) {
          if (v.data.rawDataString.data.hasOwnProperty("nodes") && v.data.rawDataString.data.nodes !== null) {
            v.data.nodes = v.data.rawDataString.data.nodes;
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
          if (v.data.rawDataString.data.hasOwnProperty("links") && v.data.rawDataString.data.links !== null) {
            v.data.links = v.data.rawDataString.data.links;
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
        message = "Unable to parse your data.";
        v.tools.logError(message);
        v.data = {"nodes":[{"ID":"1","LABEL":"ERROR: " + message,"COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]};
      }

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
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.conf.domContainerId+'_normalTriangle)':null) )
      .classed('dashed', function(l){return(l.STYLE === 'dashed');});
    v.links.enter().append('svg:line')
      .attr('id', function(l) { return v.conf.domContainerId + '_link_' + l.FROMID + '_' + l.TOID; })
      .attr('class', 'link')
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.conf.domContainerId+'_normalTriangle)':null) )
      .classed('dashed', function(l){return(l.STYLE === 'dashed');});
    v.links.exit().remove();

    // SELFLINKS
    v.selfLinks = v.conf.domSvg.selectAll('path.link')
      .data( v.data.links.filter( function(l) { return l.FROMID == l.TOID && v.conf.showSelfLinks; } ),
             function(l){return v.conf.domContainerId + '_link_' + l.FROMID + '_' + l.TOID;})
      .attr('d', function(l) { return v.tools.getSelfLinkPath(l); })
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.conf.domContainerId+'_normalTriangle)':null) )
      .classed('dashed', function(l){return(l.STYLE == 'dashed');});
    v.selfLinks.enter().append('svg:path')
      .attr('id', function(l) { return v.conf.domContainerId + '_link_' + l.FROMID + '_' + l.TOID; })
      .attr('class', 'link')
      .attr('d', function(l) { return v.tools.getSelfLinkPath(l); })
      .style('marker-end', (v.conf.showLinkDirection?'url(#'+v.conf.domContainerId+'_normalTriangle)':null) )
      .classed('dashed', function(l){return(l.STYLE == 'dashed');});
    v.selfLinks.exit().remove();

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

    // CUSTOMIZING LINK
    if ( !v.conf.customize && (v.conf.debug || document.querySelector('#apex-dev-toolbar') !== null) ) {
      if (document.querySelector('#' + v.conf.domContainerId + ' svg text.link') === null) {
        v.conf.domSvg.append('svg:text')
          .attr('class', 'link')
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
      v.conf.domSvg.select('#' + v.conf.domContainerId + ' svg text.link').remove();
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
      // save positions to local storage: v.drag.on('dragend', function(n){ localStorage.setItem(v.conf.domContainerId, JSON.stringify( render.positions() )); });
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
      v.tools.log('Auto refresh started with an interval of ' + v.conf.refreshInterval + ' milliseconds.');
    }
    else if (v.conf.autoRefresh === false && v.conf.interval){
      clearInterval(v.conf.interval);
      v.conf.interval = null;
      v.tools.log('Auto refresh stopped.');
    }

    // trigger apex event
    v.tools.triggerApexEvent(document.querySelector('#' + v.conf.domContainerId), 'apexafterrefresh');

  } //END function render


  /*************************************************************************
   * Public functions
   */

  // public start function: get data and start visualization
  render.start = function(pRawDataString){
    var firstChar;
    // try to use the input data - this means also, we can overwrite the data from APEX with raw data (textarea or whatever you like...)
    if (pRawDataString) {
      render(pRawDataString);
    }
    // if we have no pRawDataString, then we try to use the APEX context (if APEX plugin ID is set)
    else if ( v.conf.apexPluginId ) {
      apex.server.plugin(
        v.conf.apexPluginId,
        { p_debug: $v('pdebug'),
          pageItems: v.conf.apexPageItemsToSubmit.split(",")
        },
        { success: function(rawDataString){
            // rawDataString starts NOT with "<" or "{", when there are no queries defined in APEX or
            // when the queries returns empty data or when a error occurs on the APEX backend side
            firstChar = rawDataString.trim().substr(0,1);
            if ( firstChar == '<' || firstChar == '{' ) {
              render(rawDataString);
            }
            else if (rawDataString.trim().substr(0,16) == "no_query_defined") {
              render(); // this will keep the old data or using the sample data, if no old data existing
              v.tools.logError('No query defined.');
            }
            else if (rawDataString.trim().substr(0,22) == "query_returned_no_data") {
              render('{"data":{"nodes":[{"ID":"1","LABEL":"ERROR: No data.","COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}}');
              v.tools.logError('Query returned no data.');
            }
            else {
              render('{"data":{"nodes":[{"ID":"1","LABEL":"ERROR: ' + rawDataString + '.","COLORVALUE":"1","SIZEVALUE":"1"}],"links":[]}}');
              v.tools.logError(rawDataString);
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
    // if we have no raw data and no APEX context, then we start to render without data (the render function
    // will then provide sample data)
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
        positions += ('{"ID":"' + n.ID + '","x":' + Math.round(n.x) + ',"y":' + Math.round(n.y) + ',"fixed":' + (n.fixed ? 1 : 0) + '},\n');
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
    if (v.conf.customize) v.conf.debug = true;
    return render;
  };

  render.debug = function(value) {
    if (!arguments.length) return v.conf.debug;
    v.conf.debug = value;
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
