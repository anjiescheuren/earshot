$(function() {

  var apiRoot1 = 'https://api.songkick.com/api/3.0/events.json?location=geo:30.2669444,-97.7427778&page=1&per_page=100&min_date=2016-03-04&max_date=2016-03-04&apikey=PTAZie3wbuF6n5dx&jsoncallback=?';
  var coords = [];

  $.ajax({
    url: apiRoot1,
    method: "GET",
    data: {},
    dataType: "jsonp"
  })
  .done(function(data) {
    var shows = data.resultsPage.results.event;

    for(var i = 0; i < shows.length; i++) {
      var artist = shows[i].performance[0].artist.displayName;
      var venue = shows[i].venue.displayName;
      var lat = shows[i].venue.lat;
      var lng = shows[i].venue.lng;
      var time = moment(shows[i].start.time, "hh:mm a").format("h:mm a");
      var date = moment(shows[i].start.date, "YYYY-MM-DD").format("dddd, MMMM Do");
      var datenow = moment().format("dddd, MMMM Do");
      var timenow = moment().format("hh:mm a");

// function to filter out shows with null values
      if (venue != "Unknown venue" &&
        lat != null &&
        time != "Invalid date" &&
        time > timenow) {
        coords.push(lat, lng);
      }
    }
    console.log(coords);
  })

  date_time();
  getLocation();
});

function date_time() {
  now = moment().format('dddd, MMMM Do hh:mm a');
  document.getElementById('clock').innerHTML = now;
  setTimeout(function () { date_time(); }, 6000);
}

function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function successHandler(location) {
  var message = document.getElementById("message"), html = [];
  html.push("<img width='256' height='256' src='http://maps.googleapis.com/maps/api/js", location.coords.latitude, ",", location.coords.longitude, "&markers=size:small|color:blue|", location.coords.latitude, ",", location.coords.longitude, "&zoom=14&size=256x256&sensor=false' />");
  html.push("<p>Longitude: ", location.coords.longitude, "</p>");
  html.push("<p>Latitude: ", location.coords.latitude, "</p>");
  html.push("<p>Accuracy: ", location.coords.accuracy, " meters</p>");
  // message.innerHTML = html.join("");
}
function errorHandler(error) {
  alert('Attempt to get location failed: ' + error.message);
}
navigator.geolocation.getCurrentPosition(successHandler, errorHandler);

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  latlon = new google.maps.LatLng(lat, lon)
  mapholder = document.getElementById('mapholder')
  mapholder.style.height = '350px';
  mapholder.style.width = '600px';

  var myOptions = {
    center:latlon,zoom:14,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    mapTypeControl:false,
    fullscreenControl: true,
    navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
  }

  var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);

  // listen for the window resize event & trigger Google Maps to update too
  $(window).resize(function() {
  // (the 'map' here is the result of the created 'var map = ...' above)
   google.maps.event.trigger(map, "resize");
  });

  var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});

  var myCity = new google.maps.Circle({
    center:latlon,
    radius:1207.008,
    strokeColor:"#DD1C1A",
    strokeOpacity:0.4,
    strokeWeight:2,
    fillColor:"#DD1C1A",
    fillOpacity:0.1
  });
    myCity.setMap(map);

    function dropMarker() {
       var latlng = new google.maps.LatLng(30.2694535, -97.7421049);
       var marker = new google.maps.Marker({
         position: latlng,
         icon: 'images/microphone.png',
         map: map
       });
     }
 dropMarker();
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}

// function to display those shows on the map

// function to add infowindow with show information

// var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
// var marker = new google.maps.Marker({position:latlon,map:map,icon:'images/headphone.png',title:"You are here!"});

// var infowindow = new google.maps.InfoWindow({
//   content:"show.date, show.artist, show.venue, show.time"
//   });

// google.maps.event.addListener(marker, 'click', function() {
//   infowindow.open(map,marker);
//   });

