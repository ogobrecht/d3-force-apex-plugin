Node and link attributes are case sensitive:


## Nodes

- `ID`: mandatory, string, alphanumeric node identifier
- `SIZEVALUE`: mandatory, number, numeric base for radius calculation
- `COLORVALUE`: mandatory, string, HTML color code or any alphanumeric string - see also [colorScheme](./module-API.html#.colorScheme)
- `COLORLABEL`: optional, string, used for legend - if not existing, colorvalue is used instead
- `LABEL`: optional, string, label for the node
- `LABELCIRCULAR`: optional, boolean, overwrites the global option [labelsCircular](./module-API.html#.labelsCircular)
- `INFOSTRING`: optional, string, this string is shown as a tooltip - see also [showTooltips](./module-API.html#.showTooltips) and [tooltipPosition](./module-API.html#.tooltipPosition)
- `LINK`: optional, string, URL to open on configurable event - see also [nodeEventToOpenLink](./module-API.html#.nodeEventToOpenLink)
- `IMAGE`: optional, string, URL to a background image for a node instead of a fill color
- `fixed`: optional, boolean, pin status of a node
- `x`: optional, number, x position of fixed (pinned) node
- `y`: optional, number, y position of fixed (pinned) node

Fixed, x and y are native D3 attributes - they must be lowercase.


## Links

- `FROMID`: mandatory, string, id of node, where a link starts (links are able to showing directions, see also [showLinkDirection](./module-API.html#.showLinkDirection))
- `TOID`: mandatory, string, id of node, where a link ends
- `STYLE`: optional, string, can be `solid` (default), `dotted` or `dashed`
- `COLOR`: optional, string, must be a HTML color code like `green` or `#00ff00`
- `LABEL`: optional, string, label for the link
- `INFOSTRING`: optional, string, this string is shown as a tooltip - see also [showTooltips](./module-API.html#.showTooltips) and [tooltipPosition](./module-API.html#.tooltipPosition)
