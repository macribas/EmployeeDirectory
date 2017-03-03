package com.avaldes.model;

public class SelectionCriteria {
	private Field field;
	
	private Operator operator;
	
	private String value;
	
	public Field getField() {
		return field;
	}
	
	public void setField(Field field) {
		this.field = field;
	}
	
	public Operator getOperator() {
		return operator;
	}
	
	public void setOperator(Operator operator) {
		this.operator = operator;
	}
	
	public String getValue() {
		return value;
	}
	
	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "SelectionCriteria [field=" + field + ", operator=" + operator
				+ ", value=" + value + "]";
	}
}
