package com.example.students.controller;

import com.example.students.model.Course;
import com.example.students.model.CourseRequest;
import com.example.students.repository.CourseRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final CourseRepository courses;

    public CourseController(CourseRepository courses) {
        this.courses = courses;
    }

    @GetMapping
    public List<Course> list() {
        return courses.findAll();
    }

    @GetMapping("/{id}")
    public Course get(@PathVariable String id) {
        return courses.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course", id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Course create(@Valid @RequestBody CourseRequest request) {
        return courses.save(new Course(request.name(), request.code(), request.description(), request.instructor()));
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable String id, @Valid @RequestBody CourseRequest request) {
        Course course = courses.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course", id));
        course.update(request.name(), request.code(), request.description(), request.instructor());
        return courses.save(course);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        courses.delete(courses.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course", id)));
    }
}
