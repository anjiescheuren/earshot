$(function() {

  var apiRoot = 'https://api.songkick.com/api/3.0/events.json?location=geo:30.2669444,-97.7427778&per_page=100&min_date=2016-03-15&max_date=2016-03-20&apikey=PTAZie3wbuF6n5dx&jsoncallback=?';
  var eventIndex = 0;
  var liked = [];

  $.ajax({
      url: apiRoot,
      method: "GET",
      data: {},
      dataType: "jsonp",
      jsonCallback: "info"
    })
  .done(function(data) {
      var shows = data.resultsPage.results.event;
      console.log(shows[23].performance[0].artist.displayName);
      console.log(shows[23].venue.displayName);
      console.log(shows[23].venue.lat);
      console.log(shows[23].venue.lng);

      function formatShowObj(event, i) {
        return {
          artist: shows[i].performance[0].artist.displayName,
          venue: shows[i].venue.displayName,
          latitude: shows[i].venue.lat,
          longitude: shows[i].venue.lng,
          date: shows[i].start.date,
          time: shows[i].start.time,
          songkick: shows[i].performance[0].artist.uri
        }
      }
    })

})
