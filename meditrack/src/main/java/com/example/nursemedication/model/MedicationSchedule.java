package com.example.nursemedication.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "medication_schedules")
public class MedicationSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private boolean reminder10Sent = false;

    private boolean reminder5Sent = false;

    private boolean reminder1Sent = false;

    // Many schedules -> One medication
    @ManyToOne
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    // Many schedules -> One nurse
    @ManyToOne
    @JoinColumn(name = "nurse_id", nullable = false)
    private Nurse nurse;

    // Many schedules -> One patient
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    public enum Status {
        PENDING,
        GIVEN,
        MISSED
    }

    // Constructors
    public MedicationSchedule() {
    }

    public MedicationSchedule(LocalDateTime scheduledTime,
            Status status,
            Medication medication,
            Nurse nurse,
            Patient patient) {
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.medication = medication;
        this.nurse = nurse;
        this.patient = patient;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Medication getMedication() {
        return medication;
    }

    public void setMedication(Medication medication) {
        this.medication = medication;
    }

    public Nurse getNurse() {
        return nurse;
    }

    public void setNurse(Nurse nurse) {
        this.nurse = nurse;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public boolean isReminder10Sent() {
        return reminder10Sent;
    }

    public void setReminder10Sent(boolean reminder10Sent) {
        this.reminder10Sent = reminder10Sent;
    }

    public boolean isReminder5Sent() {
        return reminder5Sent;
    }

    public void setReminder5Sent(boolean reminder5Sent) {
        this.reminder5Sent = reminder5Sent;
    }

    public boolean isReminder1Sent() {
        return reminder1Sent;
    }

    public void setReminder1Sent(boolean reminder1Sent) {
        this.reminder1Sent = reminder1Sent;
    }

}
