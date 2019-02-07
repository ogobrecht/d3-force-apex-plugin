Some people have special use cases and ask interesting questions. On this page we collect them to provide examples for other users.


## Speed up background images on nodes

When you use background images on nodes instead of background colors this can slow down your graphs render performance. This is depending on the render performance of your browser, but even the fastest browser engines can have big problems with too many and/or too big images.

One possible workaround is to switch the background images to background colors when the force is starting and switch back to images when the force is stopping. Fortunately we have events for this available. Here an example - please align the graphs variable `example` to your specific one:

```js
example.onForceStartFunction(
  function () {
    example.nodes().each(function (node) {
      elem = d3.select(this);
      // Save the reference to the SVG pattern in a new node attribute.
      // Your provided image URL is used in the pattern, not direct in the fill attribute.
      // This is how SVG works, sorry. You can inspect the patterns in your browser console.
      node.fill_backup = elem.style("fill");
      elem.style("fill", "silver")
    });
  }
);

example.onForceEndFunction(
  function () {
    example.nodes().each(function (node) {
       // Write back the saved reference to the SVG pattern.
      d3.select(this).style("fill", node.fill_backup);
    });
  }
);
```

Thanks are going to github.com/Ignacius68 for questions around this topic.


## Stop force early when all nodes are fixed

This use case can be related to the previous one. If you deliver data with predefined, fixed positions for all nodes then the force is still running and calculate all positions. The fixed nodes are not updated within the ticks but the force is running as usual. This might become a problem when you wait for the force end to do some own things - like with the images from the previous use case.

The force has to run a minimum time to correct render all nodes. So what can we do? The graph API has currently no method to stop the force directly, but there is a trick. The graph API exposes a method mainly for debugging named `inspect`. With this method you have access to all the graph internal variables and functions. You can try this out in your browser console by executing `example.inspect()`.

To stop the force after 100ms we reuse the inspect method like so:

```js
example.onForceStartFunction(function () {
  setTimeout(function () {
    example.inspect().main.force.stop();
  }, 100);
})

Thanks are going to github.com/Ignacius68 for questions around this topic.
