package com.example.students.model;

import java.util.List;

public record StudentResponse(String id, String firstName, String lastName, String email,
        String phone, List<String> courseIds) {
    public static StudentResponse from(Student student) {
        return new StudentResponse(student.getId(), student.getFirstName(), student.getLastName(),
                student.getEmail(), student.getPhone(), student.getCourses().stream().map(c -> c.getId()).toList());
    }
}
