package com.library.service;

import com.library.dto.BookRequest;
import com.library.model.Book;
import com.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> searchBooks(String title, String author, String category) {
        return bookRepository.search(title, author, category);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    public Book addBook(BookRequest request) {
        Book book = request.toBook();
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, BookRequest request) {
        Book existing = getBook(id);
        int diff = request.getTotalCopies() - existing.getTotalCopies();
        existing.setTitle(request.getTitle());
        existing.setAuthor(request.getAuthor());
        existing.setIsbn(request.getIsbn());
        existing.setCategory(request.getCategory());
        existing.setPublisher(request.getPublisher());
        existing.setYear(request.getYear());
        existing.setTotalCopies(request.getTotalCopies());
        existing.setAvailableCopies(Math.max(0, existing.getAvailableCopies() + diff));
        existing.setDescription(request.getDescription());
        return bookRepository.save(existing);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
