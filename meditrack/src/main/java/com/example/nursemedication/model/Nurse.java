package com.example.nursemedication.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nurses")
public class Nurse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String employeeId;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    // Many nurses belong to one floor
    @ManyToOne
    @JoinColumn(name = "floor_id", nullable = false)
    private Floor floor;

    // Constructors
    public Nurse() {
    }

    public Nurse(String name,
            String employeeId,
            String phoneNumber,
            String password,
            Floor floor) {
        this.name = name;
        this.employeeId = employeeId;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.floor = floor;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Floor getFloor() {
        return floor;
    }

    public void setFloor(Floor floor) {
        this.floor = floor;
    }
}
