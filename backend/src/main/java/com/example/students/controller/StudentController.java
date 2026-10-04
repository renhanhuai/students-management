package com.example.students.controller;

import com.example.students.model.StudentRequest;
import com.example.students.model.StudentResponse;
import com.example.students.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {
    private final StudentService students;

    public StudentController(StudentService students) {
        this.students = students;
    }

    @GetMapping
    public List<StudentResponse> list() {
        return students.list();
    }

    @GetMapping("/{id}")
    public StudentResponse get(@PathVariable String id) {
        return students.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse create(@Valid @RequestBody StudentRequest request) {
        return students.create(request);
    }

    @PutMapping("/{id}")
    public StudentResponse update(@PathVariable String id, @Valid @RequestBody StudentRequest request) {
        return students.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        students.delete(id);
    }
}
