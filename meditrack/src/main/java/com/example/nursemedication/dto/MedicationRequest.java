package com.example.nursemedication.dto;

import java.time.LocalDateTime;

public class MedicationRequest {

    private Long medicationId;
    private Long nurseId;
    private Long patientId;
    private LocalDateTime scheduledTime;

    public MedicationRequest() {
    }

    public MedicationRequest(Long medicationId, Long nurseId, Long patientId, LocalDateTime scheduledTime) {
        this.medicationId = medicationId;
        this.nurseId = nurseId;
        this.patientId = patientId;
        this.scheduledTime = scheduledTime;
    }

    // Getters & Setters
    public Long getMedicationId() {
        return medicationId;
    }

    public void setMedicationId(Long medicationId) {
        this.medicationId = medicationId;
    }

    public Long getNurseId() {
        return nurseId;
    }

    public void setNurseId(Long nurseId) {
        this.nurseId = nurseId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }
}
