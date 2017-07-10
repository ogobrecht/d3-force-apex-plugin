Please note, that you have to deliver distinct data to ensure your graph is rendered correctly - see also this [issue on GitHub](https://github.com/ogobrecht/d3-force-apex-plugin/issues/17). It is always a good idea to review your queries/data before you try to use it in a visualization ;-)

## Oracle - Table EMP

This query is the base for the shipped sample data:

```sql
WITH
nodes AS ( --> START YOUR NODES QUERY HERE
  SELECT XMLELEMENT( "nodes", xmlattributes(
         empno        AS id
       , ename        AS label
       , sal          AS sizevalue
       , d.deptno     AS colorvalue
     --, d.dname      AS colorlabel    -- optional, used for the graph legend
     --, 'http://...' AS link          -- optional
     --, 'some text'  AS infostring    -- optional, rendered as tooltip
     --, 'false'      AS labelcircular -- optional, overwrites labelsCircular
     --, 'http://...' AS image         -- optional, background image for a node
     --, 'true'       AS "fixed"       -- optional | fixed, x and y are native
     --, 100          AS "x"           -- optional | D3 attributes, they must be
     --, 100          AS "y"           -- optional | lowercase
         ) ) AS xml_nodes
    FROM emp e join dept d on e.deptno = d.deptno --< STOP YOUR NODES QUERY HERE
),
links AS ( --> START YOUR LINKS QUERY HERE
  SELECT XMLELEMENT( "links", xmlattributes(
         empno          AS fromid
       , NVL(mgr,empno) AS toid
     --, 'dashed'       AS style       -- optional, solid, dotted or dashed
     --, 'red'          AS color       -- optional, must be a HTML color code
     --, 'some text'    AS infostring  -- optional, rendered as tooltip
         ) ) AS xml_links
    FROM emp --< STOP YOUR LINKS QUERY HERE
)
SELECT XMLSERIALIZE( DOCUMENT( XMLELEMENT( "data",
       ( SELECT XMLAGG( xml_nodes ) FROM nodes ),
       ( SELECT XMLAGG( xml_links ) FROM links ) ) ) INDENT ) AS single_clob_result
  FROM DUAL
```


## Oracle - Data Model of Current Schema

With this query you can visualize the data model of the current schema. Tested on Oracle 11g. Some subqueries select more data then needed for the visualization - this could be a starting point for your own custom visualization.

ATTENTION: I tried to speed up the dictionary queries by using the with clause and filtering each subquery for the desired tables. Also, I tried to get the correct NOT NULL informations from the dictionary, since the nullable column in user_tab_columns does not reflect table level not null constraints. If you play around with the query to find an own solution you can run in massive performance problems when you join directly the dictionary views.

Many thanks to Adrian Billington for his excellent [article about working with long columns](http://www.oracle-developer.net/display.php?id=430).

```sql
--> The following helper function is needed to read the constraint search condition:
CREATE OR REPLACE FUNCTION get_long_search_condition( p_constraint_name IN VARCHAR2 )
   RETURN VARCHAR2
AS
   v_return LONG;
   CURSOR c_search_condition
   IS
        SELECT search_condition
          FROM user_constraints
         WHERE constraint_name = p_constraint_name;
BEGIN
   OPEN c_search_condition;
   FETCH c_search_condition INTO v_return;
   CLOSE c_search_condition;
   RETURN SUBSTR( v_return, 1, 4000 );
END;
```

```sql
WITH
tabs AS ( --> filter your tables here, all other queries use tabs as filter
  SELECT table_name
       , NVL( num_rows, 0 ) AS num_rows
       , CASE --> used for coloring the nodes in the graph
            WHEN table_name LIKE 'APEX$%' THEN 'APEX websheet apps'
            WHEN table_name LIKE 'DEMO%' THEN 'Sample database app'
            WHEN table_name in ('EMP', 'DEPT') THEN
               'The well known emp & dept tables'
            ELSE 'uncategorized tables'
         END
            AS table_group
    FROM user_tables
   WHERE table_name NOT LIKE 'PLSQL%'
),
cons AS (
  SELECT owner
       , constraint_name
       , constraint_type
       , table_name
       , get_long_search_condition( constraint_name ) AS search_condition
       , r_owner
       , r_constraint_name
       , delete_rule
       , status
    FROM user_constraints
   WHERE table_name IN (SELECT table_name FROM tabs)
),
concols AS (
  SELECT owner
       , constraint_name
       , table_name
       , column_name
       , position
    FROM user_cons_columns
   WHERE table_name IN (SELECT table_name FROM tabs)
),
connotnulls AS ( --> because of primary keys and not null check constraints we
                 --> have to select distinct here
  SELECT   DISTINCT table_name, column_name, nullable
     FROM (  SELECT c.table_name
                  , cc.column_name
                  , c.constraint_name
                  , c.constraint_type
                  , c.search_condition
                  , 'N' AS nullable
               FROM cons c
               JOIN concols cc ON c.constraint_name = cc.constraint_name
              WHERE     c.status = 'ENABLED'
                    AND (   c.constraint_type = 'P'
                         OR     c.constraint_type = 'C'
                            AND REGEXP_COUNT( TRIM( c.search_condition )
                                            ,    '^"{0,1}'
                                              || cc.column_name
                                              || '"{0,1}\s+is\s+not\s+null$'
                                            , 1
                                            , 'i' ) = 1 ))
),
tabcols AS (
  SELECT t.table_name
       , t.column_name
       , t.data_type
       , t.data_length
       , t.data_precision
       , t.data_scale
       , t.nullable AS nullable_dict
       --> dict does not recognize table level not null constraints:
       --> working with long columns:
       --> http://www.oracle-developer.net/display.php?id=430
       , NVL( n.nullable, 'Y' ) AS nullable_cons
    FROM user_tab_columns t
         LEFT JOIN connotnulls n
            ON     t.table_name = n.table_name
               AND t.column_name = n.column_name
   WHERE t.table_name IN (SELECT table_name FROM tabs)
),
fks AS (
   SELECT concols.table_name AS source_table
       , r_concols.table_name AS target_table
       , cons.status
       , tabcols.nullable_cons
    FROM cons
         JOIN concols
            ON cons.constraint_name = concols.constraint_name
          JOIN concols r_concols
            ON cons.r_constraint_name = r_concols.constraint_name
         JOIN tabcols
            ON     concols.table_name = tabcols.table_name
               AND concols.column_name = tabcols.column_name
   WHERE     cons.constraint_type = 'R'
         AND cons.status = 'ENABLED'
),
nodes AS ( --> START YOUR NODES QUERY HERE
  SELECT   XMLELEMENT( "nodes"
                     , xmlattributes( table_name AS id
                                    , table_name AS label
                                    , table_group AS colorvalue
                                    , num_rows AS sizevalue ) )
              AS xml_nodes
    FROM tabs --< STOP YOUR NODES QUERY HERE
),
links AS ( --> START YOUR LINKS QUERY HERE
  SELECT   XMLELEMENT( "links"
                     , xmlattributes( source_table AS fromid
                                    , target_table AS toid
                                    , CASE nullable_cons
                                         WHEN 'Y' THEN 'dashed'
                                         WHEN 'N' THEN 'solid'
                                      END AS style )
                     , status )
              AS xml_links
    FROM fks --< STOP YOUR LINKS QUERY HERE
)
SELECT XMLSERIALIZE( DOCUMENT( XMLELEMENT( "data",
       ( SELECT XMLAGG( xml_nodes ) FROM nodes ),
       ( SELECT XMLAGG( xml_links ) FROM links ) ) ) INDENT ) AS single_clob_result
  FROM DUAL
```
