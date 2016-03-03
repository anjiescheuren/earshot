$(function() {

  ///////////////////////
  // Program Execution //
  ///////////////////////

  var map = showMap();
  dateTime();
  getLocation(map);
  getVenues(map);

  /////////////////////////
  // Function Definition //
  /////////////////////////

  function getVenues(map) {
    var apiRoot1 = 'https://api.songkick.com/api/3.0/events.json?location=geo:30.2669444,-97.7427778&page=1&per_page=100&min_date=2016-03-04&max_date=2016-03-04&apikey=PTAZie3wbuF6n5dx&jsoncallback=?';
    var venues = [];

    $.ajax({
      url: apiRoot1,
      method: "GET",
      data: {},
      dataType: "jsonp"
    })
    .done(function(data) {
      var shows = data.resultsPage.results.event;

      for(var i = 0; i < shows.length; i++) {
        var venue = {
          artist: shows[i].performance[0].artist.displayName,
          name: shows[i].venue.displayName,
          lat: shows[i].venue.lat,
          lng: shows[i].venue.lng,
          time: moment(shows[i].start.time, "hh:mm a").format("h:mm a"),
          date: moment(shows[i].start.date, "YYYY-MM-DD").format("dddd, MMMM Do")
        }

        var datenow = moment().format("dddd, MMMM Do"),
            timenow = moment().format("hh:mm a");

        // function to filter out shows with null values
        if (venue.name != "Unknown venue" &&
            venue.lat != null &&
            venue.time != "Invalid date" &&
            venue.time > timenow
          )
        {
          venues.push(venue);
        }
      }
      dropMarkers(map, venues);
      console.log(venues);
    });
    // Done with AJAX request
  }

  // function to place a marker on the map
  function dropMarkers(map, venues) {
    for (var i = 0; i < venues.length; i++) {
      var latlng = new google.maps.LatLng(venues[i].lat, venues[i].lng);
      var marker = new google.maps.Marker({
        position: latlng,
        icon: 'images/microphone.png',
        map: map
      });

      function infoWindowHandler(marker, content) {
        google.maps.event.addListener(marker, 'click', function(){
          var infowindow = new google.maps.InfoWindow({
            content: content
          });
          infowindow.close(); // Close previously opened infowindow
          infowindow.open(map, marker);
        });
      }

      infoWindowHandler(marker, venues[i].artist);
    }
  }

  // function to display current date and time
  function dateTime() {
    now = moment().format('dddd, MMMM Do hh:mm a');
    document.getElementById('clock').innerHTML = now;
    setTimeout(function () { dateTime(); }, 6000);
  }

  // function to get user's current location
  function getLocation(map) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        showPosition(map, position);
      }, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showMap() {
    var latlon =  new google.maps.LatLng(30.2669444, -97.7427778);
    var myOptions = {
      center:latlon,zoom:14,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
      mapTypeControl:false,
      fullscreenControl: true,
      navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    }

    var mapholder = document.getElementById('mapholder');
    mapholder.style.height = '350px';
    mapholder.style.width = '600px';

    var map = new google.maps.Map(mapholder, myOptions);
    // listen for the window resize event & trigger Google Maps to update too
    $(window).resize(function() {
      // (the 'map' here is the result of the created 'var map = ...' above)
      google.maps.event.trigger(map, "resize");
    });
    return map;
  }

  // function to show user's current position on the map
  function showPosition(map, position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    latlon = new google.maps.LatLng(lat, lon);
    //recenter map
    map.panTo(latlon);

    var marker = new google.maps.Marker({position:latlon,map:map});

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
  }

  // function to show an error if user denies access to current location
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

});

