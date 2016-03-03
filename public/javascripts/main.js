// $(function() {

//   var apiRoot1 = 'https://api.songkick.com/api/3.0/events.json?location=geo:30.2669444,-97.7427778&page=1&per_page=100&min_date=2016-03-04&max_date=2016-03-04&apikey=PTAZie3wbuF6n5dx&jsoncallback=?';

//   var venues = [];

//   $.ajax({
//     url: apiRoot1,
//     method: "GET",
//     data: {},
//     dataType: "jsonp"
//   })
//   .done(function(data) {
//     var shows = data.resultsPage.results.event;

//     for(var i = 0; i < shows.length; i++) {
//       var artist = shows[i].performance[0].artist.displayName;
//       var venue = shows[i].venue.displayName;
//       var lat = shows[i].venue.lat;
//       var lng = shows[i].venue.lng;
//       var time = moment(shows[i].start.time, "hh:mm a").format("h:mm a");
//       var date = moment(shows[i].start.date, "YYYY-MM-DD").format("dddd, MMMM Do");

//       if (venue != "Unknown venue" && lat != null && time != "Invalid date") {
//         venues.push(lat, lng);
//       }
//     }
//     console.log(venues);
//   })
//   function date_time() {
//     now = moment().format('dddd, MMMM Do hh:mm a');
//     document.getElementById('clock').innerHTML = now;
//     setTimeout(function () { date_time(); }, 6000);
//   }
//   date_time();
// });

