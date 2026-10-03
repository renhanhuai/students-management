package com.example.students.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record StudentRequest(@NotBlank String firstName, @NotBlank String lastName,
        @NotBlank @Email String email, String phone,
        @NotNull List<String> courseIds) {
}
