package com.library.scheduler;

import com.library.service.BorrowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OverdueScheduler {

    private final BorrowService borrowService;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void checkOverdueBooks() {
        log.info("Running overdue check scheduler...");
        borrowService.markOverdueAndFine();
        log.info("Overdue check completed.");
    }
}
