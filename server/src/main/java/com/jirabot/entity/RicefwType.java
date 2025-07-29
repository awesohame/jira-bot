package com.jirabot.entity;

public enum RicefwType {
    REPORT("Report", "R"),
    INTERFACE("Interface", "I"),
    CONVERSION("Conversion", "C"),
    ENHANCEMENT("Enhancement", "E"),
    FORM("Form", "F"),
    WORKFLOW("Workflow", "W");

    private final String displayName;
    private final String code;

    RicefwType(String displayName, String code) {
        this.displayName = displayName;
        this.code = code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getCode() {
        return code;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
