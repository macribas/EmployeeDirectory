var app = angular.module('app', ['ngMaterial', 'ngMessages', 'angularSpinner', 'ui.grid', 
                                 'ui.grid.resizeColumns', 'ui.grid.moveColumns']);

app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
	usSpinnerConfigProvider.setDefaults({
		lines: 13, // The number of lines to draw
		length: 5, // The length of each line
		width: 4, // The line thickness
		radius: 8, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#333', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 80, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent
		left: '50%' // Left position relative to parent
	});
}]);

app.config(function($mdThemingProvider) {
	$mdThemingProvider.theme("success-toast");
	$mdThemingProvider.theme("error-toast");
	$mdThemingProvider.theme("warning-toast");
	});

app.filter('titlecase', function() {
	return function(s) {
		s = ( s === undefined || s === null ) ? '' : s;
		return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
			return ch.toUpperCase();
		});
	};
});

app.directive('focusOn', function() {
	return function(scope, elem, attr) {
		scope.$on(attr.focusOn, function(e) {
			elem[0].focus();
		});
	};
});

app.config(function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = function(date) {
		return moment(date).format('MM/DD/YYYY');
	};
});

app.config(function($mdThemingProvider) {
	// Configure a dark theme with primary foreground yellow
	$mdThemingProvider.theme('docs-dark', 'default')
	.primaryPalette('yellow')
	.dark();
});

app.service('ajaxService', function($http) {
	this.getData = function(URL, ajaxMethod, ajaxParams) {
		var restURL = URL + ajaxParams;
		console.log("Inside ajaxService GET...");
		console.log("Connection using URL=[" + restURL + "], Method=[" + ajaxMethod + "]");

		return $http({
			method: ajaxMethod,
			url: restURL,
		});
	};

	this.postData = function(URL, ajaxMethod, jsonData, ajaxParams) {
		var restURL = URL + ajaxParams;
		console.log("Inside ajaxService POST...");
		console.log("Connection using URL=[" + restURL + "], Method=[" + ajaxMethod + "]");

		return $http({
			method: ajaxMethod,
			url: restURL,
			headers: {'Content-Type': 'application/json'},
			data: jsonData,
		});

	};
});

app.directive('ngElementReady', [function() {
	return {
		priority: Number.MIN_SAFE_INTEGER, // execute last, after all other directives if any.
		restrict: "A",
		link: function($scope, $element, $attributes) {
			$scope.$eval($attributes.ngElementReady); // execute the expression in the attribute.
		}
	};
}]);

var myTimeModule = angular.module('myTimeModule', [])
//Register the 'myCurrentTime' directive factory method.
//We inject $timeout and dateFilter service since the factory method is DI.
.directive('currentTime', function($timeout, dateFilter) {
	// return the directive link function. (compile function not needed)
	return function(scope, element, attrs) {
		var timeoutId = 0; // timeoutId, so that we can cancel the time updates

//		used to update the UI
		function updateTime() {
			element.text(dateFilter(new Date(), 'MMM d, yyyy h:mm:ss a'));
		}

//		schedule update in one second
		function updateLater() {
			// save the timeoutId for canceling
			timeoutId = $timeout(function() {
				updateTime(); // update DOM
				updateLater(); // schedule another update
			}, 1000);
		}

//		listen on DOM destroy (removal) event, and cancel the next UI update
//		to prevent updating time ofter the DOM element was removed.
		element.bind('$destroy', function() {
			$timeout.cancel(timeoutId);
		});

		updateLater(); // kick off the UI update process.
	};
});

/* -----------------------------------------------------------------------
 ** MAIN CONTROLLER
 *-------------------------------------------------------------------------*/
