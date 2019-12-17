var gfc = ee.Image("UMD/hansen/global_forest_change_2018_v1_6"),
    large = ee.ImageCollection("users/rspb/birds_large_2019");

var scale = 30;
var maxPixels = 1e12;

var forest2000 = gfc.select(['treecover2000']).divide(100);
var areaImage2000 = forest2000.multiply(ee.Image.pixelArea()); 

var features = large.map(function f(image)
{
  var aoo = areaImage2000.mask(image);
  
  var treecover2000 = aoo.reduceRegion({
    geometry: image.geometry(scale),
    reducer: 'sum',
    scale: scale,
    maxPixels: maxPixels
  }).get('treecover2000');
  
  return ee.Feature(null, ee.Dictionary({'name': image.get("system:index"), 'treecover2000': treecover2000}));
});

Export.table.toDrive({
  collection: features,
  description: 'large_' + scale.toString(),
  fileFormat: 'CSV',
  folder: 'EarthEngine'
});
