package com.example.nursemedication.model;

import jakarta.persistence.*;

@Entity
@Table(name = "medications")
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String medicineName;

    @Column(nullable = false)
    private String dosage; // Example: 500mg, 1 tablet

    private String instructions; // After food, before sleep, etc.

    // Many medications -> One patient
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Constructors
    public Medication() {
    }

    public Medication(String medicineName, String dosage, String instructions, Patient patient) {
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.instructions = instructions;
        this.patient = patient;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
