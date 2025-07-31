package com.jirabot.service;

import com.jirabot.dto.CreateIssueRequest;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ExcelProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(ExcelProcessingService.class);

    // Common JIRA issue types
    private static final List<String> VALID_ISSUE_TYPES = Arrays.asList(
            "Bug", "Task", "Story", "Epic", "Improvement", "New Feature", "Sub-task");

    // Common JIRA priorities
    private static final List<String> VALID_PRIORITIES = Arrays.asList(
            "Lowest", "Low", "Medium", "High", "Highest");

    public List<CreateIssueRequest> parseExcelFile(MultipartFile file) throws IOException {
        List<CreateIssueRequest> issueRequests = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Get the first sheet

            // Skip header row and start from row 1
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null)
                    continue;

                CreateIssueRequest request = parseRowToIssueRequest(row, rowIndex);
                if (request != null && isValidIssueRequest(request)) {
                    issueRequests.add(request);
                } else if (request != null) {
                    logger.warn("Invalid issue request at row {}: missing required fields", rowIndex + 1);
                }
            }
        }

        logger.info("Parsed {} valid issue requests from Excel file", issueRequests.size());
        return issueRequests;
    }

    private CreateIssueRequest parseRowToIssueRequest(Row row, int rowIndex) {
        try {
            CreateIssueRequest request = new CreateIssueRequest();

            // Column A (0): Summary
            Cell summaryCell = row.getCell(0);
            if (summaryCell != null) {
                String summary = getCellValueAsString(summaryCell);
                request.setSummary(summary);
                logger.debug("Row {}: Summary = '{}'", rowIndex + 1, summary);
            }

            // Column B (1): Description
            Cell descriptionCell = row.getCell(1);
            if (descriptionCell != null) {
                String description = getCellValueAsString(descriptionCell);
                request.setDescription(description);
                logger.debug("Row {}: Description = '{}'", rowIndex + 1, description);
            }

            // Column C (2): Issue Type
            Cell issueTypeCell = row.getCell(2);
            if (issueTypeCell != null) {
                String issueType = getCellValueAsString(issueTypeCell);
                if (issueType.isEmpty()) {
                    issueType = "Task";
                } else {
                    // Validate and normalize issue type
                    issueType = validateAndNormalizeIssueType(issueType);
                }
                request.setIssueTypeName(issueType);
                logger.debug("Row {}: Issue Type = '{}'", rowIndex + 1, issueType);
            } else {
                request.setIssueTypeName("Task");
                logger.debug("Row {}: Issue Type = 'Task' (default)", rowIndex + 1);
            }

            // Column D (3): Priority
            Cell priorityCell = row.getCell(3);
            if (priorityCell != null) {
                String priority = getCellValueAsString(priorityCell);
                if (priority.isEmpty()) {
                    priority = "Medium";
                } else {
                    // Validate and normalize priority
                    priority = validateAndNormalizePriority(priority);
                }
                request.setPriorityName(priority);
                logger.debug("Row {}: Priority = '{}'", rowIndex + 1, priority);
            } else {
                request.setPriorityName("Medium");
                logger.debug("Row {}: Priority = 'Medium' (default)", rowIndex + 1);
            }

            // Column E (4): Labels (comma-separated)
            Cell labelsCell = row.getCell(4);
            if (labelsCell != null) {
                String labelsString = getCellValueAsString(labelsCell);
                if (!labelsString.isEmpty()) {
                    List<String> labels = Arrays.asList(labelsString.split(","));
                    // Trim whitespace from labels
                    labels = labels.stream().map(String::trim).filter(s -> !s.isEmpty()).toList();
                    request.setLabels(labels);
                }
            }

            return request;

        } catch (Exception e) {
            logger.error("Error parsing row {} in Excel file: {}", rowIndex + 1, e.getMessage());
            return null;
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    // Convert numeric to string, removing decimal if it's a whole number
                    double numericValue = cell.getNumericCellValue();
                    if (numericValue == Math.floor(numericValue)) {
                        return String.valueOf((long) numericValue);
                    } else {
                        return String.valueOf(numericValue);
                    }
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue().trim();
                } catch (Exception e) {
                    return String.valueOf(cell.getNumericCellValue());
                }
            default:
                return "";
        }
    }

    private boolean isValidIssueRequest(CreateIssueRequest request) {
        // At minimum, we need a summary
        return request.getSummary() != null && !request.getSummary().trim().isEmpty();
    }

    /**
     * Validates the Excel file structure
     * Expected columns:
     * A: Summary (required)
     * B: Description (optional)
     * C: Issue Type (optional, defaults to "Task")
     * D: Priority (optional, defaults to "Medium")
     * E: Labels (optional, comma-separated)
     */
    public boolean validateExcelStructure(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            // Check if there's at least a header row
            if (sheet.getLastRowNum() < 0) {
                return false;
            }

            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                return false;
            }

            // We expect at least one column (Summary)
            return headerRow.getLastCellNum() >= 1;
        }
    }

    /**
     * Validates and normalizes issue type to match JIRA standards
     */
    private String validateAndNormalizeIssueType(String issueType) {
        if (issueType == null || issueType.trim().isEmpty()) {
            return "Task";
        }

        String normalized = issueType.trim();

        // Check for exact match (case-insensitive)
        for (String validType : VALID_ISSUE_TYPES) {
            if (validType.equalsIgnoreCase(normalized)) {
                return validType; // Return the properly cased version
            }
        }

        // Check for common variations
        String lowerCase = normalized.toLowerCase();
        switch (lowerCase) {
            case "feature":
            case "enhancement":
                return "New Feature";
            case "defect":
            case "issue":
                return "Bug";
            case "user story":
                return "Story";
            case "subtask":
            case "sub task":
                return "Sub-task";
            default:
                logger.warn("Unknown issue type '{}', defaulting to 'Task'", issueType);
                return "Task"; // Default fallback
        }
    }

    /**
     * Validates and normalizes priority to match JIRA standards
     */
    private String validateAndNormalizePriority(String priority) {
        if (priority == null || priority.trim().isEmpty()) {
            return "Medium";
        }

        String normalized = priority.trim();

        // Check for exact match (case-insensitive)
        for (String validPriority : VALID_PRIORITIES) {
            if (validPriority.equalsIgnoreCase(normalized)) {
                return validPriority; // Return the properly cased version
            }
        }

        // Check for common variations
        String lowerCase = normalized.toLowerCase();
        switch (lowerCase) {
            case "critical":
            case "urgent":
                return "Highest";
            case "important":
                return "High";
            case "normal":
            case "standard":
                return "Medium";
            case "minor":
                return "Low";
            case "trivial":
                return "Lowest";
            default:
                logger.warn("Unknown priority '{}', defaulting to 'Medium'", priority);
                return "Medium"; // Default fallback
        }
    }
}
