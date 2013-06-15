'use strict';
var getDate = function() {
   var n = new Date();
   var month = '' + (n.getMonth() + 1);
   if (month.length === 1) {
      month = '0' + month;
   }
   var day = '' + n.getDate();
   if (day.length === 1) {
      day = '0' + day;
   }
   return '' + n.getFullYear() + '-' + month + '-' + day;
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}

var DAY_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

angular.module('yApp')
.controller('MainCtrl', function ($scope, $http) {
   $http.get('/bytime.json').success(function(data) {
      var today = getDate();
      $scope.movies = data.movies;
      var seen_days = {};
      $scope.days = ['All'];
      $scope.chosenDay = {model : 'All'};
      $scope.chosenCinema = {model : 'All'};
      angular.forEach($scope.movies, function (movie) {
         if (movie.date === today) {
            movie.dayname = 'today';
         } else {
            var diff = days_between(new Date(today), new Date(movie.date));
            if (diff === 1) {
               movie.dayname = 'tomorrow';
            } else {
               movie.dayname = DAY_NAMES[(new Date(movie.date)).getDay()];
            }
         }
         if (seen_days[movie.dayname] === undefined) {
            seen_days[movie.dayname] = 1;
            $scope.days.push(movie.dayname);
         }
      });
      $scope.cinemas = data.cinemas;
      $scope.cinemas.unshift('All');
   });
   $scope.times = ['Now', 'This afternoon', 'Tonight'];
   $scope.inSelectedCinemas = function (movie) {
      return $scope.chosenCinema.model === 'All' || $scope.chosenCinema.model === movie.cinema;
   };
   $scope.inSelectedDay = function (movie) {
      return $scope.chosenDay.model === 'All' || movie.dayname === $scope.chosenDay.model;
   }
   $scope.movieFilter = function (movie) {
      return $scope.inSelectedCinemas(movie) && $scope.inSelectedDay(movie);
   }
});
