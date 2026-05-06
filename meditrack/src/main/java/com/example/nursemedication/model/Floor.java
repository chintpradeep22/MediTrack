package com.example.nursemedication.model;

import jakarta.persistence.*;

@Entity
@Table(name = "floors")
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String floorName; // Example: ICU, Floor-1, Floor-2

    private int floorNumber;

    // Constructors
    public Floor() {
    }

    public Floor(String floorName, int floorNumber) {
        this.floorName = floorName;
        this.floorNumber = floorNumber;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getFloorName() {
        return floorName;
    }

    public void setFloorName(String floorName) {
        this.floorName = floorName;
    }

    public int getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(int floorNumber) {
        this.floorNumber = floorNumber;
    }
}
