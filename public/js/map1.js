console.log("hollow world");
require('dotenv').config();

mapboxgl.accessToken = process.env.MAP_API_KEY;

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [-121.90884, 47.74604],
  zoom: 7
});

// code from the next step will go here!
const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-121.76574, 46.86566]
      },
      properties: {
        title: 'Mapbox',
        description: 'Mount Rainier National Park, WA.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-121.29510, 48.77103]
      },
      properties: {
        title: 'Mapbox',
        description: 'North Cascades National Park, WA'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-121.90884, 47.74604]
      },
      properties: {
        title: 'Mapbox',
        description: 'Cherry Creek Falls, WA'
      }
    }
  ]
};

// add markers to map
for (const feature of geojson.features) {
  // create a HTML element for each feature
  const el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
      )
  ).addTo(map);
};