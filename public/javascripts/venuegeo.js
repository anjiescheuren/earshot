var infowindow = new google.maps.InfoWindow({
        content:"Hello World!"
        });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
        });
