var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
    var marker = new google.maps.Marker({position:latlon,map:map,icon:'images/headphone.png',title:"You are here!"});

var infowindow = new google.maps.InfoWindow({
        content:"Hello World!"
        });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
        });
