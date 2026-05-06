package com.example.nursemedication.model;

import jakarta.persistence.*;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private int age;

    @Column(nullable = false)
    private String roomNumber;

    // Many patients -> One nurse
    @ManyToOne
    @JoinColumn(name = "nurse_id")
    private Nurse nurse;

    // Many patients -> One floor
    @ManyToOne
    @JoinColumn(name = "floor_id")
    private Floor floor;

    // Constructors
    public Patient() {
    }

    public Patient(String name, int age, String roomNumber, Nurse nurse, Floor floor) {
        this.name = name;
        this.age = age;
        this.roomNumber = roomNumber;
        this.nurse = nurse;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Nurse getNurse() {
        return nurse;
    }

    public void setNurse(Nurse nurse) {
        this.nurse = nurse;
    }

    public Floor getFloor() {
        return floor;
    }

    public void setFloor(Floor floor) {
        this.floor = floor;
    }
}
