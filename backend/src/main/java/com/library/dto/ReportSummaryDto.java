package com.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryDto {
    private long totalBooks;
    private long totalStudents;
    private long activeBorrows;
    private long overdueCount;
    private BigDecimal totalFinesCollected;
}
