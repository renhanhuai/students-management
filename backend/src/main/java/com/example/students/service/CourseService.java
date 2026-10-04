package com.example.students.service;

import com.example.students.exception.ResourceNotFoundException;
import com.example.students.model.Course;
import com.example.students.model.CourseRequest;
import com.example.students.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CourseService {
    private final CourseRepository courses;

    public CourseService(CourseRepository courses) {
        this.courses = courses;
    }

    public List<Course> list() {
        return courses.findAll();
    }

    public Course get(String id) {
        return courses.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", id));
    }

    @Transactional
    public Course create(CourseRequest request) {
        return courses.save(new Course(request.name(), request.code(), request.description(), request.instructor()));
    }

    @Transactional
    public Course update(String id, CourseRequest request) {
        Course course = get(id);
        course.update(request.name(), request.code(), request.description(), request.instructor());
        return courses.save(course);
    }

    @Transactional
    public void delete(String id) {
        courses.delete(get(id));
    }
}
