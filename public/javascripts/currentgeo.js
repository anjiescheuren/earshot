$(function() {

  ///////////////////////
  // Program Execution //
  ///////////////////////

  var map = showMap();
  dateTime();
  getLocation(map);
  // getVenues(map);

  /////////////////////////
  // Function Definition //
  /////////////////////////

  var bitvenues = [];
  var venues = [];

  function getVenues(map, position) {
    //Use moment.js to update api call based on current date
    var currentDate = moment().format("YYYY-MM-DD");
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    // var apiRoot = 'https://api.songkick.com/api/3.0/events.json';
    var api = 'https://api.songkick.com/api/3.0/events.json?location=geo:' + lat + ','+ lon + '&per_page=100&min_date=' + currentDate + '&max_date=' + currentDate + '&apikey=PTAZie3wbuF6n5dx&jsoncallback=?';
    var api2 = 'https://api.bandsintown.com/events/search.json?format=json&api_version=2.0&app_id=earshot&' + currentDate + '&location=use_geoip';

    $.ajax({
      url: api2,
      method: "GET",
      dataType: "jsonp",
      jsonCallback: "info"
    })
    .done(function(data) {
      var bitshows = data;
      //for events with one artist
      for (var i = 0; i < bitshows.length; i++) {
        var bitvenue = {
          artist: bitshows[i].artists[0].name,
          artistbit: bitshows[i].artists[0].url,
          name: bitshows[i].venue.name,
          nameurl: bitshows[i].venue.url,
          lat: bitshows[i].venue.latitude,
          lng: bitshows[i].venue.longitude,
          time: moment(bitshows[i].datetime).format("HH:mm:ss"),
          date: moment(bitshows[i].datetime).format("dddd, MMMM Do"),
          datenow: moment().format("dddd, MMMM Do"),
          timenow: moment().subtract(2, 'hours').format("HH:mm:ss")
        }
        //function to filter out shows with null values
        if (bitvenue.name != "Unknown venue" &&
            bitvenue.lat != null &&
            bitvenue.lng != null &&
            bitvenue.time != "Invalid date" ||
            bitvenue.time === "TBA" &&
            bitvenue.time > bitvenue.timenow
          )
        {
          bitvenues.push(bitvenue);
        }
      }
      dropBitMarkers(map, bitvenues);
    })
    // Done with api2 AJAX request

    $.ajax({
      url: api,
      method: "GET",
      data: {
        // location: 'geo:' + lat + ',' + lon,
        // page: 1,
        // per_page: 100,
        // min_date: currentDate,
        // max_date: currentDate,
        // apikey: 'PTAZie3wbuF6n5dx'
      },
      dataType: "jsonp",
      jsonCallback: "info"
    })
    .done(function(data) {
      var shows = data.resultsPage.results.event;
      // events with multiple artists
      for(var i = 0; i < shows.length; i++) {
        // for (var j = 0; j < shows[i].performance.length; j++) {
          // if (shows[i].performance.length >= 2) {
            // var venue = {
            //   artist: shows[i].performance[j].artist.displayName,
            //   // supporting: shows[i].performance[j].artist.displayName,
            //   billingIndex: shows[i].performance[j].billingIndex,
            //   name: shows[i].venue.displayName,
            //   lat: shows[i].venue.lat,
            //   lng: shows[i].venue.lng,
            //   sk: shows[i].venue.metroArea.sk,
            //   songkick: shows[i].performance[j].artist.uri,
            //   songkickVenue: shows[i].venue.uri,
            //   time: shows[i].start.time,
            //   date: moment(shows[i].start.date, "YYYY-MM-DD").format("dddd, MMMM Do"),
            //   datenow: moment().format("dddd, MMMM Do"),
            //   timenow: moment().format("HH:mm:ss")
            // }
          // function to filter out shows with null values
          // if (venue.name != "Unknown venue" &&
          //     venue.lat != null &&
          //     venue.time != "Invalid date" ||
          //     venue.time === "TBA" &&
          //     venue.time > venue.timenow &&
          //     venue.billingIndex > 1
          //   )
          //   {
          //     venues.push(venue);
          //   }
          // }

        // }
        // FILTER OUT EMPTY PERFORMANCE ARRAYS!
        // events with one artist
        if (shows[i].performance.length > 0) {
          var venue = {
            artist: shows[i].performance[0].artist.displayName,
            billingIndex: shows[i].performance[0].billingIndex,
            name: shows[i].venue.displayName,
            lat: shows[i].venue.lat,
            lng: shows[i].venue.lng,
            songkick: shows[i].performance[0].artist.uri,
            songkickVenue: shows[i].venue.uri,
            time: shows[i].start.time,
            date: moment(shows[i].start.date, "YYYY-MM-DD").format("dddd, MMMM Do"),
            datenow: moment().format("dddd, MMMM Do"),
            timenow: moment().subtract(2, 'hours').format("HH:mm:ss")
          }
        // function to filter out shows with null values
        if (venue.name != "Unknown venue" &&
            venue.lat != null &&
            venue.lng != null &&
            venue.time != "Invalid date" ||
            venue.time === "TBA" &&
            venue.time > venue.timenow
          )
        {
          venues.push(venue);

          for(k = 0; k < bitvenues.length; k++) {
            for(m = 0; m < venues.length; m++) {
              if(venues[m].artist === bitvenues[k].artist) {
                // console.log(venues[m].artist, bitvenues[k].artist);
                venues.splice(m);
              }
            }
          }
        }
      }
    }
      dropMarkers(map, venues);
    })
    //Done with api1 AJAX request
  }
  // function to place a marker on the map for venues array
  function dropMarkers(map, venues) {
    // console.log(venues.length);
    for (var i = 0; i < venues.length; i++) {
      // console.log(venues[i].artist, venues[i].name);
      if (venues[i].time > venues[i].timenow || venues[i].time === null) {
      var latlng = new google.maps.LatLng(venues[i].lat, venues[i].lng);
      var marker = new google.maps.Marker({
        position: latlng,
        icon: 'images/microphone.png',
        map: map
      });

      function infoWindowHandler(marker, content) {
        var infowindow = new google.maps.InfoWindow(
          {
            content: content
          });

        google.maps.event.addListener(marker, 'click', function(){
          if(infowindow) {
            infowindow.close();
          }
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
      }

      var artist = venues[i].artist.replace(/\s/g, '');
      if (venues[i].time === null) {
        infoWindowHandler(marker, '<a target="blank" id="artist" class="infowindow" href="https://' + artist + '.bandcamp.com"><div class="infowindow" id="artist">' + venues[i].artist + '</div></a>' + '<a class="infowindow" id="venue" target="blank" href="' + venues[i].songkickVenue + '><div class="infowindow">' + venues[i].name + '</div></a>' + '<div class="infowindow"> TBA </div');
      } else {
      infoWindowHandler(marker, '<a target="blank" id="artist" class="infowindow" href="https://' + artist + '.bandcamp.com"><div class="infowindow" id="artist">' + venues[i].artist + '</div></a>' + '<a class="infowindow" id="venue" target="blank" href="' + venues[i].songkickVenue + '><div class="infowindow">' + venues[i].name + '</div></a>' + '<div class="infowindow">' + moment(venues[i].time, "hh:mm:ss").format("h:mm a") + '</div');
      }
    }
  }
}

  // function to place a marker on the map for bitvenues array
  function dropBitMarkers(map, bitvenues) {
    for (var i = 0; i < bitvenues.length; i++) {
      // console.log(bitvenues[i].artist, bitvenues[i].name);
      if (bitvenues[i].time > bitvenues[i].timenow || bitvenues[i].time === null) {
      var latlng = new google.maps.LatLng(bitvenues[i].lat, bitvenues[i].lng);
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
          infowindow.close();
          infowindow.open(map, marker);
        });
      }
      var artist = bitvenues[i].artist.replace(/\s/g, '');
      if (bitvenues[i].time === null) {
        infoWindowHandler(marker, '<a target="blank" id="artist" class="infowindow" href="https://' + artist + '.bandcamp.com"><div class="infowindow" id="artist">' + bitvenues[i].artist + '</div></a><a class="infowindow" id="venue" target="blank" href="' + bitvenues[i].nameurl + '><div class="infowindow">' + bitvenues[i].name + '</div></a>' + '<div class="infowindow"> TBA </div');
      } else {
      infoWindowHandler(marker, '<a target="blank" id="artist" class="infowindow" href="https://' + artist + '.bandcamp.com"><div class="infowindow" id="artist">' + bitvenues[i].artist + '</div></a><a class="infowindow" id="venue" target="blank" href="' + bitvenues[i].nameurl + '><div class="infowindow">' + bitvenues[i].name + '</div></a>' + '<div class="infowindow">' + moment(bitvenues[i].time, "hh:mm:ss").format("h:mm a") + '</div');
      }
    }
  }
}

  // function to display current date and time
  function dateTime() {
    daynow = moment().format('dddd, MMMM Do');
    timenow = moment().subtract(2, 'hours').format('h:mm a');
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
        getVenues(map, position);
      }, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  //function to show map
  function showMap() {
    var latlon =  new google.maps.LatLng(30.2669444, -97.7427778);
    var myOptions = {
      center:latlon,zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
      mapTypeControl:false,
      fullscreenControl: true,
      navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    }

    var mapholder = document.getElementById('mapholder');
    mapholder.style.height = '345px';
    mapholder.style.width = '650px';

    var map = new google.maps.Map(mapholder, myOptions);

    // listen for the window resize event & trigger Google Maps to update
    $(window).resize(function() {
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

