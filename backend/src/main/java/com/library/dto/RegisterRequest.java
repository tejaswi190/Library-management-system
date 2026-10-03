package com.library.dto;

import com.library.model.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    private User.Role role = User.Role.STUDENT;

    private String studentId;
    private String department;
    private String phone;
}
