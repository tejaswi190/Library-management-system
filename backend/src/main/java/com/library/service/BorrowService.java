package com.library.service;

import com.library.dto.BorrowRecordDto;
import com.library.model.*;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${library.fine.per.day:5}")
    private int finePerDay;

    @Value("${library.loan.days:14}")
    private int loanDays;

    @Transactional
    public BorrowRecordDto issueBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No copies available for: " + book.getTitle());
        }
        if (borrowRecordRepository.existsByUserAndBookAndStatus(user, book, BorrowRecord.Status.BORROWED)) {
            throw new RuntimeException("Student already has this book borrowed");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LocalDate today = LocalDate.now();
        BorrowRecord record = BorrowRecord.builder()
                .user(user)
                .book(book)
                .borrowDate(today)
                .dueDate(today.plusDays(loanDays))
                .status(BorrowRecord.Status.BORROWED)
                .fineAmount(BigDecimal.ZERO)
                .build();

        BorrowRecord saved = borrowRecordRepository.save(record);
        notificationService.push(user, "Book \"" + book.getTitle() + "\" issued to you. Due date: " + saved.getDueDate());
        return BorrowRecordDto.from(saved);
    }

    @Transactional
    public BorrowRecordDto returnBook(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        if (record.getStatus() == BorrowRecord.Status.RETURNED) {
            throw new RuntimeException("Book already returned");
        }

        LocalDate today = LocalDate.now();
        record.setReturnDate(today);
        record.setStatus(BorrowRecord.Status.RETURNED);

        if (today.isAfter(record.getDueDate())) {
            long overdueDays = ChronoUnit.DAYS.between(record.getDueDate(), today);
            BigDecimal fine = BigDecimal.valueOf(overdueDays * finePerDay);
            record.setFineAmount(fine);
            notificationService.push(record.getUser(),
                    "Book \"" + record.getBook().getTitle() + "\" returned. Fine charged: ₹" + fine);
        } else {
            notificationService.push(record.getUser(),
                    "Book \"" + record.getBook().getTitle() + "\" returned successfully. No fine.");
        }

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return BorrowRecordDto.from(borrowRecordRepository.save(record));
    }

    public List<BorrowRecordDto> getMyRecords(User user) {
        return borrowRecordRepository.findByUser(user)
                .stream().map(BorrowRecordDto::from).collect(Collectors.toList());
    }

    public List<BorrowRecordDto> getAllRecords() {
        return borrowRecordRepository.findAll()
                .stream().map(BorrowRecordDto::from).collect(Collectors.toList());
    }

    public List<BorrowRecordDto> getOverdueRecords() {
        return borrowRecordRepository.findByStatus(BorrowRecord.Status.OVERDUE)
                .stream().map(BorrowRecordDto::from).collect(Collectors.toList());
    }

    @Transactional
    public void markOverdueAndFine() {
        List<BorrowRecord> newlyOverdue = borrowRecordRepository.findNewlyOverdue(LocalDate.now());
        for (BorrowRecord record : newlyOverdue) {
            record.setStatus(BorrowRecord.Status.OVERDUE);
            long days = ChronoUnit.DAYS.between(record.getDueDate(), LocalDate.now());
            record.setFineAmount(BigDecimal.valueOf(days * finePerDay));
            borrowRecordRepository.save(record);
            notificationService.push(record.getUser(),
                    "OVERDUE: \"" + record.getBook().getTitle() + "\" is overdue by " + days + " day(s). Fine: ₹" + record.getFineAmount());
        }
    }
}
