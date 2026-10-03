package com.library.dto;

import com.library.model.BorrowRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRecordDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String studentId;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private BorrowRecord.Status status;
    private BigDecimal fineAmount;

    public static BorrowRecordDto from(BorrowRecord record) {
        return BorrowRecordDto.builder()
                .id(record.getId())
                .userId(record.getUser().getId())
                .userName(record.getUser().getName())
                .userEmail(record.getUser().getEmail())
                .studentId(record.getUser().getStudentId())
                .bookId(record.getBook().getId())
                .bookTitle(record.getBook().getTitle())
                .bookAuthor(record.getBook().getAuthor())
                .borrowDate(record.getBorrowDate())
                .dueDate(record.getDueDate())
                .returnDate(record.getReturnDate())
                .status(record.getStatus())
                .fineAmount(record.getFineAmount())
                .build();
    }
}
