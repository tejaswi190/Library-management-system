package com.library.controller;

import com.library.dto.ReportSummaryDto;
import com.library.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDto> summary() {
        return ResponseEntity.ok(reportService.getSummary());
    }
}
