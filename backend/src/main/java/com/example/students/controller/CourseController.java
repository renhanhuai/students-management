package com.example.students.controller;

import com.example.students.model.Course;
import com.example.students.model.CourseRequest;
import com.example.students.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final CourseService courses;

    public CourseController(CourseService courses) {
        this.courses = courses;
    }

    @GetMapping
    public List<Course> list() {
        return courses.list();
    }

    @GetMapping("/{id}")
    public Course get(@PathVariable String id) {
        return courses.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Course create(@Valid @RequestBody CourseRequest request) {
        return courses.create(request);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable String id, @Valid @RequestBody CourseRequest request) {
        return courses.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        courses.delete(id);
    }
}
