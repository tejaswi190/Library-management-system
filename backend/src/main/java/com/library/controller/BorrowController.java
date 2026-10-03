package com.library.controller;

import com.library.dto.BorrowRecordDto;
import com.library.dto.IssueRequest;
import com.library.model.User;
import com.library.repository.UserRepository;
import com.library.service.BorrowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<BorrowRecordDto> issueBook(@Valid @RequestBody IssueRequest request) {
        return ResponseEntity.ok(borrowService.issueBook(request.getUserId(), request.getBookId()));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<BorrowRecordDto> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BorrowRecordDto>> myRecords(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(borrowService.getMyRecords(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BorrowRecordDto>> allRecords() {
        return ResponseEntity.ok(borrowService.getAllRecords());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<BorrowRecordDto>> overdueRecords() {
        return ResponseEntity.ok(borrowService.getOverdueRecords());
    }
}
