<%@ page language="java"%>

<!DOCTYPE html>
<html ng-app="app" ng-cloak>
<head>
<title>Associates Search</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet"
	href="include/angular-material/1.0.9/angular-material.css">

<script src="include/jquery-3.1.0.min.js"></script>
<!-- Angular Material requires Angular.js Libraries -->
<script src="include/angularjs/1.5.5/angular.min.js"></script>
<script src="include/angularjs/1.5.5/angular-animate.min.js"></script>
<script src="include/angularjs/1.5.5/angular-aria.min.js"></script>
<script src="include/angularjs/1.5.5/angular-messages.min.js"></script>

<script src="include/ui-grid.js"></script>
<link rel="stylesheet" href="include/ui-grid.css">

<!-- Angular Material Library -->
<script src="include/angular-material/1.0.9/angular-material.min.js"></script>

<!-- Get Material Icons/Font Awesome Icons -->
<link rel="stylesheet" href="include/material-icons.css">
<link rel="stylesheet" href="include/font-awesome.css">

<link rel="stylesheet" href="include/animate.min.css">
<link rel="stylesheet" href="include/styles.css">
<link rel="stylesheet" href="include/main.css">
<script src="include/spin.js"></script>
<script src="include/moment.js"></script>
<script src="include/angular-spinner.js"></script>

<!-- Our Application Angular Library -->
<script src="include/app.js"></script>
</head>

<%
	// This is JSP code to define RESTful call URL to get Manager List JSON data
	// can be replaced with any other way that you're using to define RESTful URL with parameters
	String fullProtocol = request.getProtocol().toLowerCase();
	String protocol[] = fullProtocol.split("/");
	String baseUrl = protocol[0] + "://" + request.getHeader("Host");
	String params = "";

	boolean isDebug = false;
	String debugParam = request.getParameter("debug");
	if (debugParam != null && (debugParam.toLowerCase().equals("true") || debugParam.toLowerCase().equals("yes")
			|| debugParam.equals("1"))) {
		isDebug = true;
	}
