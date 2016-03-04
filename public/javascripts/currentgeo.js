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
    var currentDate = moment().format("YYYY-MM-DD");
    //moment.js to update api call based on current date
    var apiRoot = 'https://api.songkick.com/api/3.0/events.json?location=geo:30.2669444,-97.7427778&page=1&per_page=100&min_date=' + currentDate + '&max_date=' + currentDate + '&apikey=PTAZie3wbuF6n5dx&jsoncallback=?';
    var venues = [];

    $.ajax({
      url: apiRoot,
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
          songkick: shows[i].performance[0].artist.uri,
          time: shows[i].start.time,
          date: moment(shows[i].start.date, "YYYY-MM-DD").format("dddd, MMMM Do"),
          datenow: moment().format("dddd, MMMM Do"),
          timenow: moment().format("HH:mm:ss")
        }

        // var datenow = moment().format("dddd, MMMM Do"),
        //     timenow = moment().format("hh:mm a");

        // function to filter out shows with null values
        if (venue.name != "Unknown venue" &&
            venue.lat != null &&
            venue.time != "Invalid date" &&
            venue.time < venue.timenow
          )
        {
          console.log(venue.artist);
          venues.push(venue);
        }
      }
      dropMarkers(map, venues);
      // console.log(venues);
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
      var artist = venues[i].artist.replace(/\s/g, '');
      console.log(artist);
      infoWindowHandler(marker, '<a target="blank" id="artist" class="infowindow" href="' + artist + '.bandcamp.com"><div class="infowindow" id="artist">' + venues[i].artist + '</div></a>' + '<div class="infowindow">' + venues[i].name + '</div>' + '<div class="infowindow">' + moment(venues[i].time, "hh:mm:ss").format("h:mm a") + '</div');
    }
  }

  // function to display current date and time
  function dateTime() {
    daynow = moment().format('dddd, MMMM Do');
    timenow = moment().format('h:mm a')
    // document.getElementById('clock').innerHTML = now;
    $('#clock').html('Displaying shows for ' + daynow + ' after ' + timenow);
    setTimeout(function () {
      dateTime();
    }, 30000);
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
  //function to show map
  function showMap() {
    var latlon =  new google.maps.LatLng(42.2669444, -97.7427778);
    var myOptions = {
      center:latlon,zoom:15,
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

    var marker = new google.maps.Marker({position:latlon,map:map});

    var myCity = new google.maps.Circle({
      center:latlon,
      radius:536.447946355,
      strokeColor:"#DD1C1A",
      strokeOpacity:0.4,
      strokeWeight:2,
      fillColor:"#DD1C1A",
      fillOpacity:0.1
    });
    myCity.setMap(map);

    map.panTo(latlon);
    map.setZoom(15);

    $('#recenter').click(function() {
      map.panTo(latlon);
      map.setZoom(15);
    })
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

