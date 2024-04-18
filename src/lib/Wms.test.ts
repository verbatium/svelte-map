import {describe, expect, it} from 'vitest'
import {Wms} from '$lib/Wms'
import {draw} from 'svelte/transition'


describe('', ()=>{
  const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE WMT_MS_Capabilities SYSTEM "http://primar.ecc.no/primar/schemas/ogc/wms/1.1.1/WMS_MS_Capabilities.dtd">
<WMT_MS_Capabilities updateSequence="1" version="1.1.1">
  <Service>
    <Name>OGC:WMS</Name>
    <Title>GDS WMS Service</Title>
    <Abstract>GDS WMS Service</Abstract>
    <KeywordList>
      <Keyword/>
    </KeywordList>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri" xlink:type="simple"/>
    <Fees>none</Fees>
    <AccessConstraints>none</AccessConstraints>
  </Service>
  <Capability>
    <Request>
      <GetCapabilities>
        <Format>application/vnd.ogc.wms_xml</Format>
        <DCPType>
          <HTTP>
            <Get>
              <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri" xlink:type="simple"/>
            </Get>
          </HTTP>
        </DCPType>
      </GetCapabilities>
      <GetMap>
        <Format>application/pdf</Format>
        <Format>image/gif</Format>
        <Format>image/jpeg</Format>
        <Format>image/png</Format>
        <Format>image/png16</Format>
        <Format>image/png32</Format>
        <Format>image/png8</Format>
        <Format>image/png; mode=16bit</Format>
        <Format>image/png; mode=32bit</Format>
        <Format>image/png; mode=8bit</Format>
        <DCPType>
          <HTTP>
            <Get>
              <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri" xlink:type="simple"/>
            </Get>
          </HTTP>
        </DCPType>
      </GetMap>
      <GetFeatureInfo>
        <Format>text/plain</Format>
        <Format>text/html</Format>
        <Format>application/json</Format>
        <DCPType>
          <HTTP>
            <Get>
              <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri" xlink:type="simple"/>
            </Get>
          </HTTP>
        </DCPType>
      </GetFeatureInfo>
    </Request>
    <Exception>
      <Format>application/vnd.ogc.se_xml</Format>
    </Exception>
    <Layer>
      <Title>GDS WMS Layers</Title>
      <SRS>CRS:84</SRS>
      <SRS>EPSG:111111</SRS>
      <SRS>EPSG:111112</SRS>
      <SRS>EPSG:111113</SRS>
      <SRS>EPSG:111114</SRS>
      <SRS>EPSG:111115</SRS>
      <SRS>EPSG:111116</SRS>
      <SRS>EPSG:111117</SRS>
      <SRS>EPSG:111118</SRS>
      <SRS>EPSG:111119</SRS>
      <SRS>EPSG:111120</SRS>
      <SRS>EPSG:111121</SRS>
      <SRS>EPSG:111122</SRS>
      <SRS>EPSG:111123</SRS>
      <SRS>EPSG:111124</SRS>
      <SRS>EPSG:111125</SRS>
      <SRS>EPSG:111126</SRS>
      <SRS>EPSG:111127</SRS>
      <SRS>EPSG:111128</SRS>
      <SRS>EPSG:111129</SRS>
      <SRS>EPSG:111130</SRS>
      <SRS>EPSG:111131</SRS>
      <SRS>EPSG:23028</SRS>
      <SRS>EPSG:23029</SRS>
      <SRS>EPSG:23030</SRS>
      <SRS>EPSG:23031</SRS>
      <SRS>EPSG:23032</SRS>
      <SRS>EPSG:23033</SRS>
      <SRS>EPSG:23034</SRS>
      <SRS>EPSG:23035</SRS>
      <SRS>EPSG:23036</SRS>
      <SRS>EPSG:23037</SRS>
      <SRS>EPSG:23038</SRS>
      <SRS>EPSG:25828</SRS>
      <SRS>EPSG:25829</SRS>
      <SRS>EPSG:25830</SRS>
      <SRS>EPSG:25831</SRS>
      <SRS>EPSG:25832</SRS>
      <SRS>EPSG:25833</SRS>
      <SRS>EPSG:25834</SRS>
      <SRS>EPSG:25835</SRS>
      <SRS>EPSG:25836</SRS>
      <SRS>EPSG:25837</SRS>
      <SRS>EPSG:25838</SRS>
      <SRS>EPSG:3006</SRS>
      <SRS>EPSG:3035</SRS>
      <SRS>EPSG:3067</SRS>
      <SRS>EPSG:32601</SRS>
      <SRS>EPSG:32602</SRS>
      <SRS>EPSG:32603</SRS>
      <SRS>EPSG:32604</SRS>
      <SRS>EPSG:32605</SRS>
      <SRS>EPSG:32606</SRS>
      <SRS>EPSG:32607</SRS>
      <SRS>EPSG:32608</SRS>
      <SRS>EPSG:32609</SRS>
      <SRS>EPSG:32610</SRS>
      <SRS>EPSG:32611</SRS>
      <SRS>EPSG:32612</SRS>
      <SRS>EPSG:32613</SRS>
      <SRS>EPSG:32614</SRS>
      <SRS>EPSG:32615</SRS>
      <SRS>EPSG:32616</SRS>
      <SRS>EPSG:32617</SRS>
      <SRS>EPSG:32618</SRS>
      <SRS>EPSG:32619</SRS>
      <SRS>EPSG:32620</SRS>
      <SRS>EPSG:32621</SRS>
      <SRS>EPSG:32622</SRS>
      <SRS>EPSG:32623</SRS>
      <SRS>EPSG:32624</SRS>
      <SRS>EPSG:32625</SRS>
      <SRS>EPSG:32626</SRS>
      <SRS>EPSG:32627</SRS>
      <SRS>EPSG:32628</SRS>
      <SRS>EPSG:32629</SRS>
      <SRS>EPSG:32630</SRS>
      <SRS>EPSG:32631</SRS>
      <SRS>EPSG:32632</SRS>
      <SRS>EPSG:32633</SRS>
      <SRS>EPSG:32634</SRS>
      <SRS>EPSG:32635</SRS>
      <SRS>EPSG:32636</SRS>
      <SRS>EPSG:32637</SRS>
      <SRS>EPSG:32638</SRS>
      <SRS>EPSG:32639</SRS>
      <SRS>EPSG:32640</SRS>
      <SRS>EPSG:32641</SRS>
      <SRS>EPSG:32642</SRS>
      <SRS>EPSG:32643</SRS>
      <SRS>EPSG:32644</SRS>
      <SRS>EPSG:32645</SRS>
      <SRS>EPSG:32646</SRS>
      <SRS>EPSG:32647</SRS>
      <SRS>EPSG:32648</SRS>
      <SRS>EPSG:32649</SRS>
      <SRS>EPSG:32650</SRS>
      <SRS>EPSG:32651</SRS>
      <SRS>EPSG:32652</SRS>
      <SRS>EPSG:32653</SRS>
      <SRS>EPSG:32654</SRS>
      <SRS>EPSG:32655</SRS>
      <SRS>EPSG:32656</SRS>
      <SRS>EPSG:32657</SRS>
      <SRS>EPSG:32658</SRS>
      <SRS>EPSG:32659</SRS>
      <SRS>EPSG:32660</SRS>
      <SRS>EPSG:32701</SRS>
      <SRS>EPSG:32702</SRS>
      <SRS>EPSG:32703</SRS>
      <SRS>EPSG:32704</SRS>
      <SRS>EPSG:32705</SRS>
      <SRS>EPSG:32706</SRS>
      <SRS>EPSG:32707</SRS>
      <SRS>EPSG:32708</SRS>
      <SRS>EPSG:32709</SRS>
      <SRS>EPSG:32710</SRS>
      <SRS>EPSG:32711</SRS>
      <SRS>EPSG:32712</SRS>
      <SRS>EPSG:32713</SRS>
      <SRS>EPSG:32714</SRS>
      <SRS>EPSG:32715</SRS>
      <SRS>EPSG:32716</SRS>
      <SRS>EPSG:32717</SRS>
      <SRS>EPSG:32718</SRS>
      <SRS>EPSG:32719</SRS>
      <SRS>EPSG:32720</SRS>
      <SRS>EPSG:32721</SRS>
      <SRS>EPSG:32722</SRS>
      <SRS>EPSG:32723</SRS>
      <SRS>EPSG:32724</SRS>
      <SRS>EPSG:32725</SRS>
      <SRS>EPSG:32726</SRS>
      <SRS>EPSG:32727</SRS>
      <SRS>EPSG:32728</SRS>
      <SRS>EPSG:32729</SRS>
      <SRS>EPSG:32730</SRS>
      <SRS>EPSG:32731</SRS>
      <SRS>EPSG:32732</SRS>
      <SRS>EPSG:32733</SRS>
      <SRS>EPSG:32734</SRS>
      <SRS>EPSG:32735</SRS>
      <SRS>EPSG:32736</SRS>
      <SRS>EPSG:32737</SRS>
      <SRS>EPSG:32738</SRS>
      <SRS>EPSG:32739</SRS>
      <SRS>EPSG:32740</SRS>
      <SRS>EPSG:32741</SRS>
      <SRS>EPSG:32742</SRS>
      <SRS>EPSG:32743</SRS>
      <SRS>EPSG:32744</SRS>
      <SRS>EPSG:32745</SRS>
      <SRS>EPSG:32746</SRS>
      <SRS>EPSG:32747</SRS>
      <SRS>EPSG:32748</SRS>
      <SRS>EPSG:32749</SRS>
      <SRS>EPSG:32750</SRS>
      <SRS>EPSG:32751</SRS>
      <SRS>EPSG:32752</SRS>
      <SRS>EPSG:32753</SRS>
      <SRS>EPSG:32754</SRS>
      <SRS>EPSG:32755</SRS>
      <SRS>EPSG:32756</SRS>
      <SRS>EPSG:32757</SRS>
      <SRS>EPSG:32758</SRS>
      <SRS>EPSG:32759</SRS>
      <SRS>EPSG:32760</SRS>
      <SRS>EPSG:3301</SRS>
      <SRS>EPSG:3395</SRS>
      <SRS>EPSG:3575</SRS>
      <SRS>EPSG:3857</SRS>
      <SRS>EPSG:3995</SRS>
      <SRS>EPSG:4230</SRS>
      <SRS>EPSG:4326</SRS>
      <SRS>EPSG:900913</SRS>
      <LatLonBoundingBox maxx="180" maxy="90" minx="-180" miny="-90"/>
      <BoundingBox SRS="EPSG:3006" maxx="1083427.297" maxy="7692850.9468" minx="218128.7031" miny="6126002.9379"/>
      <BoundingBox SRS="EPSG:3035" maxx="5097858.868527094" maxy="5446513.5221630465" minx="2426378.0131959096" miny="1528101.2618327793"/>
      <BoundingBox SRS="EPSG:3067" maxx="761274.6247" maxy="7799839.8902" minx="50199.4814" miny="6582464.0358"/>
      <BoundingBox SRS="EPSG:32632" maxx="1145510.0" maxy="9329005.1825" minx="-1300000.0" miny="0.0"/>
      <BoundingBox SRS="EPSG:32633" maxx="1145510.0" maxy="9329005.1825" minx="-1300000.0" miny="0.0"/>
      <BoundingBox SRS="EPSG:32634" maxx="1145510.0" maxy="9329005.1825" minx="-1300000.0" miny="0.0"/>
      <BoundingBox SRS="EPSG:32635" maxx="1145510.0" maxy="9329005.1825" minx="-1300000.0" miny="0.0"/>
      <BoundingBox SRS="EPSG:3301" maxx="800000.0" maxy="6700000.0" minx="300000.0" miny="6300000.0"/>
      <BoundingBox SRS="EPSG:3575" maxx="9036842.762" maxy="9036842.762" minx="-9036842.762" miny="-9036842.762"/>
      <BoundingBox SRS="EPSG:4326" maxx="180.0" maxy="90.0" minx="-180.0" miny="-90.0"/>
      <Layer noSubsets="0" opaque="0" queryable="0">
        <Name>background</Name>
        <Title>Background</Title>
        <Abstract>Background</Abstract>
        <Style>
          <Name>default</Name>
          <Title>Default style</Title>
        </Style>
      </Layer>
      <Layer noSubsets="0" opaque="0" queryable="1">
        <Name>wmsProductCoverage</Name>
        <Title>WMS Products Coverage</Title>
      </Layer>
      <Layer noSubsets="0" opaque="0" queryable="1">
        <Name>coverage</Name>
        <Title>ENC Coverage Layer</Title>
        <Style>
          <Name>default</Name>
          <Title>Default</Title>
        </Style>
        <Style>
          <Name>highlight</Name>
          <Title>Highlight</Title>
        </Style>
        <Style>
          <Name>label</Name>
          <Title>Label</Title>
        </Style>
        <Style>
          <Name>singlecolor</Name>
          <Title>Single Color</Title>
        </Style>
        <Layer noSubsets="0" opaque="0" queryable="1">
          <Name>coverage.1</Name>
          <Title>Overview</Title>
          <Style>
            <Name>default</Name>
            <Title>Default</Title>
          </Style>
          <Style>
            <Name>highlight</Name>
            <Title>Highlight</Title>
          </Style>
          <Style>
            <Name>label</Name>
            <Title>Label</Title>
          </Style>
          <Style>
            <Name>singlecolor</Name>
            <Title>Single Color</Title>
          </Style>
        </Layer>
        <Layer noSubsets="0" opaque="0" queryable="1">
          <Name>coverage.2</Name>
          <Title>General</Title>
          <Style>
            <Name>default</Name>
            <Title>Default</Title>
          </Style>
          <Style>
            <Name>highlight</Name>
            <Title>Highlight</Title>
          </Style>
          <Style>
            <Name>label</Name>
            <Title>Label</Title>
          </Style>
          <Style>
            <Name>singlecolor</Name>
            <Title>Single Color</Title>
          </Style>
        </Layer>
        <Layer noSubsets="0" opaque="0" queryable="1">
          <Name>coverage.3</Name>
          <Title>Coastal</Title>
          <Style>
            <Name>default</Name>
            <Title>Default</Title>
          </Style>
          <Style>
            <Name>highlight</Name>
            <Title>Highlight</Title>
          </Style>
          <Style>
            <Name>label</Name>
            <Title>Label</Title>
          </Style>
          <Style>
            <Name>singlecolor</Name>
            <Title>Single Color</Title>
          </Style>
        </Layer>
        <Layer noSubsets="0" opaque="0" queryable="1">
          <Name>coverage.4</Name>
          <Title>Approach</Title>
          <Style>
            <Name>default</Name>
            <Title>Default</Title>
          </Style>
          <Style>
            <Name>highlight</Name>
            <Title>Highlight</Title>
          </Style>
          <Style>
            <Name>label</Name>
            <Title>Label</Title>
          </Style>
          <Style>
            <Name>singlecolor</Name>
            <Title>Single Color</Title>
          </Style>
        </Layer>
        <Layer noSubsets="0" opaque="0" queryable="1">
          <Name>coverage.5</Name>
          <Title>Harbour</Title>
          <Style>
            <Name>default</Name>
            <Title>Default</Title>
          </Style>
          <Style>
            <Name>highlight</Name>
            <Title>Highlight</Title>
          </Style>
          <Style>
            <Name>label</Name>
            <Title>Label</Title>
          </Style>
          <Style>
            <Name>singlecolor</Name>
            <Title>Single Color</Title>
          </Style>
        </Layer>
        <Layer noSubsets="0" opaque="0" queryable="1">
          <Name>coverage.6</Name>
          <Title>Berthing</Title>
          <Style>
            <Name>default</Name>
            <Title>Default</Title>
          </Style>
          <Style>
            <Name>highlight</Name>
            <Title>Highlight</Title>
          </Style>
          <Style>
            <Name>label</Name>
            <Title>Label</Title>
          </Style>
          <Style>
            <Name>singlecolor</Name>
            <Title>Single Color</Title>
          </Style>
        </Layer>
      </Layer>
      <Layer noSubsets="0" opaque="0" queryable="1">
        <Name>elevation</Name>
        <Title>Elevation Layer</Title>
        <Style>
          <Name>color</Name>
          <Title>Color</Title>
        </Style>
        <Style>
          <Name>raw</Name>
          <Title>Raw</Title>
          <Abstract>For special clients. Use with FORMAT "image/png; mode=32bit" and decode with (red * 256 + green + blue / 256) - 32768</Abstract>
        </Style>
        <Style>
          <Name>colorshade</Name>
          <Title>ColorShade</Title>
        </Style>
        <Style>
          <Name>style-id-245</Name>
          <Title>Full</Title>
          <Abstract>Full with paper chart symbols</Abstract>
        </Style>
        <Style>
          <Name>style-id-260</Name>
          <Title>Full ECDIS</Title>
          <Abstract>Full with ECDIS chart symbols</Abstract>
        </Style>
        <Style>
          <Name>style-id-2156</Name>
          <Title>Full ECDIS without SCAMIN</Title>
          <Abstract>Full with ECDIS chart symbols</Abstract>
        </Style>
        <Style>
          <Name>style-id-263</Name>
          <Title>Full transparent land</Title>
          <Abstract>Full with paper chart symbols and transparent land</Abstract>
        </Style>
        <Style>
          <Name>style-id-2142</Name>
          <Title>Full transparent land ECDIS</Title>
          <Abstract>Full with simplified symbols and transparent land</Abstract>
        </Style>
        <Style>
          <Name>style-id-200</Name>
          <Title>default</Title>
          <Abstract>default</Abstract>
        </Style>
        <Style>
          <Name>style-id-2141</Name>
          <Title>NHST</Title>
          <Abstract>NHST</Abstract>
        </Style>
        <Style>
          <Name>style-id-201</Name>
          <Title>transparent land</Title>
          <Abstract>transparent land</Abstract>
        </Style>
        <Style>
          <Name>style-id-2475</Name>
          <Title>Standard transparent land w/o lights and beacons</Title>
          <Abstract>Standard with paper chart symbols and transparent land -  lights and beacons excluded</Abstract>
        </Style>
        <Style>
          <Name>style-id-246</Name>
          <Title>Standard</Title>
          <Abstract>Standard with paper chart symbols</Abstract>
        </Style>
        <Style>
          <Name>style-id-262</Name>
          <Title>Standard transparent land</Title>
          <Abstract>Standard with paper chart symbols and transparent land</Abstract>
        </Style>
        <Style>
          <Name>style-id-2195</Name>
          <Title>Base with M_QUAL</Title>
          <Abstract>Base with paper chart symbols</Abstract>
        </Style>
        <Style>
          <Name>style-id-244</Name>
          <Title>Base</Title>
          <Abstract>Base with paper chart symbols</Abstract>
        </Style>
        <Style>
          <Name>style-id-261</Name>
          <Title>Base transparent land</Title>
          <Abstract>Base with paper chart symbols and transparent land</Abstract>
        </Style>
      </Layer>
      <Layer noSubsets="0" opaque="0" queryable="1">
        <Name>cells</Name>
        <Title>ENC Layer</Title>
        <Abstract>ENC Layer</Abstract>
        <Style>
          <Name>style-id-245</Name>
          <Title>Full</Title>
          <Abstract>Full with paper chart symbols</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-245&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-260</Name>
          <Title>Full ECDIS</Title>
          <Abstract>Full with ECDIS chart symbols</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-260&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-2156</Name>
          <Title>Full ECDIS without SCAMIN</Title>
          <Abstract>Full with ECDIS chart symbols</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-2156&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-263</Name>
          <Title>Full transparent land</Title>
          <Abstract>Full with paper chart symbols and transparent land</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-263&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-2142</Name>
          <Title>Full transparent land ECDIS</Title>
          <Abstract>Full with simplified symbols and transparent land</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-2142&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-200</Name>
          <Title>default</Title>
          <Abstract>default</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-200&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-2141</Name>
          <Title>NHST</Title>
          <Abstract>NHST</Abstract>
          <LegendURL height="402" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-2141&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=402" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-201</Name>
          <Title>transparent land</Title>
          <Abstract>transparent land</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-201&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-2475</Name>
          <Title>Standard transparent land w/o lights and beacons</Title>
          <Abstract>Standard with paper chart symbols and transparent land -  lights and beacons excluded</Abstract>
          <LegendURL height="402" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-2475&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=402" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-246</Name>
          <Title>Standard</Title>
          <Abstract>Standard with paper chart symbols</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-246&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-262</Name>
          <Title>Standard transparent land</Title>
          <Abstract>Standard with paper chart symbols and transparent land</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-262&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-2195</Name>
          <Title>Base with M_QUAL</Title>
          <Abstract>Base with paper chart symbols</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-2195&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-244</Name>
          <Title>Base</Title>
          <Abstract>Base with paper chart symbols</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-244&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
        <Style>
          <Name>style-id-261</Name>
          <Title>Base transparent land</Title>
          <Abstract>Base with paper chart symbols and transparent land</Abstract>
          <LegendURL height="442" width="200">
            <Format>image/png</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://gis.vta.ee/primar/wms_ip/TranspordiametNutimeri?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetLegendGraphic&amp;LAYER=cells&amp;STYLE=style-id-261&amp;FORMAT=image/png&amp;WIDTH=200&amp;HEIGHT=442" xlink:type="simple"/>
          </LegendURL>
        </Style>
      </Layer>
    </Layer>
  </Capability>
</WMT_MS_Capabilities>
`
  it('should ', async () => {
    const xmlDoc = await Wms.parse(xml);
    console.log(JSON.stringify(xmlDoc))
    expect(xmlDoc).eql(undefined)
  })
})