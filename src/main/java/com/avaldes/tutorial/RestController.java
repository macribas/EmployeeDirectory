package com.avaldes.tutorial;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.avaldes.dao.EmployeeRepository;
import com.avaldes.model.Employee;
import com.avaldes.model.SelectionCriteria;

/**
 * Handles requests for the application home page.
 */
@Controller
public class RestController {

	private static final Logger logger = LoggerFactory
			.getLogger(RestController.class);
	public static final String APPLICATION_JSON = "application/json";
	public static final String APPLICATION_XML = "application/xml";
	public static final String APPLICATION_HTML = "text/html";

	@Autowired
	private EmployeeRepository employeeRepository;

	/**
	 * Simply selects the home view to render by returning its name.
	 * 
	 */
	@RequestMapping(value = "/status", 
				method = RequestMethod.GET, produces = APPLICATION_HTML)
	public @ResponseBody String status() {
		return "application OK...";
	}

	@RequestMapping(value = "/employees", method = RequestMethod.GET)
	public @ResponseBody List<Employee> getAllEmployees() {
		logger.info("Inside getAllEmployees() method...");

		List<Employee> allEmployees = employeeRepository
				.getAllEmployees();

		return allEmployees;
	}

	@RequestMapping(value = "/getemployeebyid", 
			method = RequestMethod.GET, produces = {
			APPLICATION_JSON, APPLICATION_XML })
	public @ResponseBody Employee getEmployeeById(
			@RequestParam("id") String id) {
		Employee employee = employeeRepository.getEmployeeById(id);

		if (employee != null) {
			logger.info(
					"Inside getEmployeeById, returned: " + employee.toString());
		} else {
			logger
					.info("Inside getEmployeeById, ID: " + id + ", NOT FOUND!");
		}

		return employee;
	}

	@RequestMapping(value = "/standardSearch", method = RequestMethod.POST)
	public @ResponseBody List<Employee> standardSearch(
			@RequestParam("firstName") String firstName,
			@RequestParam("lastName") String lastName) {
		logger.info("Inside standardSearch() method...");
		logger.info("firstName....: " + firstName);
		logger.info("lastName.....: " + lastName);

		List<Employee> filteredAssociates = employeeRepository
				.getEmployeesStandardSearch(firstName, lastName);

		return filteredAssociates;
	}

	@RequestMapping(value = "/advancedSearch", method = RequestMethod.POST)
	public @ResponseBody List<Employee> advancedSearch(
			@RequestBody List<SelectionCriteria> criteriaList) {
		logger.info("Inside advancedSearch() method...");

		/*
		 * for (SelectionCriteria criteria: criteriaList) {
		 * logger.info(criteria.toString()); }
		 */

		List<Employee> filteredAssociates = employeeRepository
				.getEmployeesBySelectionCriteria(criteriaList);

		return filteredAssociates;
	}

	@RequestMapping(value = "/employee/delete", 
			method = RequestMethod.DELETE, produces = {
			APPLICATION_JSON, APPLICATION_XML })
	public @ResponseBody RestResponse deleteEmployeeById(
			@RequestParam("id") String id) {
		RestResponse response;

		Employee employee = employeeRepository.deleteEmployee(id);

		if (employee != null) {
			logger.info("Inside deleteEmployeeById, deleted: "
					+ employee.toString());
			response = new RestResponse(true,
					"Successfully deleted employee: " + employee.toString());
		} else {
			logger.info(
					"Inside deleteEmployeeById, ID: " + id + ", NOT FOUND!");
			response = new RestResponse(false,
					"Failed to delete ID: " + id);
		}

		return response;
	}

	@RequestMapping(value = "/employee/update", 
			method = RequestMethod.PUT, consumes = {
			APPLICATION_JSON, APPLICATION_XML }, produces = {
					APPLICATION_JSON, APPLICATION_XML })
	public @ResponseBody RestResponse updateEmployeeById(
			@RequestParam("id") String id, @RequestBody Employee employee) {
		RestResponse response;

		Employee myEmployee = employeeRepository.updateEmployee(id,
				employee);

		if (myEmployee != null) {
			logger.info("Inside updateEmployeeById, updated: "
					+ myEmployee.toString());
			response = new RestResponse(true,
					"Successfully updated ID: " + myEmployee.toString());
		} else {
			logger.info(
					"Inside updateEmployeeById, ID: " + id + ", NOT FOUND!");
			response = new RestResponse(false,
					"Failed to update ID: " + id);
		}

		return response;
	}

	@RequestMapping(value = "/employee/add", 
			method = RequestMethod.POST, consumes = {
			APPLICATION_JSON, APPLICATION_XML }, produces = {
					APPLICATION_JSON, APPLICATION_XML })

	public @ResponseBody RestResponse addEmployee(
			@RequestParam("id") String id, @RequestBody Employee employee) {
		RestResponse response;

		logger.info("Inside addEmployee, model attribute: "
				+ employee.toString());

		if (id == null) {
			response = new RestResponse(false, "ID may not be null.");
			return response;
		}

		if (id != null && id.isEmpty()) {
			response = new RestResponse(false, "ID may not be empty.");
			return response;
		}

		Employee myEmployee = employeeRepository.getEmployeeById(id);
		if (myEmployee != null) {
			if (myEmployee.getId() != null
					&& myEmployee.getId().equalsIgnoreCase(id)) {
				response = new RestResponse(false,
						"ID already exists in the system.");
				return response;
			}
		}

		if (employee.getId() != null && employee.getId().length() > 0) {
			logger
					.info("Inside addEmployee, adding: " + employee.toString());
			employeeRepository.addEmployee(employee);
			response = new RestResponse(true,
					"Successfully added Employee: " + employee.getId());
		} else {
			logger.info("Failed to insert...");
			response = new RestResponse(false, "Failed to insert...");
		}

		return response;
	}
}