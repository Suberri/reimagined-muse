angular.module('starter.controllers', [])

.controller('LocationsCtrl', function($scope, Locations) {
  $scope.location = Locations.current();
})

.controller('BeaconsCtrl', function($scope, $http) {
  $http.get('../data/PMAPowerofArtHackathon-ibeacons.json')
        .then(function(results) {
          $scope.beacons = results.data;
        });
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
.controller('GalleriesCtrl', function($scope, Locations, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // $scope.galleries = [];
  // Galleries.all().then(function(response) {
  //   $scope.allGalleries = response.data;
  //   // just grabbing top 100 for testing...
  //   $scope.galleries = response.data.slice(0, 100);
  // });
  $scope.gallery = {};
  var thing = Locations.current().then(function(data) {
    $scope.gallery = data;
  });

})

.controller('GalleriesDetailCtrl', function($scope, $stateParams, Locations, $ionicViewService) {
  $scope.item = {};
  Locations.current().then(function(data) {
    $scope.item = data.objects.filter(function(item){ return item.objectid == $stateParams.objectid; })[0];
  });

  $scope.goBack = function() {
    $ionicViewService.getBackView().go()
  }

})

.controller('ChatCtrl', function($scope, Locations, $q, $ionicScrollDelegate) {
  $scope.myname = "";
  $scope.theirname = "Arty";
  $scope.state = {};
  $scope.state.messages = [];


  $scope.$on('message:rendered', function() {
    $scope.state.status = "";
    $scope.$apply();
    $ionicScrollDelegate.scrollBottom();
  });

  $scope.$on('message:started', function(event, name) {
    if(name != $scope.myname) {
      $scope.state.status = name+" is typing...";
    }
  });


  var amessage = {
    text: "Looks like you're into post-modern impressionalist nihilist photography, would you like to learn more about that?",
    responses: [
      {
        name: "History",
        cb: function() {
          makeMessage($scope.myname, "History sounds fun, let's go with that.")
          .then(function() {
            makeMessage($scope.theirname, "Cool! Uhhhh gimme a sec...");
            clearResponseButtons();
          })
        }
      },
      {
        name: "not history",
        cb: function() {
          makeMessage($scope.myname, "Anything but history.")
          .then(function() {
            makeMessage($scope.theirname, "Wow, great. super helpful.");
            clearResponseButtons();
          })
        }
      }
    ]
  };

  $scope.setName = function(name) {
    $scope.myname = name;
    makeMessage(name, name).then(function() {

      makeMessage($scope.theirname, "Hi, " + $scope.myname + "! It's great to meet you. My name is Arthur, but you can call me "+$scope.theirname+" for short.")
      .then(function() {
        makeMessage($scope.theirname, "Let's get started! When you're ready, switch over to the gallery view. I'll try my best to pull up some interesting information about the art around you. If you think something's cool, let me know.")
        .then(function() {
          setupResponse(amessage);
        });
      })
    });


  }


  function clearResponseButtons() {
    $scope.currentMessage = {};
  }

  function setupResponse(messageData) {
    $scope.currentMessage = messageData;
    makeMessage($scope.theirname, messageData.text)
  }


  function makeMessage(name, message) {
    var deferred = $q.defer();
    var delay = message.length * 10;
    if(name == $scope.myname) {
      delay = 0;
    }
    $scope.$broadcast('message:started', name);
    setTimeout(function() {
      $scope.state.messages.push({
        text: message,
        datetime: new Date(),
        sender: name
      });
      $scope.$broadcast('message:rendered');
      deferred.resolve();
    }, delay);
    return deferred.promise;
  }

  // try {
  //   $scope.myname = JSON.parse(window.localStorage.user).name;
  // } catch (e) {
  //   $scope.myname = "you";
  // }

  var thing = Locations.current().then(function(data) {
    $scope.gallery = data;
    makeMessage($scope.theirname, "Hi! Welcome to the Philadelphia Museum of Art. Let's get started! What's your name?").then(function() {

      // makeMessage("Art", "Let me know if you have any questions, specifically around the history or process of the pieces in this gallery.");
    })
  });






  $scope.hrTime = function(date) {
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
});
