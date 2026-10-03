package com.library.dto;

import com.library.model.Book;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BookRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private String isbn;
    private String category;
    private String publisher;
    private Integer year;

    @NotNull
    @Min(1)
    private Integer totalCopies;

    private String description;

    public Book toBook() {
        return Book.builder()
                .title(title)
                .author(author)
                .isbn(isbn)
                .category(category)
                .publisher(publisher)
                .year(year)
                .totalCopies(totalCopies)
                .availableCopies(totalCopies)
                .description(description)
                .build();
    }
}
