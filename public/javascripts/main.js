$(function() {

  var apiRoot = 'https://api.songkick.com/api/3.0/events.json?location=geo:30.2669444,-97.7427778&per_page=100&min_date=2016-03-15&max_date=2016-03-20&apikey=PTAZie3wbuF6n5dx&jsoncallback=?';
  var eventIndex = 0;

  $.ajax({
      url: apiRoot,
      method: "GET",
      data: {},
      dataType: "jsonp",
      jsonCallback: "info"
    })
  .done(function(data) {
      var shows = data.resultsPage.results.event;

      // function formatShowObj(event, i) {
      //   return {
      //     artist: shows[i].performance[0].artist.displayName,
      //     venue: shows[i].venue.displayName,
      //     latitude: shows[i].venue.lat,
      //     longitude: shows[i].venue.lng,
      //     date: shows[i].start.date,
      //     time: shows[i].start.time
      //   }
      // }

      // var show = formatShowObj(event, eventIndex);
      // var time = moment(show.time, "hh:mm a").format("h:mm a");
      // var date = moment(show.date, "YYYY-MM-DD").format("dddd, MMMM Do");

      function date_time() {
        now = moment().format('dddd, MMMM Do hh:mm a');
        document.getElementById('clock').innerHTML = now;
        setTimeout(function () { date_time(); }, 6000);
      }
      date_time();

      for(var i = 0; i < 100; i ++) {
        var artist = shows[i].performance[0].artist.displayName;
        var venue = shows[i].venue.displayName;
        var lat = shows[i].venue.lat;
        var lng = shows[i].venue.lng;
        var time = moment(shows[i].start.time, "hh:mm a").format("h:mm a");
        var date = moment(shows[i].start.date, "YYYY-MM-DD").format("dddd, MMMM Do");

        console.log(artist);
        console.log(venue);
        console.log(lat);
        console.log(lng);
        console.log(date);
        console.log(time);
      }
    })

})
