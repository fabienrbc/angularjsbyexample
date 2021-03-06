'use strict'

angular.module('WorkoutBuilder')
  .controller('WorkoutListController', ['$scope', 'WorkoutService', '$location',
    function ($scope, WorkoutService, $location) {
      $scope.goto = function (workout) {
        $location.path('/builder/workouts/' + workout.name)
      }
      var init = function () {
        WorkoutService.getWorkouts().then(function (data) {
          $scope.workouts = data
        })
      }
      init()
    }
  ]
)

angular.module('WorkoutBuilder').controller('WorkoutDetailController', ['$scope', 'WorkoutBuilderService', 'selectedWorkout', '$location', '$routeParams', '$q', 'WorkoutService',
  function ($scope, WorkoutBuilderService, selectedWorkout, $location, $routeParams, $q, WorkoutService) {
    $scope.removeExercise = function (exercise) {
      WorkoutBuilderService.removeExercise(exercise)
    }

    $scope.$watch('formWorkout.exerciseCount', function (newValue) {
      if (newValue) {
        newValue.$setValidity('count', $scope.workout.exercises.length > 0)
      }
    })

    $scope.$watch('workout.exercises.length', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.formWorkout.exerciseCount.$dirty = true
        $scope.formWorkout.$setDirty()
        $scope.formWorkout.exerciseCount.$setValidity('count', newValue > 0)
      }
    })

    $scope.hasError = function (modelController, error) {
      return (modelController.$dirty || $scope.submitted) && error
    }

    $scope.save = function () {
      $scope.submitted = true // Will force validations
      if ($scope.formWorkout.$invalid) {
        return
      }
      WorkoutBuilderService.save().then(function (workout) {
        $scope.workout = workout
        $scope.formWorkout.$setPristine()
        $scope.submitted = false
      })
    }

    $scope.reset = function () {
      $scope.workout = WorkoutBuilderService.startBuilding($routeParams.id)
      $scope.formWorkout.$setPristine()
      $scope.submitted = false
    }

    $scope.canDeleteWorkout = function () {
      return WorkoutBuilderService.canDeleteWorkout()
    }

    $scope.deleteWorkout = function () {
      WorkoutBuilderService.delete().then(function (data) {
        $location.path('/builder/workouts')
      })
    }

    $scope.durations = [{ title: '15 seconds', value: 15 },
      { title: '30 seconds', value: 30 },
      { title: '45 seconds', value: 45 },
      { title: '1 minute', value: 60 },
      { title: '1 minute 15 seconds', value: 75 },
      { title: '1 minute 30 seconds', value: 90 },
      { title: '1 minute 45 seconds', value: 105 },
      { title: '2 minutes', value: 120 },
      { title: '2 minutes 15 seconds', value: 135 },
      { title: '2 minutes 30 seconds', value: 150 },
      { title: '2 minutes 45 seconds', value: 165 },
      { title: '3 minutes', value: 180 },
      { title: '3 minutes 15 seconds', value: 195 },
      { title: '3 minutes 30 seconds', value: 210 },
      { title: '3 minutes 45 seconds', value: 225 },
      { title: '4 minutes', value: 240 },
      { title: '4 minutes 15 seconds', value: 255 },
      { title: '4 minutes 30 seconds', value: 270 },
      { title: '4 minutes 45 seconds', value: 285 },
      { title: '5 minutes', value: 300 }]

    $scope.mmoveExerciseTo = function (exercise, location) {
      WorkoutBuilderService.moveExercise(exercise, location)
    }

    // var restWatch = $scope.$watch('formWorkout.restBetweenExercise',
    //   function (newValue) {
    //     if (newValue) {
    //       newValue.$parsers.unshift(function (value) {
    //         return isNaN(parseInt(value)) ? value : parseInt(value)
    //       })
    //       newValue.$formatters.push(function (value) {
    //         return isNaN(parseInt(value) ? value : parseInt(value))
    //       })
    //       restWatch()
    //     }
    //   })

    // $scope.uniqueUserName = function (value) {
    //   if (!value || value === $routeParams.id) {
    //     return $q.when(true)
    //   }
    //   return WorkoutService
    //     .getWorkout(value.toLowerCase())
    //     .then(function (data) { return $q.reject(); },
    //       function (error) { return true; })
    // }

    $scope.uniqueUserName = function (value) {
      if (!value || value === $routeParams.id) {
        return $q.when(true)
      }
      return WorkoutService
        .getWorkout(value.toLowerCase())
        .then(function (data) { return $q.reject() },
          function (error) { return true })
    }

    var init = function () {
      $scope.workout = selectedWorkout
    }
    init()
  }
])
