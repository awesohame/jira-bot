package com.jirabot.dto;

import java.util.List;

public class BulkIssueCreationResponse {
    private int totalProcessed;
    private int successfullyCreated;
    private int failed;
    private List<String> createdIssueKeys;
    private List<BulkIssueError> errors;

    // Default constructor
    public BulkIssueCreationResponse() {
    }

    // Constructor
    public BulkIssueCreationResponse(int totalProcessed, int successfullyCreated, int failed,
            List<String> createdIssueKeys, List<BulkIssueError> errors) {
        this.totalProcessed = totalProcessed;
        this.successfullyCreated = successfullyCreated;
        this.failed = failed;
        this.createdIssueKeys = createdIssueKeys;
        this.errors = errors;
    }

    // Getters and setters
    public int getTotalProcessed() {
        return totalProcessed;
    }

    public void setTotalProcessed(int totalProcessed) {
        this.totalProcessed = totalProcessed;
    }

    public int getSuccessfullyCreated() {
        return successfullyCreated;
    }

    public void setSuccessfullyCreated(int successfullyCreated) {
        this.successfullyCreated = successfullyCreated;
    }

    public int getFailed() {
        return failed;
    }

    public void setFailed(int failed) {
        this.failed = failed;
    }

    public List<String> getCreatedIssueKeys() {
        return createdIssueKeys;
    }

    public void setCreatedIssueKeys(List<String> createdIssueKeys) {
        this.createdIssueKeys = createdIssueKeys;
    }

    public List<BulkIssueError> getErrors() {
        return errors;
    }

    public void setErrors(List<BulkIssueError> errors) {
        this.errors = errors;
    }

    public static class BulkIssueError {
        private int rowNumber;
        private String errorMessage;
        private CreateIssueRequest failedRequest;

        public BulkIssueError() {
        }

        public BulkIssueError(int rowNumber, String errorMessage, CreateIssueRequest failedRequest) {
            this.rowNumber = rowNumber;
            this.errorMessage = errorMessage;
            this.failedRequest = failedRequest;
        }

        public int getRowNumber() {
            return rowNumber;
        }

        public void setRowNumber(int rowNumber) {
            this.rowNumber = rowNumber;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public void setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
        }

        public CreateIssueRequest getFailedRequest() {
            return failedRequest;
        }

        public void setFailedRequest(CreateIssueRequest failedRequest) {
            this.failedRequest = failedRequest;
        }
    }
}
