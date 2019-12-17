var gfc = ee.Image("UMD/hansen/global_forest_change_2018_v1_6"),
    large = ee.ImageCollection("users/rspb/birds_large_2019");

var scale = 480;
var maxPixels = 1e12;

var forest2000 = gfc.select(['treecover2000']).divide(100);
var lossYear = gfc.select('lossyear');
var areaImage2000 = forest2000.multiply(ee.Image.pixelArea()); 

function compute_forest_area(forest, year) {
  var forest_area_co = large.map(function f(image)
  {
    var loss_area = forest.mask(image).reduceRegion({
      geometry: image.geometry(scale),
      reducer: 'sum',
      scale: scale,
      maxPixels: maxPixels
    }).get('treecover2000');
    
    var key = 'loss_' + year.toString();
    var d = {}
    d[key] = loss_area
    
    return ee.Feature(null, ee.Dictionary(d));
  
  });
  
  return forest_area_co;
}

for (var year = 1; year <= 18; year++) {
  var year_full = 2000 + year;
  var areaLossImage2000 = forest2000.mask(lossYear.eq(year)).multiply(ee.Image.pixelArea());
  var co = compute_forest_area(areaLossImage2000, year);
  
  Export.table.toDrive({
    collection: co,
    description: 'large_loss_' + year_full + '_' + scale.toString(),
    fileFormat: 'CSV',
    folder: 'EarthEngine'
  });
}
