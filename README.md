# Forest cover (loss) compuatation with Google Earth Engine

Calculate forest cover (loss) for provided species distribution maps

## Data upload

Species' distribution maps have to be uploaded first to the Google Earth Engine (GEE). In order to reduce the size of upload and ease data processing, we compress the maps with the following command:

```
gdal_translate -co NBITS=1 -co COMPRESS=CCITTFAX4 -co PHOTOMETRIC=MINISWHITE -ot Byte [original name] [new name]
```

The abovementioned command uses [CCITTFAX4](https://en.wikipedia.org/wiki/Group_4_compression), a CCITT Group 4 compression especially suitable for black and white images. That's exactly what we need: `1` to indicate presence of the species in the given area (pixel) and `0` absence. 

In order to process **parallel** all files in a directory tree:

```
find . -name '*.tif' -type f -print0 | parallel -0 gdal_translate -co NBITS=1 -co COMPRESS=CCITTFAX4 -co PHOTOMETRIC=MINISWHITE -ot Byte {} {.}_CCITTFAX4.tif
```
