prompt --application/set_environment
set define off verify off feedback off
whenever sqlerror exit sql.sqlcode rollback
--------------------------------------------------------------------------------
--
-- ORACLE Application Express (APEX) export file
--
-- You should run the script connected to SQL*Plus as the Oracle user
-- APEX_050100 or as the owner (parsing schema) of the application.
--
-- NOTE: Calls to apex_application_install override the defaults below.
--
--------------------------------------------------------------------------------
begin
wwv_flow_api.import_begin (
 p_version_yyyy_mm_dd=>'2016.08.24'
,p_release=>'5.1.4.00.08'
,p_default_workspace_id=>100000
,p_default_application_id=>100
,p_default_owner=>'PLAYGROUND_DATA'
);
end;
/
prompt --application/shared_components/plugins/region_type/net_gobrechts_d3_force
begin
wwv_flow_api.create_plugin(
 p_id=>wwv_flow_api.id(130317839079452583603)
,p_plugin_type=>'REGION TYPE'
,p_name=>'NET.GOBRECHTS.D3.FORCE'
,p_display_name=>'D3 - Force Layout'
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_plsql_code=>wwv_flow_string.join(wwv_flow_t_varchar2(
'FUNCTION d3_force__render( p_region              IN apex_plugin.t_region',
'                         , p_plugin              IN apex_plugin.t_plugin',
'                         , p_is_printer_friendly IN BOOLEAN )',
'   RETURN apex_plugin.t_region_render_result',
'IS',
'   v_configuration_object apex_application_page_regions.attribute_02%TYPE := p_region.attribute_02;',
'   v_custom_styles        apex_application_page_regions.attribute_03%TYPE := p_region.attribute_03;',
'   v_region_static_id     VARCHAR2( 100 );',
'BEGIN',
'   v_region_static_id := apex_plugin_util.escape( p_region.static_id, TRUE );',
'',
'   apex_css.add_file( p_name      => ''d3-force-''',
'                    , p_directory => p_plugin.file_prefix',
'                    , p_version   => ''#VERSION#'' );',
'',
'   apex_javascript.add_library( p_name                  => ''ResizeObserver-''',
'                              , p_directory             => p_plugin.file_prefix',
'                              , p_version               => ''1.5.0''',
'                              , p_check_to_add_minified => TRUE );',
'',
'   apex_javascript.add_library( p_name                  => ''d3-''',
'                              , p_directory             => p_plugin.file_prefix',
'                              , p_version               => ''3.5.6''',
'                              , p_check_to_add_minified => TRUE );',
'',
'   apex_javascript.add_library( p_name                  => ''d3-force-''',
'                              , p_directory             => p_plugin.file_prefix',
'                              , p_version               => ''#VERSION#''',
'                              , p_check_to_add_minified => TRUE );',
'',
'   HTP.p(    CASE',
'                WHEN v_custom_styles IS NOT NULL THEN',
'                   ''<style>'' || v_custom_styles || ''</style>'' || CHR( 10 )',
'             END',
'          || ''<svg></svg>''',
'          || CHR( 10 ) );',
'',
'   apex_javascript.add_onload_code( --> initialize chart function',
'                                   ''d3_force_''',
'                                    || v_region_static_id --> we need to use a global var - that is the reason to NOT use the var keyword',
'                                    || '' = netGobrechtsD3Force(''',
'                                    --> domContainerId:',
'                                    || apex_javascript.add_value( v_region_static_id, TRUE )',
'                                    --> options:',
'                                    || CASE',
'                                          WHEN v_configuration_object IS NOT NULL THEN',
'                                             v_configuration_object',
'                                          ELSE',
'                                             ''null''',
'                                       END',
'                                    || '', ''',
'                                    --> apexPluginId:',
'                                    || apex_javascript.add_value( apex_plugin.get_ajax_identifier',
'                                                                , TRUE )',
'                                    --> apexPageItemsToSubmit:',
'                                    || apex_javascript.add_value( p_region.ajax_items_to_submit',
'                                                                , FALSE )',
'                                    || '')''',
'                                    || CASE WHEN v( ''DEBUG'' ) = ''YES'' THEN ''.debug(true)'' END',
'                                    || CASE',
'                                          WHEN p_region.attribute_09 IS NOT NULL THEN',
'                                             ''.positions('' || p_region.attribute_09 || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_04 IS NOT NULL THEN',
'                                                ''.onNodeClickFunction(''',
'                                             || p_region.attribute_04',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_05 IS NOT NULL THEN',
'                                                ''.onNodeDblclickFunction(''',
'                                             || p_region.attribute_05',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_06 IS NOT NULL THEN',
'                                                ''.onNodeContextmenuFunction(''',
'                                             || p_region.attribute_06',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_12 IS NOT NULL THEN',
'                                                ''.onLinkClickFunction(''',
'                                             || p_region.attribute_12',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_07 IS NOT NULL THEN',
'                                                ''.onNodeMouseenterFunction(''',
'                                             || p_region.attribute_07',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_08 IS NOT NULL THEN',
'                                                ''.onNodeMouseleaveFunction(''',
'                                             || p_region.attribute_08',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_10 IS NOT NULL THEN',
'                                                ''.onLassoStartFunction(''',
'                                             || p_region.attribute_10',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_11 IS NOT NULL THEN',
'                                                ''.onLassoEndFunction('' ',
'                                             || p_region.attribute_11',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_13 IS NOT NULL THEN',
'                                                ''.onForceStartFunction('' ',
'                                             || p_region.attribute_13',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_14 IS NOT NULL THEN',
'                                                ''.onForceEndFunction('' ',
'                                             || p_region.attribute_14',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_15 IS NOT NULL THEN',
'                                                ''.onRenderEndFunction('' ',
'                                             || p_region.attribute_15',
'                                             || '')''',
'                                       END',
'                                    || CASE',
'                                          WHEN p_region.attribute_16 IS NOT NULL THEN',
'                                                ''.onResizeFunction('' ',
'                                             || p_region.attribute_16',
'                                             || '')''',
'                                       END',
'                                    --> start the visualization',
'                                    || ''.start();'' );',
'   RETURN NULL;',
'END d3_force__render;',
'',
'FUNCTION d3_force__ajax( p_region IN apex_plugin.t_region, p_plugin IN apex_plugin.t_plugin )',
'   RETURN apex_plugin.t_region_ajax_result',
'IS',
'   v_clob  CLOB;',
'   v_binds DBMS_SQL.varchar2_table;',
'   v_cur   INTEGER;',
'   v_ret   INTEGER;',
'BEGIN',
'   IF p_region.source IS NOT NULL THEN',
'      v_binds := wwv_flow_utilities.get_binds( p_region.source );',
'      v_cur   := DBMS_SQL.open_cursor;',
'      DBMS_SQL.parse( c => v_cur, statement => REGEXP_REPLACE(p_region.source,'';\s*$'',''''), language_flag => DBMS_SQL.native );',
'',
'      IF v_binds.COUNT > 0 THEN',
'         FOR i IN v_binds.FIRST .. v_binds.LAST LOOP',
'            DBMS_SQL.bind_variable( v_cur',
'                                  , v_binds( i )',
'                                  , APEX_UTIL.get_session_state( SUBSTR( v_binds( i ), 2 ) ) );',
'         END LOOP;',
'      END IF;',
'',
'      DBMS_SQL.define_column( c => v_cur, position => 1, column => v_clob );',
'      v_ret   := DBMS_SQL.execute( c => v_cur );',
'',
'      WHILE DBMS_SQL.fetch_rows( v_cur ) > 0 LOOP',
'         DBMS_SQL.COLUMN_VALUE( v_cur, 1, v_clob );',
'      END LOOP;',
'',
'      DBMS_SQL.close_cursor( v_cur );',
'',
'      IF sys.DBMS_LOB.getlength( v_clob ) > 0 THEN',
'         DECLARE',
'            v_len PLS_INTEGER;',
'            v_pos PLS_INTEGER := 1;',
'            v_amo PLS_INTEGER := 4000;',
'            v_chu VARCHAR2( 32767 );',
'         BEGIN',
'            v_len := DBMS_LOB.getlength( v_clob );',
'',
'            WHILE v_pos <= v_len LOOP',
'               v_amo := LEAST( v_amo, v_len - ( v_pos - 1 ) );',
'               v_chu := DBMS_LOB.SUBSTR( v_clob, v_amo, v_pos );',
'               v_pos := v_pos + v_amo;',
'               HTP.prn( v_chu );',
'            END LOOP;',
'         END;',
'      ELSE',
'         HTP.prn( ''query_returned_no_data'' ); --> prn prints without newline',
'      END IF;',
'   ELSE',
'      HTP.prn( ''no_query_defined'' );',
'   END IF;',
'',
'   --> Free the temp LOB, if necessary',
'   BEGIN',
'      DBMS_LOB.freetemporary( v_clob );',
'   EXCEPTION',
'      WHEN OTHERS THEN',
'         NULL;',
'   END;',
'',
'   RETURN NULL;',
'EXCEPTION',
'   WHEN OTHERS THEN',
'      --> Close the cursor, if open',
'      BEGIN',
'         IF     v_cur IS NOT NULL',
'            AND DBMS_SQL.is_open( v_cur ) THEN',
'            DBMS_SQL.close_cursor( v_cur );',
'         END IF;',
'      EXCEPTION',
'         WHEN OTHERS THEN',
'            NULL;',
'      END;',
'',
'      apex_debug.MESSAGE( SQLERRM );',
'      --> Write error back to the Browser',
'      HTP.prn( SQLERRM );',
'      RETURN NULL;',
'END d3_force__ajax;',
''))
,p_api_version=>1
,p_render_function=>'d3_force__render'
,p_ajax_function=>'d3_force__ajax'
,p_standard_attributes=>'SOURCE_SQL:AJAX_ITEMS_TO_SUBMIT'
,p_substitute_attributes=>true
,p_subscribe_plugin_settings=>true
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>',
'	See <a href="https://ogobrecht.github.io/d3-force-apex-plugin/">docs &amp; API reference</a>.</p>'))
,p_version_identifier=>'#VERSION#'
,p_about_url=>'https://github.com/ogobrecht/d3-force-apex-plugin'
,p_files_version=>16
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(130312966251234374257)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>2
,p_display_sequence=>10
,p_prompt=>'Configuration Object'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>Copy in here your customizing object from the interactive configuration.</p>',
'<p>You can start the interactive configuration by clicking the link "Customize me" in the rendered page region. The link is shown when the developer toolbar is visible or when the page is in debug mode.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(130312966962615429763)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>3
,p_display_sequence=>20
,p_prompt=>'Custom Styles'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can define custom styles. If you want to have custom styles only for one specific chart on a page with multiple charts, then you have to prefix the CSS with your region static ID. Here an example:</p>',
'',
'<pre>',
'#your_region_static_id .net_gobrechts_d3_force.border {',
'  border: 1px solid red;',
'  border-radius: 5px;',
'}',
'</pre>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(66893235051530831215)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>4
,p_display_sequence=>60
,p_prompt=>'On Node Click Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the node click event.</p>',
'',
'<p>In the first two parameters you get the event and the d3 node data, inside your function you have access to the DOM node with the this keyword.</p>',
'',
'<pre>',
'function(event, data){',
'  console.log("Node click - event:", event);',
'  console.log("Node click - data:", data);',
'  console.log("Node click - this:", this);',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Node Click [D3 - Force Layout]" on your graph region. If you do so, you can access the event and data by executing JavaScript code in this way:</p>',
'',
'<pre>',
'console.log("Node click - event:", this.browserEvent);',
'console.log("Node click - data:", this.data);',
'</pre>',
'    ',
'<p>Please refer also to the APEX dynamic action documentation and keep in mind, that the data is the same in both ways but the event differs, because APEX provide a jQuery event and the Plugin the D3 original event.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(66893240136218838261)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>5
,p_display_sequence=>70
,p_prompt=>'On Node Double Click Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the node double click event.</p>',
'',
'<p>In the first two parameters you get the event and the d3 node data, inside your function you have access to the DOM node with the this keyword.</p>',
'',
'<pre>',
'function(event, data){',
'  console.log("Node double click - event:", event);',
'  console.log("Node double click - data:", data);',
'  console.log("Node double click - this:", this);',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Node Double Click [D3 - Force Layout]" on your graph region. If you do so, you can access the event and data by executing JavaScript code in this way:</p>',
'',
'<pre>',
'console.log("Node double click - event:", this.browserEvent);',
'console.log("Node double click - data:", this.data);',
'</pre>',
'    ',
'<p>Please refer also to the APEX dynamic action documentation and keep in mind, that the data is the same in both ways but the event differs, because APEX provide a jQuery event and the Plugin the D3 original event.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(66893259040735851379)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>6
,p_display_sequence=>80
,p_prompt=>'On Node Contextmenu Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the node contextmenu event.</p>',
'',
'<p>In the first two parameters you get the event and the d3 node data, inside your function you have access to the DOM node with the this keyword.</p>',
'',
'<pre>',
'function(event, data){',
'  console.log("Node contextmenu - event:", event);',
'  console.log("Node contextmenu - data:", data);',
'  console.log("Node contextmenu - this:", this);',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Node Contextmenu [D3 - Force Layout]" on your graph region. If you do so, you can access the event and data by executing JavaScript code in this way:</p>',
'',
'<pre>',
'console.log("Node contextmenu - event:", this.browserEvent);',
'console.log("Node contextmenu - data:", this.data);',
'</pre>',
'    ',
'<p>Please refer also to the APEX dynamic action documentation and keep in mind, that the data is the same in both ways but the event differs, because APEX provide a jQuery event and the Plugin the D3 original event.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(66893241022200844789)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>7
,p_display_sequence=>40
,p_prompt=>'On Node Mouse Enter Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the node mouse enter event.</p>',
'',
'<p>In the first two parameters you get the event and the d3 node data, inside your function you have access to the DOM node with the this keyword.</p>',
'',
'<pre>',
'function(event, data){',
'  console.log("Node mouse enter - event:", event);',
'  console.log("Node mouse enter - data:", data);',
'  console.log("Node mouse enter - this:", this);',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Node Mouse Enter [D3 - Force Layout]" on your graph region. If you do so, you can access the event and data by executing JavaScript code in this way:</p>',
'',
'<pre>',
'console.log("Node mouse enter - event:", this.browserEvent);',
'console.log("Node mouse enter - data:", this.data);',
'</pre>',
'    ',
'<p>Please refer also to the APEX dynamic action documentation and keep in mind, that the data is the same in both ways but the event differs, because APEX provide a jQuery event and the Plugin the D3 original event.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(66893241451518846395)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>8
,p_display_sequence=>50
,p_prompt=>'On Node Mouse Leave Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the node mouse leave event.</p>',
'',
'<p>In the first two parameters you get the event and the d3 node data, inside your function you have access to the DOM node with the this keyword.</p>',
'',
'<pre>',
'function(event, data){',
'  console.log("Node mouse leave - event:", event);',
'  console.log("Node mouse leave - data:", data);',
'  console.log("Node mouse leave - this:", this);',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Node Mouse Leave [D3 - Force Layout]" on your graph region. If you do so, you can access the event and data by executing JavaScript code in this way:</p>',
'',
'<pre>',
'console.log("Node mouse leave - event:", this.browserEvent);',
'console.log("Node mouse leave - data:", this.data);',
'</pre>',
'    ',
'<p>Please refer also to the APEX dynamic action documentation and keep in mind, that the data is the same in both ways but the event differs, because APEX provide a jQuery event and the Plugin the D3 original event.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(67006407531619293114)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>9
,p_display_sequence=>30
,p_prompt=>'Predefined Node Positions'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>Copy in here your node positions from the customize wizard.</p>',
'    ',
'<p>You can start the customize wizard by clicking the link "Customize me" in the rendered page region. The link is shown when the developer toolbar is visible or when the page is in debug mode.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(102776186177734421)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>10
,p_display_sequence=>100
,p_prompt=>'On Lasso Start Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the lasso start event.</p>',
'',
'<p>In the first two parameters you get the event and the d3 lasso data, inside your function you have access to the DOM node with the this keyword. In case of the lasso this is refering the svg container element, because the lasso itself is not inter'
||'esting.</p>',
'',
'<pre>',
'function(event, data){',
'  console.log("Lasso start - event:", event);',
'  console.log("Lasso start - data:", data);',
'  console.log("Lasso start - this:", this);',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Lasso Start [D3 - Force Layout]" on your graph region. If you do so, you can access the event and data by executing JavaScript code in this way:</p>',
'',
'<pre>',
'console.log("Lasso start - event:", this.browserEvent);',
'console.log("Lasso start - data:", this.data);',
'</pre>',
'    ',
'<p>Please refer also to the APEX dynamic action documentation and keep in mind, that the data is the same in both ways but the event differs, because APEX provide a jQuery event and the Plugin the D3 original event.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(102776578617753127)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>11
,p_display_sequence=>110
,p_prompt=>'On Lasso End Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the lasso end event.</p>',
'',
'<p>In the first two parameters you get the event and the d3 lasso data, inside your function you have access to the DOM node with the this keyword. In case of the lasso this is refering the svg container element, because the lasso itself is not inter'
||'esting.</p>',
'',
'<pre>',
'function(event, data){',
'  console.log("Lasso end - event:", event);',
'  console.log("Lasso end - data:", data);',
'  console.log("Lasso end - this:", this);',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Lasso End [D3 - Force Layout]" on your graph region. If you do so, you can access the event and data by executing JavaScript code in this way:</p>',
'',
'<pre>',
'console.log("Lasso end - event:", this.browserEvent);',
'console.log("Lasso end - data:", this.data);',
'</pre>',
'    ',
'<p>Please refer also to the APEX dynamic action documentation and keep in mind, that the data is the same in both ways but the event differs, because APEX provide a jQuery event and the Plugin the D3 original event.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(6425049264554846)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>12
,p_display_sequence=>90
,p_prompt=>'On Link Click Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the link click event.</p>',
'',
'<p>In the first two parameters you get the event and the d3 node data, inside your function you have access to the DOM node with the this keyword.</p>',
'',
'<pre>',
'function(event, data){',
'  console.log("Link click - event:", event);',
'  console.log("Link click - data:", data);',
'  console.log("Link click - this:", this);',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Link Click [D3 - Force Layout]" on your graph region. If you do so, you can access the event and data by executing JavaScript code in this way:</p>',
'',
'<pre>',
'console.log("Link click - event:", this.browserEvent);',
'console.log("Link click - data:", this.data);',
'</pre>',
'    ',
'<p>Please refer also to the APEX dynamic action documentation and keep in mind, that the data is the same in both ways but the event differs, because APEX provide a jQuery event and the Plugin the D3 original event.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(4117413452863564)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>13
,p_display_sequence=>120
,p_prompt=>'On Force Start Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the force start event. No data is provided because this is a very generic event:</p>',
'',
'<pre>',
'function(event){',
'  // your logic here.',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Force Start [D3 - Force Layout]" on your graph region.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(4120528320871837)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>14
,p_display_sequence=>130
,p_prompt=>'On Force End Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the force end event. No data is provided because this is a very generic event:</p>',
'',
'<pre>',
'function(event){',
'  // your logic here.',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Force End [D3 - Force Layout]" on your graph region.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(4121821634874930)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>15
,p_display_sequence=>140
,p_prompt=>'On Render End Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the render end event. No data is provided because this is a very generic event:</p>',
'',
'<pre>',
'function(event){',
'  // your logic here.',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Render End [D3 - Force Layout]" on your graph region.</p>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(4145312218908166)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>16
,p_display_sequence=>150
,p_prompt=>'On Resize Function'
,p_attribute_type=>'TEXTAREA'
,p_is_required=>false
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>You can provide here a function for the resize event. No data is provided because this is a very generic event:</p>',
'',
'<pre>',
'function(event){',
'  // your logic here.',
'}',
'</pre>',
'',
'<p>You can also create an APEX dynamic action on the component event "Resize [D3 - Force Layout]" on your graph region.</p>'))
);
wwv_flow_api.create_plugin_std_attribute(
 p_id=>wwv_flow_api.id(1844221072858042)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'SOURCE_SQL'
,p_is_required=>false
,p_sql_min_column_count=>1
,p_sql_max_column_count=>1
,p_examples=>wwv_flow_string.join(wwv_flow_t_varchar2(
'<p>Your query should result one column single row containing XML or JSON. This can be reached by using serialized XML',
'or JSON. It depends on your system environment - the important thing is: One column, one row of data and NO semicolon',
'to terminate the query.</p>',
'',
'<p>If you provide no query here, you get sample data from the plugin to play around with ;-)</p>',
'',
'<p>Your result should look like this examples - in case of XML you can use the short form with attributes instead of',
'elements. The data is converted in the right way afterwards in JavaScript - therefore the first character of your result',
'is used to identify JSON or XML and must be "{" or "<". You can copy the following example query in your preferred SQL',
'tool and play around - I think, you know the example data :-)</p>',
'',
'<pre>',
'{"data":',
'  {"nodes":[',
'    {"ID":"7839","LABEL":"KING","COLORVALUE":"10","SIZEVALUE":"5000"},',
'    {"ID":"7934","LABEL":"MILLER","COLORVALUE":"10","SIZEVALUE":"1300"}],',
'   "links":[',
'    {"FROMID":"7839","TOID":"7839","STYLE":"solid"},',
'    {"FROMID":"7934","TOID":"7782","STYLE":"dashed"}]',
'  }',
'}',
'',
'Sorry, XML example two times, because of different rendering of pre area in APEX4 and APEX5 :-(',
'',
'<data>',
'  <nodes ID="7839" LABEL="KING" COLORVALUE="10" SIZEVALUE="5000"/>',
'  <nodes ID="7934" LABEL="MILLER" COLORVALUE="10" SIZEVALUE="1300"/>',
'  <links FROMID="7839" TOID="7839" STYLE="solid"/>',
'  <links FROMID="7934" TOID="7782" STYLE="dashed"/>',
'</data>',
'',
'&lt;data&gt;',
'  &lt;nodes ID="7839" LABEL="KING" COLORVALUE="10" SIZEVALUE="5000"/&gt;',
'  &lt;nodes ID="7934" LABEL="MILLER" COLORVALUE="10" SIZEVALUE="1300"/&gt;',
'  &lt;links FROMID="7839" TOID="7839" STYLE="solid"/&gt;',
'  &lt;links FROMID="7934" TOID="7782" STYLE="dashed"/&gt;',
'&lt;/data&gt;',
'</pre>',
'',
'<p>If you look in detail to this example query, you will see, that you have only to provide two simple queries - it is',
'enough to change the column and table names. If you need more complex data for your graph, you are free to find other',
'solutions - depending on your database version and existing libs you can use whatever you want and fit in a SQL query',
'resulting a single clob containing XML or JSON.</p>',
'',
'<pre>',
'WITH',
'nodes AS ( --> START YOUR NODES QUERY HERE',
'  SELECT XMLELEMENT( "nodes", xmlattributes(',
'         empno        AS id',
'       , ename        AS label',
'       , sal          AS sizevalue',
'       , d.deptno     AS colorvalue',
'     --, d.dname      AS colorlabel    -- optional, used for the graph legend',
'     --, ''http://...'' AS link          -- optional',
'     --, ''some text''  AS infostring    -- optional, rendered as tooltip',
'     --, ''false''      AS labelcircular -- optional, overwrites the global labelsCircular',
'     --, ''http://...'' AS image         -- optional, background image for a node instead of a fill color',
'     --, ''true''       AS "fixed"       -- optional | fixed, x and y are native D3 attributes',
'     --, 100          AS "x"           -- optional | they must be lowercase',
'     --, 100          AS "y"           -- optional | you can predefine a layout with these attributes',
'         ) ) AS xml_nodes',
'    FROM emp e join dept d on e.deptno = d.deptno --< STOP YOUR NODES QUERY HERE',
'),',
'links AS ( --> START YOUR LINKS QUERY HERE',
'  SELECT XMLELEMENT( "links", xmlattributes(',
'         empno          AS fromid',
'       , NVL(mgr,empno) AS toid',
'     --, ''dashed''       AS style       -- optional, can be solid (default), dotted or dashed',
'     --, ''red''          AS color       -- optional, must be a HTML color code like green or #00ff00',
'     --, ''some text''    AS infostring  -- optional, rendered as tooltip',
'         ) ) AS xml_links',
'    FROM emp --< STOP YOUR LINKS QUERY HERE',
')',
'SELECT XMLSERIALIZE( DOCUMENT( XMLELEMENT( "data",',
'        ( SELECT XMLAGG( xml_nodes ) FROM nodes ),',
'        ( SELECT XMLAGG( xml_links ) FROM links ) ) ) INDENT ) AS single_clob_result',
'  FROM DUAL',
'</pre>',
''))
);
end;
/
begin
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(65335250331027572433)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_click'
,p_display_name=>'Node Click'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(66895713637540962921)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_contextmenu'
,p_display_name=>'Node Contextmenu'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(65335250722305572433)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_dblclick'
,p_display_name=>'Node Double Click'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(4116308913815963)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_forceend'
,p_display_name=>'Force End'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(4116017802815962)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_forcestart'
,p_display_name=>'Force Start'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(102775787813683976)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_lassoend'
,p_display_name=>'Lasso End'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(102775496781683972)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_lassostart'
,p_display_name=>'Lasso Start'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(6348534826407615)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_linkclick'
,p_display_name=>'Link Click'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(65335249928021572433)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_mouseenter'
,p_display_name=>'Node Mouse Enter'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(65335249632502572430)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_mouseleave'
,p_display_name=>'Node Mouse Leave'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(4116715154815963)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_renderend'
,p_display_name=>'Render End'
);
wwv_flow_api.create_plugin_event(
 p_id=>wwv_flow_api.id(4143215465891394)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_name=>'net_gobrechts_d3_force_resize'
,p_display_name=>'Resize'
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#CSS#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(1881552738897756)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-force-#VERSION#.css'
,p_mime_type=>'text/css'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#JS#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(1881807546897765)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-force-#VERSION#.js'
,p_mime_type=>'application/javascript'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#JS_MIN#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(1882203048897768)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-force-#VERSION#.min.js'
,p_mime_type=>'application/javascript'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#RESIZE#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(4131432597047718)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'ResizeObserver-1.5.0.js'
,p_mime_type=>'application/javascript'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#RESIZE_MIN#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(4132131960049228)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'ResizeObserver-1.5.0.min.js'
,p_mime_type=>'application/javascript'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#RESIZE_LICENSE#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(4132804310057298)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'ResizeObserver-LICENSE.txt'
,p_mime_type=>'text/plain'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#D3_MIN#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(6475939208097894)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-3.5.6.min.js'
,p_mime_type=>'text/javascript'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#D3#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(6476627507099244)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-3.5.6.js'
,p_mime_type=>'text/javascript'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#LICENSE#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(8178525291254288)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-force-LICENSE.txt'
,p_mime_type=>'text/plain'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#D3_LASSO_LICENSE#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(8179421893259172)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-plugin-lasso-LICENSE.txt'
,p_mime_type=>'text/plain'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#D3_LABELER_LICENSE#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(8180121256260040)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-plugin-labeler-LICENSE.txt'
,p_mime_type=>'text/plain'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
#D3_LICENSE#end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(67653015039934591891)
,p_plugin_id=>wwv_flow_api.id(130317839079452583603)
,p_file_name=>'d3-LICENSE.txt'
,p_mime_type=>'text/plain'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.import_end(p_auto_install_sup_obj => nvl(wwv_flow_application_install.get_auto_install_sup_obj, false), p_is_component_import => true);
commit;
end;
/
set verify on feedback on define on
prompt  ...done
