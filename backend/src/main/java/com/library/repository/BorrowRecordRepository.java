package com.library.repository;

import com.library.model.BorrowRecord;
import com.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByUser(User user);

    List<BorrowRecord> findByStatus(BorrowRecord.Status status);

    List<BorrowRecord> findByUserAndStatus(User user, BorrowRecord.Status status);

    @Query("SELECT br FROM BorrowRecord br WHERE br.dueDate < :today AND br.status = 'BORROWED'")
    List<BorrowRecord> findNewlyOverdue(@Param("today") LocalDate today);

    @Query("SELECT br FROM BorrowRecord br WHERE br.status IN ('BORROWED', 'OVERDUE')")
    List<BorrowRecord> findAllActive();

    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.status IN ('BORROWED', 'OVERDUE')")
    long countActive();

    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.status = 'OVERDUE'")
    long countOverdue();

    @Query("SELECT COALESCE(SUM(br.fineAmount), 0) FROM BorrowRecord br")
    BigDecimal sumAllFines();

    boolean existsByUserAndBookAndStatus(User user, com.library.model.Book book, BorrowRecord.Status status);
}
