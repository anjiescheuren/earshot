var x = document.getElementById("demo");
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
    mapholder.style.height = '425px';
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

// Create a div to hold the control.
var controlDiv = document.createElement('div');

// Set CSS for the control border
var controlUI = document.createElement('ui');
controlUI.style.backgroundColor = '#fff';
controlUI.style.border = '2px solid #fff';
controlUI.style.cursor = 'pointer';
controlUI.style.marginBottom = '22px';
controlUI.style.textAlign = 'center';
controlUI.title = 'Click to recenter the map';
controlDiv.appendChild(controlUI);

// Set CSS for the control interior
var controlText = document.createElement('text');
controlText.style.color = 'rgb(25,25,25)';
controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
controlText.style.fontSize = '16px';
controlText.style.lineHeight = '38px';
controlText.style.paddingLeft = '5px';
controlText.style.paddingRight = '5px';
controlText.innerHTML = 'Center Map';
controlUI.appendChild(controlText);

var datenow = moment().format("dddd, MMMM Do");
var timenow = moment().format("h:mm a")


// function to filter shows happening on datenow, after timenow

// function to filter shows within a half mile of current user's location

// function to display those shows on the map

// function to add infowindow with show information

// var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
// var marker = new google.maps.Marker({position:latlon,map:map,icon:'images/headphone.png',title:"You are here!"});

// var infowindow = new google.maps.InfoWindow({
//         content:"show.date, show.artist, show.venue, show.time"
//         });

//       google.maps.event.addListener(marker, 'click', function() {
//         infowindow.open(map,marker);
//         });

