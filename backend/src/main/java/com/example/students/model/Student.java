package com.example.students.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue
    @UuidGenerator
    private String id;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false)
    private String email;
    private String phone;
    @ManyToMany
    @JoinTable(name = "student_courses", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new LinkedHashSet<>();

    protected Student() {
    }

    public Student(String firstName, String lastName, String email, String phone, Set<Course> courses) {
        update(firstName, lastName, email, phone, courses);
    }

    public String getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Set<Course> getCourses() {
        return courses;
    }

    public void update(String firstName, String lastName, String email, String phone, Set<Course> courses) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.courses.clear();
        this.courses.addAll(courses);
    }
}
