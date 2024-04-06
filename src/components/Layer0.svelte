<script lang="ts">
  // 741174 - 270365 =470809
  //   6665617-  6365617 = 300000

  // https://xgis.maaamet.ee/xgis2/service/qku4/0/0/0
  //https://xgis.maaamet.ee/xgis2/service/qku4/7/66/75
  // https://xgis.maaamet.ee/xgis2/service/i6u9?REQUEST=GetMap
  // &SERVICE=WMS
  // &VERSION=1.1.1
  // &FORMAT=image%2Fpng
  // &STYLES=
  // &TRANSPARENT=true
  // &LAYERS=cells263
  // &WIDTH=704
  // &HEIGHT=937
  // &SRS=EPSG%3A3301
  // &BBOX=542001.7956696261%2C6591261.6054070555%2C583157.2499894829%2C6646038.112079933

  // https://teenus.maaamet.ee/ows/ajakohane-haldusjaotus?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&FORMAT=svg%2Bxml&STYLES=&TRANSPARENT=true&LAYERS=haldus_kehtiv_kyla&WIDTH=704&HEIGHT=937&SRS=EPSG%3A3301&BBOX=542001.7956696261%2C6591261.6054070555%2C583157.2499894829%2C6646038.112079933
  // https://teenus.maaamet.ee/ows/ajakohane-haldusjaotus?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=AJAKOHANE_HALDUSJAOTUS&WIDTH=704&HEIGHT=937&SRS=EPSG%3A3301&BBOX=542001.7956696261%2C6591261.6054070555%2C583157.2499894829%2C6646038.112079933
  // https://xgis.maaamet.ee/xgis2/service/i6u9?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&FORMAT=svg%2Bxml&STYLES=&TRANSPARENT=true&LAYERS=cells263&WIDTH=704&HEIGHT=937&SRS=EPSG%3A3301&BBOX=542001.7956696261%2C6591261.6054070555%2C583157.2499894829%2C6646038.112079933

  //
  // var mapExtent = [40500, 5993000, 1064500, 7017000];
  // var mapMinZoom = 3;
  // var mapMaxZoom = 13;
  // var mapMaxResolution = 1.000000;
  // var tileExtent = [40500, 5993000, 1064500, 7017000];
  // // Proj4js definition (verify code at http://epsg.io/3301);
  //
  // var mapResolutions = [4000, 2000, 1000, 500, 250, 125, 62.5, 31.25, 15.625, 7.8125, 3.90625, 1.953125, 0.9765625, 0.48828125];
  //
  //
  // var mapTileGrid = new ol.tilegrid.TileGrid({
  //   extent: tileExtent,
  //   minZoom: mapMinZoom,
  //   resolutions: mapResolutions
  // });
  //
  //
  // var map = new ol.Map({
  //   loadTilesWhileAnimating: true,
  //   loadTilesWhileInteracting: true,
  //   target: 'map',
  //   layers: [
  //     new ol.layer.Tile({
  //       source: new ol.source.XYZ({
  //         projection: 'EPSG:3301',
  //         tileGrid: mapTileGrid,
  //         url: "http://tiles.maaamet.ee/tm/tms/1.0.0/foto/{z}/{x}/{-y}.jpg"
  //       })
  //     }),
  //     new ol.layer.Tile({
  //       source: new ol.source.XYZ({
  //         projection: 'EPSG:3301',
  //         tileGrid: mapTileGrid,
  //         url: "http://tiles.maaamet.ee/tm/tms/1.0.0/hybriid/{z}/{x}/{-y}.png"
  //       })
  //     })
  //   ],
  //   view: new ol.View({
  //     projection: ol.proj.get('EPSG:3301'),
  //     extent: mapExtent,
  //     maxResolution: mapTileGrid.getResolution(mapMinZoom),
  //     center: ol.proj.fromLonLat([24.793996, 59.443378]),
  //   })
  // });
  // map.getView().fit(mapExtent, map.getSize());
  // map.addControl(new ol.control.MousePosition());





</script>