%>
<body ng-controller="MainCtrl">
<!-- <span us-spinner="{color: 'red', radius:30, width:8, length: 16}" spinner-key="spinner-0"></span> -->
	<md-toolbar>
		<div class="md-toolbar-tools">
			<h2>
				<img src="images/lark.png" alt="Lark Productions" />
			</h2>
			<span flex=""><span class="subtitle">Associate Search</span></span>
			<h2>
				<span></span>
			</h2>
			<md-menu md-position-mode="target-right target" >
	    	<md-button id="about" aria-label="Open demo menu" class="md-icon-button" ng-click="$mdOpenMenu($event)">
	    		<i class="material-icons">more_vert</i> 
	     </md-button>
	     <md-menu-content width="4">
	       <md-menu-item>
	         <md-button ng-click="toggleDebugMode()">
	         	<i class="fa fa-wrench" aria-hidden="true"></i>
	          <!-- <i class="material-icons">build</i> -->
	           &nbsp;Toggle Debug Mode
	         </md-button>
	       </md-menu-item>
	       <md-menu-item>
	         <md-button ng-click="toggleJSONOutput()">
	         	<i class="fa fa-cogs" aria-hidden="true"></i>
	          <!-- <i class="material-icons">settings_applications</i> -->
	           &nbsp;Toggle JSON Output
	         </md-button>
	       </md-menu-item>
	       <md-menu-divider></md-menu-divider>
	       <md-menu-item>
	         <md-button ng-click="showAbout($event)">
	         	<i class="fa fa-info-circle" aria-hidden="true"></i>
	          <!-- <i class="material-icons">info</i> -->
	           &nbsp;About Employee Directory
	         </md-button>
	       </md-menu-item>
	     </md-menu-content>
	   </md-menu>
		</div>
	</md-toolbar>

	<md-content id="myContainer"> <md-tabs md-dynamic-height md-border-bottom>

	<%-- Standard Search Functionality --%> 
	<md-tab label="Standard" md-on-select="resetForm()">
		<md-content class="md-padding">
			<div layout="row" layout-align="center start">
			<div layout-fill>
				<form class="form-horizontal" id="standardForm" name="standardForm" novalidate="true">
					<md-card> <%-- <md-content md-theme="docs-dark"> --%> 
						<md-content>
							<md-card-title> <md-card-title-text>
							<span class="md-headline">Standard Associate Search<br /></span>
							<span class="md-body-1">Please fill in search criteria on click on Search button.</span> 
							</md-card-title-text> </md-card-title>
			
							<div layout="column" ng-cloak class="md-inline-form">
								<span us-spinner spinner-key="spinner-1"></span>	
								<%-- <md-content md-theme="docs-dark" layout-gt-sm="row" layout-padding> --%>
								<md-content layout-gt-sm="row" layout-padding>
								<div layout-gt-xs="row">
									<md-input-container> 
									<label>First Name</label> 
									<input name="firstName" style="width: 250px;" ng-required="isStandardRequired" ng-change="firstLastNameChange()" ng-model="firstName" minlength="1" maxlength="50">
									</md-input-container>
								</div>
								<div layout-gt-xs="row">
									<md-input-container> 
										<label>Last Name</label> 
										<input name="lastName" style="width: 450px;" ng-required="isStandardRequired" ng-change="firstLastNameChange()" ng-model="lastName" minlength="1" maxlength="80">
									</md-input-container>
								</div>
							</md-content>
						</div>
	
						<md-card-actions layout="row" layout-align="end center">
							<md-button class="md-raised md-primary" ng-disabled="standardForm.$invalid" ng-click="standardSearch(firstName, lastName)">
								<i class="fa fa-search"></i>&nbsp;Search Associate 
							</md-button> 
							<md-button	class="md-raised md-primary" ng-disabled="standardForm.$invalid" ng-click="clearStandardForm()"> 
								<i class="fa fa-times"></i>&nbsp;Clear 
							</md-button> 
						</md-card-actions> 
					</md-content> 
				</md-card>
			</form>
			
			<md-card> <%-- <md-content md-theme="docs-dark"> --%> 
				<md-content>
					<md-card-title> 
						<md-card-title-text>
							<span class="md-headline">Search Results</span>
						</md-card-title-text> 
					</md-card-title>
					<div ui-grid="gridStdOptions" ui-grid-selection class="grid" ui-grid-resize-columns ui-grid-move-columns ui-grid-pagination ui-grid-edit></div>
				</md-content>
			</md-card>
		</md-content>
	</md-tab>
	
  <%-- Advanced Search Functionality --%> 
	<md-tab label="Advanced" md-on-select="resetForm()">
		<md-content class="md-padding">
			<div layout="row" layout-align="center start">
				<div layout-fill>
					<form class="form-horizontal" id="advancedForm" name="advancedForm">
						<md-card> <%-- <md-content md-theme="docs-dark"> --%> 
							<md-content>
								<md-card-title> 
									<md-card-title-text>
										<span class="md-headline">Advanced Associate Search<br /></span>
										<span class="md-body-1">Please choose <em>Field Name</em> criteria from dropdown, select <em>Operator</em>, 
										enter search <em>Value</em>.  Include additional items as per your needs by hitting '+' icon.</span> 
									</md-card-title-text> 
								</md-card-title>
					
								<span us-spinner spinner-key="spinner-1"></span>	
								<div ng-repeat="criteria in multipleCriteria">								
									<div layout="column" ng-cloak class="md-inline-form">
										<%-- <md-content md-theme="docs-dark" layout-gt-sm="row" layout-padding> --%>
										<md-content layout-gt-sm="row" layout-padding-minimal>
										<ng-form name="fieldForm">
											<div layout-gt-xs="row">
												<md-input-container md-no-float> 
												<label>Field Name</label> 
												<md-select required="" style="width: 200px;" name="field" ng-model="criteria.field" ng-change="setSelectedField(criteria.field)">
													<md-option ng-value="field" ng-repeat="field in fields" ng-disabled="field.selected">{{field.name}}</md-option>
												</md-select>
												<div ng-messages="fieldForm.field.$error" ng-show="fieldForm.field.$touched">
													<div ng-message="required">Concept is required!</div>
												</div>
												</md-input-container>
											</div>
										</ng-form> 
										<div layout-gt-xs="row">
											<md-input-container  class="md-block"> 
											<span class="label">is</span> 
											</md-input-container>
										</div>
										<ng-form name="operatorForm">
											<div layout-gt-xs="row">
												<md-input-container> 
												<label>Operator</label> 
												<md-select required="" name="operator" ng-model="criteria.operator" style="min-width: 150px;">
													<md-option ng-value="operator" ng-repeat="operator in operations | filter: { type: criteria.field.type }">{{operator.name}}</md-option>
												</md-select>
												<div ng-messages="operatorForm.operator.$error" ng-show="operatorForm.operator.$touched">
													<div ng-message="required">Operator is required!</div>
												</div>
												</md-input-container>
											</div>
										</ng-form>
										<div ng-if="criteria.field.type != 'date'">
											<ng-form name="valueForm">
												<div layout-gt-xs="row">
													<md-input-container>
														<label>Value for {{criteria.field.name}}</label> 
														<input required="" name="searchValue" style="width: 350px;" ng-model="criteria.value" minlength="1" maxlength="80">
														<div ng-messages="valueForm.searchValue.$error" ng-show="valueForm.searchValue.$touched">
															<div ng-message="required">Value is required!</div>
														</div>
													</md-input-container>
												</div>
											</ng-form>
										</div>
										<div ng-if="criteria.field.type == 'date'">
											<ng-form name="valueForm">
												<div layout-gt-xs="row">
													<md-input-container>
														<label>Date of Hire (MM/DD/YYYY)</label>
														<!-- <md-datepicker name="searchValue" ng-required="true" ng-model="criteria.value"></md-datepicker>
														<div class="validation-messages"
															ng-messages="valueForm.searchValue.$error" ng-if="valueForm.searchValue.$dirty">
															<div ng-message="valid">The entered value is not a date!</div>
															<div ng-message="required">This date is required!</div>
														</div> 
														<label>Date Value</label> -->
														<input required="" type="date" style="width: 350px;"  ng-model="criteria.value" />
														<div ng-messages="valueForm.searchValue.$error" ng-show="valueForm.searchValue.$touched">
															<div ng-message="required">Value is required!</div>
														</div>
													</md-input-container>
												</div>
											</ng-form>
										</div>
										<div layout-gt-xs="row">
											<md-button class="md-fab md-mini md-primary md-hue-1" aria-label="add" ng-click="addNewCriteria($index)">
												<md-tooltip md-direction="bottom">Add New Row</md-tooltip>
												<i class="fa fa-plus"></i> 
											</md-button> 
											<md-button class="md-fab md-mini md-primary md-hue-1" aria-label="remove" ng-click="removeCriteria($index)" ng-hide="multipleCriteria.length==1">
												<md-tooltip md-direction="bottom">Remove Current Row</md-tooltip>
												<i class="fa fa-minus "></i> 
											</md-button> 
										</div>										
									</md-content>
								</div>
							</div>
							 
							<md-card-actions layout="row" layout-align="end center">
								<md-button class="md-raised md-primary" ng-disabled="advancedForm.$invalid" ng-click="advancedSearch(multipleCriteria)">
									<i class="fa fa-search"></i>&nbsp;Search Associate 
								</md-button> 
								<md-button	class="md-raised md-primary" ng-click="clearAdvancedForm()"> 
									<i class="fa fa-times"></i>&nbsp;Clear 
								</md-button> 
							</md-card-actions> 
						</md-content> 
					</md-card>
				</form>
				
				<md-card> <%-- <md-content md-theme="docs-dark"> --%> 
					<md-content>
						<md-card-title> 
							<md-card-title-text>
								<span class="md-headline">Search Results</span>
							</md-card-title-text> 
						</md-card-title>
			
						<div ui-grid="gridAdvOptions" ui-grid-selection class="grid" ui-grid-resize-columns ui-grid-move-columns ui-grid-pagination ui-grid-edit></div>
					</md-content>
				</md-card>
				<div ng-if="enableJSON">
					<div class="debug">
						<div class="subtitle">JSON DEBUG OUTPUT</div>
						{{multipleCriteria}}
					</div>
				</div>
			</div>
		</div>
	</md-content>
</md-tab>
</md-tabs>
<div ng-element-ready="setDefaults('<%=isDebug%>', '<%=baseUrl%>')"></div>
</body>
</html>
