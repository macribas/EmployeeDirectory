package com.avaldes.model;

public class Field {
	private String id;
	private String name;
	private String type;
	private String selected;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSelected() {
		return selected;
	}

	public void setSelected(String selected) {
		this.selected = selected;
	}

	@Override
	public String toString() {
		return "Field [id=" + id + ", name=" + name + ", type=" + type
				+ ", selected=" + selected + "]";
	}

}
