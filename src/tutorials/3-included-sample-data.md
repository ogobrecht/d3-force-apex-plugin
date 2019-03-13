The following data (XML notation, not all records shown) is included in the source code. You can deliver your data in three formats: JSON object, JSON string or XML string. See the examples below.


## JSON Notation Example

```js
{
  "data":{
    "nodes":[
      {
        "ID":"7839",
        "LABEL":"KING is THE KING, you know?",
        "COLORVALUE":"10",
        "COLORLABEL":"Accounting",
        "SIZEVALUE":5000,
        "LABELCIRCULAR":true,
        "LINK":"http://apex.oracle.com/",
        "INFOSTRING":"This visualization is based on the well known emp table."
      },
      {
        "ID":"7698",
        "LABEL":"BLAKE",
        "COLORVALUE":"30",
        "COLORLABEL":"Sales",
        "SIZEVALUE":2850
      }
    ],
    "links":[
      {
        "FROMID":"7839",
        "TOID":"7839",
        "STYLE":"dotted",
        "COLOR":"blue",
        "INFOSTRING":"This is a self link (same source and target node) rendered along a path with the STYLE attribute set to dotted and COLOR attribute set to blue."
      },
      {
        "FROMID":"7698",
        "TOID":"7839",
        "STYLE":"dashed",
        "LABEL":"A link label"
      }
    ]
  }
}
```

## XML Notation Example

```xml
<data>
  <nodes
    ID="7839"
    LABEL="KING is THE KING, you know?"
    COLORVALUE="10"
    COLORLABEL="Accounting"
    SIZEVALUE="5000"
    LABELCIRCULAR="true"
    LINK="http://apex.oracle.com/"
    INFOSTRING="This visualization is based on the well known emp table."
  />
  <nodes
    ID="7698"
    LABEL="BLAKE"
    COLORVALUE="30"
    COLORLABEL="Sales"
    SIZEVALUE="2850"
  />
  <links
    FROMID="7839"
    TOID="7839"
    STYLE="dotted"
    COLOR="blue"
    INFOSTRING="This is a self link (same source and target node) rendered along a path with the STYLE attribute set to dotted and COLOR attribute set to blue."
  />
  <links
    FROMID="7698"
    TOID="7839"
    STYLE="dashed"
    LABEL="A link label"
  />
</data>
```
