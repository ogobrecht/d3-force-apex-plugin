The shortest possible way to get up and running a graph with the shipped sample data:

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>D3 Force APEX Plugin</title>
    <link href="css/d3-force-2.0.1.css" rel="stylesheet" type="text/css">
    <script src="lib/d3/d3-3.5.6.min.js"></script>
    <script src="js/d3-force-2.0.1.min.js"></script>
</head>

<body
    onload="example = netGobrechtsD3Force().render();">
</body>

</html>
```

When using the APEX plugin, your variable to access the graph is automatically set by the plugin. You can open the JavaScript console in your browser and look for `d3_force_YOUR_REGION_STATIC_ID`. You can then interact with the graph - in the example we inspect the graphs current variables:

```js
example.inspect();                        // in the example above
d3_force_YOUR_REGION_STATIC_ID.inspect(); // when using the APEX plugin

// or you can change the width of your graph:
d3_force_YOUR_REGION_STATIC_ID.width(700).resume();

// there are more then sixty methods...
// please have a look in the API methods overview
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
