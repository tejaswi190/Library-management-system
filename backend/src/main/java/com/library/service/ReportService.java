package com.library.service;

import com.library.dto.ReportSummaryDto;
import com.library.model.User;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public ReportSummaryDto getSummary() {
        return ReportSummaryDto.builder()
                .totalBooks(bookRepository.count())
                .totalStudents(userRepository.findByRole(User.Role.STUDENT).size())
                .activeBorrows(borrowRecordRepository.countActive())
                .overdueCount(borrowRecordRepository.countOverdue())
                .totalFinesCollected(borrowRecordRepository.sumAllFines())
                .build();
    }
}
