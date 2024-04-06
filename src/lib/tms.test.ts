import {describe, expect, it} from 'vitest'
import {tileMap, tileMapService} from '$lib/tms'

describe('tms test', () => {
  it('TileMap', async () => {
    const xml = `<TileMap version="1.0.0" tilemapservice="https://tiles.maaamet.ee/tm/tms/1.0.0/">
<Title>Põhikaart (mustvalge)</Title>
<Abstract>Mustvalge rasteriseeritud Eesti põhikaart 1:10 000.</Abstract>
<SRS>EPSG:3301</SRS>
<BoundingBox minx="365000.000000" miny="6375000.000000" maxx="740000.000000" maxy="6635000.000000"/>
<Origin x="40500.000000" y="5993000.000000"/>
<TileFormat width="256" height="256" mime-type="image/png" extension="png"/>
<TileSets>
<TileSet href="https://tiles.maaamet.ee/tm/tms/1.0.0/epk_mv@LEST/0" units-per-pixel="4000.00000000000000000000" order="0"/>
<TileSet href="https://tiles.maaamet.ee/tm/tms/1.0.0/epk_mv@LEST/14" units-per-pixel="0.24414062500000000000" order="14"/>
</TileSets>
</TileMap>`
    const result = await tileMap(xml)
    expect(result).eql({
      abstract: 'Mustvalge rasteriseeritud Eesti põhikaart 1:10 000.',
      boundingBox: {
        maxX: 740000.000000,
        maxY: 6635000.000000,
        minX: 365000.000000,
        minY: 6375000.000000,
      },
      origin: {
        x: 40500.000000,
        y: 5993000.000000,
      },
      srs: 'EPSG:3301',
      tileFormat: {
        extension: 'png',
        height: 256,
        mimeType: 'image/png',
        width: 256,
      },
      title: 'Põhikaart (mustvalge)',
      version: '1.0.0',
      tileMapService: 'https://tiles.maaamet.ee/tm/tms/1.0.0/',
      tileSets: [{
        href: 'https://tiles.maaamet.ee/tm/tms/1.0.0/epk_mv@LEST/0',
        unitsPerPixel: 4000.00000000000000000000,
        order: 0,
      },
        {
          href: 'https://tiles.maaamet.ee/tm/tms/1.0.0/epk_mv@LEST/14',
          unitsPerPixel: 0.24414062500000000000,
          order: 14,
        },
      ],
    })
  })
  
  it('TileMaps', async () => {
    const xml = `<TileMapService version="1.0.0">
<TileMaps>
<TileMap title="Põhikaart (mustvalge)" srs="EPSG:3301" profile="none" href="https://tiles.maaamet.ee/tm/tms/1.0.0/epk_mv@LEST"/>
<TileMap title="Kõrgusandmed" srs="EPSG:3301" profile="none" href="https://tiles.maaamet.ee/tm/tms/1.0.0/topo@LEST"/>
</TileMaps>
</TileMapService>`
    const result = await tileMapService(xml)
    expect(result).eql({
      version: '1.0.0',
      tileMaps: [
        {
          title: 'Põhikaart (mustvalge)',
          srs: 'EPSG:3301',
          profile: 'none',
          href: 'https://tiles.maaamet.ee/tm/tms/1.0.0/epk_mv@LEST',
        },
        {
          title: 'Kõrgusandmed',
          srs: 'EPSG:3301',
          profile: 'none',
          href: 'https://tiles.maaamet.ee/tm/tms/1.0.0/topo@LEST',
        },
      ],
    })
  })
})