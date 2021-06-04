let map, heatmap, flightPath, marker, bicycle;

var socket = io({transports: ['websocket'], upgrade: false});

socket.on('new-location', async () => {
  var bicyclePositions = await getBikeLocations();
  const lastPosition = bicyclePositions[bicyclePositions.length - 1];
  marker.setPosition(new google.maps.LatLng(lastPosition.lat, lastPosition.lng));
  const bicycleHistory = [];
  for (let i=0; i<bicyclePositions.length; i++) {
    bicycleHistory.push(new google.maps.LatLng(bicyclePositions[i]));
  }
  heatmap = createHeatmap(bicycleHistory);
  flightPath = createPolyline(bicycleHistory);
});

const createMap = ({ lat, lng }) => {
  return new google.maps.Map(document.getElementById('map'), {
    center: { lat, lng},
    zoom: 15,
    Size: 30
  });
};

const createMarker = ({ position, image }) => {
  return new google.maps.Marker({ map, position, icon: image });
};

const createMarkers = ({positions, image}) => {
  var markers = [];
  for (let i=0; i<positions.length; i++){
    markers.push(createMarker({position: positions[i], image: image}));
  }
  return markers;
}

const createSafeZone = (safeZone) => {
  return new google.maps.Polygon({
    map: map,
    paths: safeZone,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'pink',
    fillOpacity: 0.35,
  });
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleRoute() {
  flightPath.setMap(flightPath.getMap() ? null : map);
}

const createHeatmap = (bicycleHistory) => {
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: bicycleHistory,
    map: map,
  });
  heatmap.setMap(null);
  heatmap.set("radius", 20);
  return heatmap;
}

const createPolyline = (bicycleHistory) => {
  var polyline = new google.maps.Polyline({
    map: map,
    path: bicycleHistory,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  polyline.setMap(null);
  return polyline;
}

async function getBikeLocations()
{
  var bicyclePositions = [];
  var response = await fetch('https://api.thingspeak.com/channels/1396775/feeds.json?api_key=V4QNC2WLJQPOJJ65&location=true');
  var data = await response.json();
  data["feeds"].forEach( (el) => {
    bicyclePositions.push({
      lat: Number(el["latitude"]),
      lng: Number(el["longitude"])
    })
  });

  return bicyclePositions;
}

async function init() {
  bicycle = {
    url: "https://icon-library.com/images/bicycle-icon-png/bicycle-icon-png-20.jpg",
    //url: "https://image.flaticon.com/icons/png/512/1013/1013307.png",
    scaledSize: new google.maps.Size(30, 30),
    anchor: new google.maps.Point(15, 15)
  };
  var bicyclePositions = await getBikeLocations();
  const lastPosition = bicyclePositions[bicyclePositions.length - 1];
  const safeZone = [
    { lat: 44.505688, lng: 11.339667 },
    { lat: 44.504701, lng: 11.345555 }, 
    { lat: 44.504066, lng: 11.348087 },
    { lat: 44.500906, lng: 11.356101 },
    { lat: 44.485728, lng: 11.357894 },
    { lat: 44.484496, lng: 11.356231 },
    { lat: 44.486479, lng: 11.339515 },
    { lat: 44.490245, lng: 11.329655 },
    { lat: 44.499135, lng: 11.327006 },
  ];
  const bicycleHistory = []
  for (let i=0; i<bicyclePositions.length; i++) {
    bicycleHistory.push(new google.maps.LatLng(bicyclePositions[i]));
  }
  map = createMap(lastPosition);
  marker = createMarker({position: lastPosition, image: bicycle });
  createSafeZone(safeZone);
  heatmap = createHeatmap(bicycleHistory);
  flightPath = createPolyline(bicycleHistory);
}
