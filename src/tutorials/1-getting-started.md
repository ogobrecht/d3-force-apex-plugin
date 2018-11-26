{{EXAMPLE-GRAPH}}

The graph above was started with this code:
```html
{{EXAMPLE-GRAPH-CODE}}
```

## Installation


### APEX

- Download the [latest version][zip]
- Install the plugin by importing the sql file in the folder `apex-plugin`


### Any HTML page

- Download the [latest version][zip]
- See `dist/example.html`

[zip]: https://github.com/ogobrecht/d3-force-apex-plugin/releases/latest


When using the Oracle APEX plugin, your variable to access the graph is automatically set by the plugin. You can open the JavaScript console in your browser and look for `d3_force_YOUR_REGION_STATIC_ID`. You can then interact with the graph - in the example we inspect the graphs current variables:

```js
example.inspect();                        // in the example above
d3_force_YOUR_REGION_STATIC_ID.inspect(); // when using the Oracle APEX plugin

// or you can change the width of your graph:
example.width(700).resume();
d3_force_YOUR_REGION_STATIC_ID.width(700).resume();

// there are more then sixty methods...
// please have a look in the API methods overview
```

## Providing Data

You can provide data to the [render](./module-API.html#.render) (or [start](./module-API.html#.start) ) function. This data can be a JSON object, a JSON string or a XML string. Below the call for the graph variable `example` with the graph method `render` and the data for two nodes and links.

For all people outside the Oracle world: we use here data from an example employees table which is used since years for almost all Oracle related SQL trainings. Inside this table you find employees with an ID, name, salary, department ID and so on. We use here the department ID to color the nodes and the salary to calculate the node sizes.

Please have also a look at the [possible node and link attributes](./tutorial-2-node-and-link-attributes.html)

```js
example.render({
    "data": {
        "nodes": [{
                "ID": "7839",
                "LABEL": "KING is THE KING, you know?",
                "COLORVALUE": "10",
                "COLORLABEL": "Accounting",
                "SIZEVALUE": 5000,
                "LABELCIRCULAR": true,
                "LINK": "http://apex.oracle.com/",
                "INFOSTRING": "This visualization is based on the well known emp table."
            },
            {
                "ID": "7698",
                "LABEL": "BLAKE",
                "COLORVALUE": "30",
                "COLORLABEL": "Sales",
                "SIZEVALUE": 2850
            }
        ],
        "links": [{
                "FROMID": "7839",
                "TOID": "7839",
                "STYLE": "dotted",
                "COLOR": "blue",
                "INFOSTRING": "This is a self link (same source and target node) rendered along a path with the STYLE attribute set to dotted and COLOR attribute set to blue."
            },
            {
                "FROMID": "7698",
                "TOID": "7839",
                "STYLE": "dashed"
            }
        ]
    }
});
```

You can export the current graph data as a JSON object at every time with the [data](./module-API.html#.data) method:

```js
//JSON object
example.data();

//stringified JSON object
JSON.stringify(example.data());
```


## Configure The Graph

There are two ways to configure the graph:

1. Provide a configuration object to the graph function on initialisation
2. Use API methods before starting the graph or also on runtime

### Configuration Object

```js
var example = netGobrechtsD3Force(
    'domContainerToAppendTheGraph',
    {"width":"700", "height":"500"}
    )
    .render({"data":{
        "nodes":[{...}, {...}],
        "links":[{...}, {...}]
    }});
```

### API Methods

```js
var example = netGobrechtsD3Force(
    'domContainerToAppendTheGraph'
    )
    .width(700)
    .height(500)
    .render({"data":{
        "nodes":[{...}, {...}],
        "links":[{...}, {...}]
    }});
```

Of course you can combine the two ways:

```js
var example = netGobrechtsD3Force(
    'domContainerToAppendTheGraph',
    {"width":"700","height":"500"}
    )
    .onNodeClickFunction(
        function(event, data){
            console.log(event, data, this);
        }
    )
    .debug(true)
    .render({"data":{
        "nodes":[{...}, {...}],
        "links":[{...}, {...}]
    }});
```

If the DOM container is not existing, then the container is created under the body element.

### Customization wizard

You can use the customization wizard to get your configuration object. This
wizard has a predefined set of values, e.g. you can choose values between 300
and 1200 for the width. If this does not meet your requirements, you can of
course change these values in your configuration object. If you do so and use
the customization wizard later on, your additional values are appended to the
select lists of the wizard.

There are two ways to start the wizard:

1. Click the link “Customize Me” in the graph - this link is shown, when the graph is in debug mode (when you are using the APEX plugin with a Application Builder session, then the debug mode is automatically set to true): `example.debug(true);`
2. Directly start the wizard by setting the customize option to true: `example.customize(true);`

Each configuration option in the wizard is also implemented as a get and set method:

```js
example.width();             //get the current graph width
example.width(700).resume(); //set the current graph width and resume the graph
```

ATTENTION: Some options/methods are instantly working, some needs a resume of the graph force, some needs a complete render cycle with the start or render method. Please have also a look in the method descriptions for [start](./module-API.html#.start), [render](./module-API.html#.render), [resume](./module-API.html#.resume).
