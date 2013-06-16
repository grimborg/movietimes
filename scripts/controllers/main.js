'use strict';

function padded(val) {
    val = '' + val;
    if (val.length == 1) val = '0' + val;
    return val;
}

var getDate = function() {
   var n = new Date();
   var month = padded(n.getMonth() + 1);
   var day = padded(n.getDate());
   return '' + n.getFullYear() + '-' + month + '-' + day;
}

function getTime() {
    var n = new Date();
    var hours = padded(n.getHours());
    var minutes = padded(n.getMinutes());
    return hours + ':' + minutes;
}

function days_between(date1, date2) {
    var ONE_DAY = 1000 * 60 * 60 * 24
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()
    var difference_ms = date2_ms - date1_ms
    return Math.round(difference_ms/ONE_DAY)
}

//var DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

angular.module('yApp')
.controller('MainCtrl', function ($scope, $http) {
   $http.get('bytime.json').success(function(data) {
      var today = getDate();
      $scope.curtime = getTime();
      $scope.movies = data.movies;
      var seen_days = {};
      $scope.days = ['Any day'];
      $scope.chosenDay = {model : 'Any day'};
      $scope.chosenCinema = {model : 'Anywhere'};
      $scope.chosenMovie = {model : undefined};
      angular.forEach($scope.movies, function (movie) {
         if (movie.date === today) {
            movie.dayname = 'today';
         } else {
            var diff = days_between(new Date(today), new Date(movie.date));
            if (diff === 1) {
               movie.dayname = 'tomorrow';
            } else if (today > movie.date) {
                console.log(movie.date);
                movie.dayname = 'yesterday';
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
      $scope.cinemas.unshift('Anywhere');
   });
   $scope.times = ['Now', 'This afternoon', 'Tonight'];
   $scope.inSelectedCinemas = function (movie) {
      return $scope.chosenCinema.model === 'Anywhere' || $scope.chosenCinema.model === movie.cinema;
   };
   $scope.inSelectedDay = function (movie) {
      return $scope.chosenDay.model === 'Any day' || movie.dayname === $scope.chosenDay.model;
   }
   $scope.isSelectedMovie = function (movie) {
       return $scope.chosenMovie.model == undefined || movie.title === $scope.chosenMovie.model;
   }
   $scope.movieFilter = function (movie) {
      return $scope.inSelectedCinemas(movie) && $scope.inSelectedDay(movie) && $scope.isSelectedMovie(movie);
   }
});
