package com.library.config;

import com.library.model.*;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedAdmin();
        seedStudents();
        seedBooks();
        seedBorrowRecords();
    }

    private void seedAdmin() {
        if (userRepository.findByEmail("admin@library.com").isEmpty()) {
            userRepository.save(User.builder()
                    .name("Library Admin")
                    .email("admin@library.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .department("Administration")
                    .build());
            log.info("Admin seeded — email: admin@library.com | password: admin123");
        }
    }

    private void seedStudents() {
        if (userRepository.findByRole(User.Role.STUDENT).isEmpty()) {
            List<User> students = List.of(
                User.builder().name("Arjun Sharma").email("arjun@medcollege.edu")
                    .password(passwordEncoder.encode("student123")).role(User.Role.STUDENT)
                    .studentId("MED2021001").department("MBBS - 3rd Year").phone("9876543210").build(),
                User.builder().name("Priya Nair").email("priya@medcollege.edu")
                    .password(passwordEncoder.encode("student123")).role(User.Role.STUDENT)
                    .studentId("MED2021002").department("MBBS - 3rd Year").phone("9876543211").build(),
                User.builder().name("Rohan Verma").email("rohan@medcollege.edu")
                    .password(passwordEncoder.encode("student123")).role(User.Role.STUDENT)
                    .studentId("MED2022001").department("MBBS - 2nd Year").phone("9876543212").build(),
                User.builder().name("Sneha Patel").email("sneha@medcollege.edu")
                    .password(passwordEncoder.encode("student123")).role(User.Role.STUDENT)
                    .studentId("MED2022002").department("MBBS - 2nd Year").phone("9876543213").build(),
                User.builder().name("Kiran Reddy").email("kiran@medcollege.edu")
                    .password(passwordEncoder.encode("student123")).role(User.Role.STUDENT)
                    .studentId("MED2023001").department("MBBS - 1st Year").phone("9876543214").build()
            );
            userRepository.saveAll(students);
            log.info("5 students seeded (password: student123)");
        }
    }

    private void seedBooks() {
        if (bookRepository.count() == 0) {
            List<Book> books = List.of(
                Book.builder().title("Gray's Anatomy").author("Henry Gray")
                    .isbn("978-0-7020-5230-9").category("Anatomy")
                    .publisher("Elsevier").year(2020).totalCopies(5).availableCopies(4)
                    .description("The definitive human anatomy reference used by medical students worldwide.").build(),
                Book.builder().title("Guyton and Hall Textbook of Medical Physiology")
                    .author("John E. Hall").isbn("978-0-323-59712-8").category("Physiology")
                    .publisher("Elsevier").year(2021).totalCopies(4).availableCopies(3)
                    .description("Comprehensive physiology textbook covering all organ systems.").build(),
                Book.builder().title("Harper's Illustrated Biochemistry")
                    .author("Victor W. Rodwell").isbn("978-1-260-02701-5").category("Biochemistry")
                    .publisher("McGraw-Hill").year(2019).totalCopies(4).availableCopies(4)
                    .description("Essential biochemistry with clinical correlations for medical students.").build(),
                Book.builder().title("Robbins & Cotran Pathologic Basis of Disease")
                    .author("Vinay Kumar").isbn("978-0-323-53113-9").category("Pathology")
                    .publisher("Elsevier").year(2021).totalCopies(6).availableCopies(5)
                    .description("The gold standard pathology textbook for medical education.").build(),
                Book.builder().title("Katzung's Basic & Clinical Pharmacology")
                    .author("Bertram Katzung").isbn("978-1-260-45231-0").category("Pharmacology")
                    .publisher("McGraw-Hill").year(2021).totalCopies(5).availableCopies(5)
                    .description("Comprehensive pharmacology covering mechanisms and clinical applications.").build(),
                Book.builder().title("Ananthanarayan and Paniker's Textbook of Microbiology")
                    .author("R. Ananthanarayan").isbn("978-81-250-5494-0").category("Microbiology")
                    .publisher("Universities Press").year(2017).totalCopies(4).availableCopies(4)
                    .description("Standard microbiology textbook for Indian medical students.").build(),
                Book.builder().title("Davidson's Principles and Practice of Medicine")
                    .author("Stuart Ralston").isbn("978-0-7020-7028-0").category("Medicine")
                    .publisher("Elsevier").year(2018).totalCopies(5).availableCopies(4)
                    .description("Authoritative textbook on clinical medicine and diagnosis.").build(),
                Book.builder().title("Bailey & Love's Short Practice of Surgery")
                    .author("Norman Williams").isbn("978-1-4987-1796-5").category("Surgery")
                    .publisher("CRC Press").year(2018).totalCopies(4).availableCopies(3)
                    .description("Essential surgical textbook covering operative techniques and management.").build(),
                Book.builder().title("Nelson Textbook of Pediatrics")
                    .author("Robert M. Kliegman").isbn("978-0-323-52950-1").category("Pediatrics")
                    .publisher("Elsevier").year(2020).totalCopies(3).availableCopies(3)
                    .description("The most trusted resource in pediatric medicine.").build(),
                Book.builder().title("Williams Obstetrics")
                    .author("F. Gary Cunningham").isbn("978-1-260-46309-5").category("Obstetrics")
                    .publisher("McGraw-Hill").year(2022).totalCopies(3).availableCopies(2)
                    .description("Comprehensive textbook of obstetrics and maternal-fetal medicine.").build(),
                Book.builder().title("Essentials of Forensic Medicine and Toxicology")
                    .author("K.S. Narayan Reddy").isbn("978-81-312-3617-8").category("Forensic")
                    .publisher("Jaypee Brothers").year(2014).totalCopies(3).availableCopies(3)
                    .description("Standard forensic medicine text for medical examinations in India.").build(),
                Book.builder().title("Park's Textbook of Preventive and Social Medicine")
                    .author("K. Park").isbn("978-93-5152-486-2").category("Community Medicine")
                    .publisher("Banarsidas Bhanot").year(2021).totalCopies(5).availableCopies(5)
                    .description("The definitive community medicine reference for medical students.").build()
            );
            bookRepository.saveAll(books);
            log.info("12 medical books seeded");
        }
    }

    private void seedBorrowRecords() {
        if (borrowRecordRepository.count() != 0) return;

        List<User> students = userRepository.findByRole(User.Role.STUDENT);
        List<Book> books = bookRepository.findAll();

        // ✅ Safety checks (IMPORTANT)
        if (students.size() < 3 || books.size() < 7) {
            log.warn("Not enough data to seed borrow records. Students: {}, Books: {}",
                    students.size(), books.size());
            return;
        }

        User s1 = students.get(0);
        User s2 = students.get(1);
        User s3 = students.get(2);

        Book b1 = books.get(0);
        Book b2 = books.get(3);
        Book b3 = books.get(6);

        BorrowRecord r1 = BorrowRecord.builder()
                .user(s1).book(b1)
                .borrowDate(LocalDate.now().minusDays(5))
                .dueDate(LocalDate.now().plusDays(9))
                .status(BorrowRecord.Status.BORROWED)
                .fineAmount(BigDecimal.ZERO)
                .build();

        BorrowRecord r2 = BorrowRecord.builder()
                .user(s2).book(b2)
                .borrowDate(LocalDate.now().minusDays(20))
                .dueDate(LocalDate.now().minusDays(6))
                .status(BorrowRecord.Status.OVERDUE)
                .fineAmount(BigDecimal.valueOf(30))
                .build();

        BorrowRecord r3 = BorrowRecord.builder()
                .user(s3).book(b3)
                .borrowDate(LocalDate.now().minusDays(18))
                .dueDate(LocalDate.now().minusDays(4))
                .returnDate(LocalDate.now().minusDays(6))
                .status(BorrowRecord.Status.RETURNED)
                .fineAmount(BigDecimal.ZERO)
                .build();

        borrowRecordRepository.saveAll(List.of(r1, r2, r3));

        // ✅ Prevent negative values
        if (b1.getAvailableCopies() > 0) b1.setAvailableCopies(b1.getAvailableCopies() - 1);
        if (b2.getAvailableCopies() > 0) b2.setAvailableCopies(b2.getAvailableCopies() - 1);

        bookRepository.saveAll(List.of(b1, b2));

        notificationRepository.saveAll(List.of(
                Notification.builder()
                        .user(s1)
                        .message("Book \"Gray's Anatomy\" issued to you. Due date: " + r1.getDueDate())
                        .isRead(false)
                        .createdAt(LocalDateTime.now().minusDays(5))
                        .build(),

                Notification.builder()
                        .user(s2)
                        .message("OVERDUE: \"Robbins & Cotran Pathologic Basis of Disease\" is overdue. Fine: ₹30")
                        .isRead(false)
                        .createdAt(LocalDateTime.now().minusHours(2))
                        .build(),

                Notification.builder()
                        .user(s3)
                        .message("Book \"Davidson's Principles and Practice of Medicine\" returned successfully.")
                        .isRead(true)
                        .createdAt(LocalDateTime.now().minusDays(6))
                        .build()
        ));

        log.info("Borrow records and notifications seeded");
    }
}
