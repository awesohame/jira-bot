package com.jirabot.entity;

public enum TicketStatus {
    DRAFT("Draft"),
    SUBMITTED("Submitted"),
    IN_REVIEW("In Review"),
    APPROVED("Approved"),
    IN_DEVELOPMENT("In Development"),
    TESTING("Testing"),
    DEPLOYED("Deployed"),
    CLOSED("Closed"),
    CANCELLED("Cancelled");

    private final String displayName;

    TicketStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
