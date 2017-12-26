var map
var markers = []

// start out with filter features set to false, so no filtering happens by default
var filters = {shower:false, vault:false, flush:false}

$(function () {
    $('input[name=filter]').change(function (e) {
     map_filter(this.id);
      filter_markers()
  });


})

var get_set_options = function() {
  ret_array = []
  for (option in filters) {
    if (filters[option]) {
      ret_array.push(option)
    }
  }
  return ret_array;
}

var filter_markers = function() {  
  set_filters = get_set_options()
  
  // for each marker, check to see if all required options are set
  for (i = 0; i < markers.length; i++) {
    marker = markers[i];

    // start the filter check assuming the marker will be displayed
    // if any of the required features are missing, set 'keep' to false
    // to discard this marker
    keep=true
    for (opt=0; opt<set_filters.length; opt++) {
      if (!marker.properties[set_filters[opt]]) {
        keep = false;
      }
    }
    marker.setVisible(keep)
  }
}

var map_filter = function(id_val) {
   if (filters[id_val]) 
      filters[id_val] = false
   else
      filters[id_val] = true
}


// after the geojson is loaded, iterate through the map data to create markers
// and add the pop up (info) windows
function loadMarkers() {
  console.log('creating markers')

  //SVG
  var cafe = {
    path: 'M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM2 21h18v-2H2v2z',
    fillColor: 'red',
    fillOpacity: 0.5,
    scale: 1,
  };
  var academico = {
    path: 'M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z',
    fillColor: 'blue',
    fillOpacity: 0.5,
    scale: 1,
  };


  var iconBase = '/joseantonio/images/';
  var icons = {
    cafe: {
      icon: iconBase + 'cafe.svg'
    },
    academico: {
      icon: iconBase + 'university.svg'
    }
  };

  var infoWindow = new google.maps.InfoWindow()
  geojson_url = '/joseantonio/geojson/valencia.geojson'
  $.getJSON(geojson_url, function(result) {
      // Post select to url.
      data = result['features']
      $.each(data, function(key, val) {
        var point = new google.maps.LatLng(
                parseFloat(val['geometry']['coordinates'][1]),
                parseFloat(val['geometry']['coordinates'][0]));
        var titleText = val['properties']['name']
        var descriptionText = val['properties']['description']
        var image = val['properties']['type']
        var marker = new google.maps.Marker({
          position: point,
          title: titleText,
          icon: icons[image].icon,
          //icon: image,
          map: map,
          properties: val['properties']
         });

        var markerInfo = "<div><h3>" + titleText + "</h3>" + descriptionText + "</div>"


        marker.addListener('click', function() {
           $('#campground_info').html(markerInfo);
           infoWindow.setContent(title);
           infoWindow.open(map, marker);
        });
        markers.push(marker)
        
      });
  });
}

function initMap() {
    map_options = {
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: {lat: 39.4762085, lng: -0.3779963},
      styles: 
        [{
          "featureType": "poi.business",
          "stylers": [{"visibility": "off"}]
        }]
    }
    
    map_document = document.getElementById('map')
    map = new google.maps.Map(map_document,map_options);
    loadMarkers()
 
}

google.maps.event.addDomListener(window, 'load', initMap);