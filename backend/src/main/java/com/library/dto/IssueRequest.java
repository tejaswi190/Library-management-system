package com.library.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IssueRequest {
    @NotNull
    private Long userId;

    @NotNull
    private Long bookId;
}
