package com.example.students.model;

import jakarta.validation.constraints.NotBlank;

public record CourseRequest(@NotBlank String name, @NotBlank String code,
        @NotBlank String description, @NotBlank String instructor) {
}
