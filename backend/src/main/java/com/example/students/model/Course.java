package com.example.students.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue
    @UuidGenerator
    private String id;
    @NotBlank
    @Column(nullable = false)
    private String name;
    @NotBlank
    @Column(nullable = false, unique = true)
    private String code;
    @NotBlank
    @Column(nullable = false, length = 4000)
    private String description;
    @NotBlank
    @Column(nullable = false)
    private String instructor;

    protected Course() {
    }

    public Course(String name, String code, String description, String instructor) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.instructor = instructor;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public String getInstructor() {
        return instructor;
    }

    public void update(String name, String code, String description, String instructor) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.instructor = instructor;
    }
}
