package com.example.students.service;

import com.example.students.exception.ResourceNotFoundException;
import com.example.students.model.Course;
import com.example.students.model.Student;
import com.example.students.model.StudentRequest;
import com.example.students.model.StudentResponse;
import com.example.students.repository.CourseRepository;
import com.example.students.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StudentService {
    private final StudentRepository students;
    private final CourseRepository courses;

    public StudentService(StudentRepository students, CourseRepository courses) {
        this.students = students;
        this.courses = courses;
    }

    public List<StudentResponse> list() {
        return students.findAll().stream().map(StudentResponse::from).toList();
    }

    public StudentResponse get(String id) {
        return StudentResponse.from(findStudent(id));
    }

    @Transactional
    public StudentResponse create(StudentRequest request) {
        Student student = new Student(request.firstName(), request.lastName(), request.email(), request.phone(),
                resolveCourses(request.courseIds()));
        return StudentResponse.from(students.save(student));
    }

    @Transactional
    public StudentResponse update(String id, StudentRequest request) {
        Student student = findStudent(id);
        student.update(request.firstName(), request.lastName(), request.email(), request.phone(),
                resolveCourses(request.courseIds()));
        return StudentResponse.from(students.save(student));
    }

    @Transactional
    public void delete(String id) {
        students.delete(findStudent(id));
    }

    private Student findStudent(String id) {
        return students.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student", id));
    }

    private Set<Course> resolveCourses(List<String> ids) {
        List<Course> found = courses.findAllById(ids);
        if (found.size() != ids.stream().distinct().count()) {
            throw new ResourceNotFoundException("One or more courses", String.join(",", ids));
        }
        return found.stream().collect(Collectors.toSet());
    }
}
