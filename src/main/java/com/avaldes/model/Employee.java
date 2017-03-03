package com.avaldes.model;

import java.util.Date;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.avaldes.util.JsonDateTimeSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Document
public class Employee {
	
	@Id
	private String id;
	private String jobDesc;
	private String employeeType;
	private String employeeStatus;
	private String locationType;
	private String titleDesc;  
	private String altTitle;  
	private String costCenter;
	private Integer workingShift;
	private String firstName;
	private String preferredName;
	private String middle;
	private String lastName;
	private String fullName;
	private String country; 
	private String companyName;
	private Date hireDate;
	private boolean isActive;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getJobDesc() {
		return jobDesc;
	}
	
	public void setJobDesc(String jobDesc) {
		this.jobDesc = jobDesc;
	}
	
	public String getEmployeeType() {
		return employeeType;
	}
	
	public void setEmployeeType(String employeeType) {
		this.employeeType = employeeType;
	}
	
	public String getEmployeeStatus() {
		return employeeStatus;
	}
	
	public void setEmployeeStatus(String employeeStatus) {
		this.employeeStatus = employeeStatus;
	}
	
	public String getLocationType() {
		return locationType;
	}
	
	public void setLocationType(String locationType) {
		this.locationType = locationType;
	}
	
	public String getTitleDesc() {
		return titleDesc;
	}
	
	public void setTitleDesc(String titleDesc) {
		this.titleDesc = titleDesc;
	}
	
	public String getAltTitle() {
		return altTitle;
	}
	
	public void setAltTitle(String altTitle) {
		this.altTitle = altTitle;
	}
	
	public String getCostCenter() {
		return costCenter;
	}
	
	public void setCostCenter(String costCenter) {
		this.costCenter = costCenter;
	}
	
	public Integer getWorkingShift() {
		return workingShift;
	}
	
	public void setWorkingShift(Integer workingShift) {
		this.workingShift = workingShift;
	}
	
	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	
	public String getPreferredName() {
		return preferredName;
	}
	
	public void setPreferredName(String preferredName) {
		this.preferredName = preferredName;
	}
	
	public String getMiddle() {
		return middle;
	}
	
	public void setMiddle(String middle) {
	
		this.middle = middle;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	@JsonSerialize(using=JsonDateTimeSerializer.class)
	public Date getHireDate() {
		return hireDate;
	}

	public void setHireDate(Date hireDate) {
		this.hireDate = hireDate;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public String getFullName() {
		return fullName;
	}
	
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	
	public String getCountry() {
		return country;
	}
	
	public void setCountry(String country) {
		this.country = country;
	}
	
	public String getCompanyName() {
		return companyName;
	}
	
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	
	public boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(boolean isActive) {
		this.isActive = isActive;
	}

	@Override
	public String toString() {
		return "Employee [id=" + id + ", jobDesc=" + jobDesc
				+ ", employeeType=" + employeeType + ", employeeStatus="
				+ employeeStatus + ", locationType=" + locationType
				+ ", titleDesc=" + titleDesc + ", altTitle=" + altTitle
				+ ", costCenter=" + costCenter + ", workingShift="
				+ workingShift + ", firstName=" + firstName
				+ ", preferredName=" + preferredName + ", middle=" + middle
				+ ", lastName=" + lastName + ", fullName=" + fullName
				+ ", country=" + country + ", companyName=" + companyName
				+ ", hireDate=" + hireDate + ", isActive=" + isActive + "]";
	}
}