app.controller('MainCtrl', function ($scope, $rootScope, $http, $log, $mdDialog, $mdSidenav, 
											$timeout, $filter, ajaxService, usSpinnerService) {

	$scope.firstName = "";
	$scope.lastName = "";
	$scope.isStandardRequired = true;
	$scope.enableJSON = true;
	
	$scope.advanced = {};
	
	$scope.gridActive = false;
	
	console.log("$scope.gridActive....: " + $scope.gridActive);
	
	$scope.fields = [
	                   {id: "firstName", name:"First Name", type: "string", selected: false},
	                   {id: "lastName", name:"Last Name", type: "string", selected: false},
	                   {id: "preferredName", name:"Preferred First Name", type: "string", selected: false},
	                   {id: "jobDesc", name:"Job Description", type: "string", selected: false},
	                   {id: "titleDesc", name:"Title Description", type: "string", selected: false},
	                   {id: "companyName", name:"Company Name", type: "string", selected: false},
	                   {id: "costCenter", name:"Cost Center", type: "string", selected: false},
	                   {id: "hireDate", name:"Date of Hire", type: "date", selected: false}
	                ];
		
	$scope.operations = [
	                   {id: "like", name:"like", type: "string"},
	                   {id: "equalTo", name:"equal to", type: "string"},
	                   {id: "notEqualTo", name:"not equal to", type: "string"},
	                   {id: "equalTo", name:"equal to", type: "date"},
	                   {id: "greaterThan", name:"greater than", type: "date"},
	                   {id: "lessThan", name:"less than", type: "date"}
	                ];
	
	$scope.multipleCriteria = [{}];
	 
	$scope.gridOptions = { 
			enableFiltering: true,
			enablePaginationControls: true,
			enableSorting: true,
			enableRowSelection: true,
			enableRowHeaderSelection: false,
			enableColumnResizing: true,
			paginationPageSizes: [10, 12, 15, 18],	//18
			paginationPageSize: 18,				//18
	  };

	$scope.gridOptions.columnDefs = [
	 	{ name: 'firstName', 
	 		cellClass: 'gridField', 
	 		displayName: 'First Name', 
	 		width: 140, 
	 		maxWidth: 160, 
	 		minWidth: 130, 
	 		enableHiding: false, 
	 		enableCellEdit: false },
	 	{ name: 'lastName', 
	 		cellClass: 'gridField', 
	 		displayName: 'Last Name', 
	 		width: 250, 
	 		maxWidth: 480, 
	 		minWidth: 220, 
	 		enableHiding: false, 
	 		enableCellEdit: false },
	 	{ name: 'jobDesc',
	 		cellClass: 'gridField', 
	 		displayName: 'Job Desc', 
	 		width: 160, 
	 		maxWidth: 200, 
	 		minWidth: 120, 
	 		enableHiding: false, 
	 		enableCellEdit: false },
		 { name: 'titleDesc', 
	 		cellClass: 'gridField', 
	 		displayName: 'Title Desc', 
	 		width: 220, 
	 		maxWidth: 300, 
	 		minWidth: 150, 
	 		enableHiding: false, 
	 		enableCellEdit: false },
		 { name: 'costCenter', 
	 		cellClass: 'gridField', 
	 		displayName: 'Cost Center', 
	 		width: 170, 
	 		maxWidth: 200, 
	 		minWidth: 90, 
	 		enableHiding: false, 
	 		enableCellEdit: false },
	 	{ name: 'hireDate',
	 		cellClass: 'gridField', 
	 		displayName: 'Hire Date', 
	 		width: 160, 
	 		maxWidth: 200, 
	 		minWidth: 120, 
	 		enableHiding: false, 
	 		enableCellEdit: false }
	   ];
	
	$scope.gridStdOptions = {};
	$scope.gridAdvOptions = {};
	
	angular.copy($scope.gridOptions, $scope.gridStdOptions);	
	angular.copy($scope.gridOptions, $scope.gridAdvOptions);
	
	$scope.gridStdOptions.data = [];
	$scope.gridAdvOptions.data = [];
	 
	$scope.addNewCriteria = function(index) {
		console.log("Row ID: " + index);
		$scope.multipleCriteria.splice(index+1, 0, {});
	};
    
	$scope.removeCriteria = function(index) {
	  console.log("Row ID: " + index);
	  $scope.multipleCriteria.splice(index, 1);
	};
	
	$scope.setSelectedField = function(name) {
	  console.log("fieldName: " + name);
	  //var i = $scope.fields.indexOf(name);
	  //$scope.fields[i].selected = true;
	  //$scope.fields.splice(index, 1);   
	};
	 
	$scope.startSpin = function(key) {
		usSpinnerService.spin(key);
	};

	$scope.stopSpin = function(key) {
		usSpinnerService.stop(key);
	};

	$scope.setTitleCase = function(input) {
		if (input != null ) {
			return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
	};

	$scope.setLowerCase = function(input) {
		if (input != null ) {
			return input.replace(/\w\S*/g, function(txt){return txt.toLowerCase();});
		}
	};

	$scope.setUpperCase = function(input) {
		if (input != null ) {
			return input.replace(/\w\S*/g, function(txt){return txt.toUpperCase();});
		}
	};

	$scope.currentTimeMillis = function(ts) {
		var date = new Date().getTime();
		return date;
	};

	$scope.toggleLeftSideNav = buildToggler('left');

	$scope.closeLeftSideNav = function() {
		$mdSidenav('left').close()
		.then(function () {
			$log.debug("Closing Left Side Nav");
		});
	};

	$scope.$on('compareTo-broadcast', function() { 
		$scope.showPasswordMatchToast();
	});

	function buildToggler(navID) {
		return function() {
			$mdSidenav(navID)
			.toggle()
			.then(function () {
				$log.debug("toggle " + navID + " is done");
			});
		}
	};

	$scope.$on('$viewContentLoaded', function() {
		console.log("viewContentLoaded event triggered...");
		loadUserDefaults();
	});

	$scope.clearStandardForm = function () {
		$scope.firstName = "";
		$scope.lastName = "";
		
		$scope.firstLastNameChange();
		$scope.standardForm.$setPristine();
		$scope.standardForm.$setUntouched();
	};	
	
	$scope.clearAdvancedForm = function() {
		$scope.multipleCriteria = [{}];
		$scope.gridAdvOptions.data = [];
		
		$scope.advanced.$setPristine();
		$scope.advanced.$setUntouched();
	};

	$scope.toggleDebugMode = function() {
		$scope.debugFlag = !$scope.debugFlag;
		console.log("Inside toggleDebugMode...: " + $scope.debugFlag);
	};
	
	$scope.toggleJSONOutput = function() {
		$scope.enableJSON = !$scope.enableJSON;
		console.log("Inside toggleJSONOutput...: " + $scope.enableJSON);
	};

	$scope.firstLastNameChange = function() {
		if ($scope.firstName || $scope.lastName) {
			$scope.isStandardRequired = false;
		} else {
			$scope.isStandardRequired = true;
		}
	}

	$scope.showAbout = function(ev) {
		console.log("Inside showAbout()...");
				
	    $mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#myContainer')))
	        .clickOutsideToClose(false) 
	        .title('About Employee Directory Demo')
	        .textContent('This application will show you many of the features available\nin Angular Material, Spring Framework and MongoDB...')
	        .ariaLabel('Employee Directory Demo')
	        .ok('Ok')
	        .openFrom('#about')
	        .closeTo('#about')
	        .targetEvent(ev)
	    );
	  };
	  
	$scope.standardSearch = function (firstName, lastName) {
		var url = "";
	
		console.log("Inside standardSearch()...");
		console.log("firstName value...: " + firstName);
		console.log("lastName value....: " + lastName);
		
		$scope.gridActive = true;
	
		function onSuccess(response) {
			console.log("+++++standardSearch SUCCESS++++++");
			if ($scope.debugFlag == 'true' || $scope.debugFlag) {
				console.log("Inside standardSearch response..." + JSON.stringify(response.data));
			} else {
				console.log("Inside standardSearch response...(XML response is being skipped, debug=false)");
			}
			if (response.data.success != false) {
				$scope.gridStdOptions.data = response.data;
			} else {
				$scope.gridStdOptions.data = [];
			}
			$scope.stopSpin('spinner-1');
		};

		function onError(response) {
			console.log("-------gridStdOptions FAILED-------");
			$scope.stopSpin('spinner-1');
		};
		
		// Clear Grid Data
		$scope.gridStdOptions.data = [];
		
		$scope.startSpin('spinner-1');
		
		var addl_params ='?firstName=' + firstName + '&lastName=' + lastName + '&etc=' + new Date().getTime();
		
		//----MAKE AJAX REQUEST CALL to POST DATA----
		ajaxService.postData(standardSearchUrl, 'POST', null, addl_params).then(onSuccess, onError);

	};
	
	$scope.advancedSearch = function (criteriaSearch) {
		var url = "";
	
		console.log("Inside advancedSearch()...");
		console.log("multipleCriteria JSON...: " + JSON.stringify(criteriaSearch));
		
		$scope.gridActive = true;
	
		function onSuccess(response) {
			console.log("+++++advancedSearch SUCCESS++++++");
			if ($scope.debugFlag == 'true' || $scope.debugFlag) {
				console.log("Inside advancedSearch response..." + JSON.stringify(response.data));
			} else {
				console.log("Inside advancedSearch response...(XML response is being skipped, debug=false)");
			}
			if (response.data.success != false) {
				$scope.gridAdvOptions.data = response.data;
			} else {
				$scope.gridAdvOptions.data = [];
			}
			$scope.stopSpin('spinner-1');
		};

		function onError(response) {
			console.log("-------advancedSearch FAILED-------");
			$scope.stopSpin('spinner-1');
		};
		
		// Clear Grid Data
		$scope.gridAdvOptions.data = [];
		
		$scope.startSpin('spinner-1');
		var addl_params ='etc='+new Date().getTime();
		
		//----MAKE AJAX REQUEST CALL to POST DATA----
		ajaxService.postData(advancedSearchUrl, 'POST', criteriaSearch, '').then(onSuccess, onError);

	};

	$scope.setDefaults = function(debugFlag, baseUrl) {
		standardSearchUrl = baseUrl + "/rest/standardSearch";
		advancedSearchUrl = baseUrl + "/rest/advancedSearch";

		$scope.debugFlag = debugFlag;
		console.log("Setting Defaults");
		console.log("DebugFlag...............: "  + $scope.debugFlag);
	}
});
