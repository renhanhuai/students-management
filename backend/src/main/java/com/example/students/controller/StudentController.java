package com.example.students.controller;

import com.example.students.model.Course;
import com.example.students.model.Student;
import com.example.students.model.StudentRequest;
import com.example.students.model.StudentResponse;
import com.example.students.repository.CourseRepository;
import com.example.students.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/students")
public class StudentController {
    private final StudentRepository students;
    private final CourseRepository courses;

    public StudentController(StudentRepository students, CourseRepository courses) {
        this.students = students;
        this.courses = courses;
    }

    @GetMapping
    public List<StudentResponse> list() {
        return students.findAll().stream().map(StudentResponse::from).toList();
    }

    @GetMapping("/{id}")
    public StudentResponse get(@PathVariable String id) {
        return StudentResponse.from(findStudent(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse create(@Valid @RequestBody StudentRequest request) {
        return StudentResponse.from(students.save(new Student(request.firstName(), request.lastName(), request.email(),
                request.phone(), resolveCourses(request.courseIds()))));
    }

    @PutMapping("/{id}")
    public StudentResponse update(@PathVariable String id, @Valid @RequestBody StudentRequest request) {
        Student student = findStudent(id);
        student.update(request.firstName(), request.lastName(), request.email(), request.phone(),
                resolveCourses(request.courseIds()));
        return StudentResponse.from(students.save(student));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        students.delete(findStudent(id));
    }

    private Student findStudent(String id) {
        return students.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student", id));
    }

    private Set<Course> resolveCourses(List<String> ids) {
        List<Course> found = courses.findAllById(ids);
        if (found.size() != ids.stream().distinct().count())
            throw new ResourceNotFoundException("One or more courses", String.join(",", ids));
        return found.stream().collect(Collectors.toSet());
    }
}
