package com.example.nursemedication.service;

import com.example.nursemedication.model.Medication;
import com.example.nursemedication.model.Patient;
import com.example.nursemedication.repository.MedicationRepository;
import com.example.nursemedication.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final PatientRepository patientRepository;

    public MedicationService(MedicationRepository medicationRepository,
            PatientRepository patientRepository) {
        this.medicationRepository = medicationRepository;
        this.patientRepository = patientRepository;
    }

    // Add medication for a patient
    public Medication addMedication(Long patientId, Medication medication) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        medication.setPatient(patient);
        return medicationRepository.save(medication);
    }

    // Get all medications
    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    // Get medications for a specific patient
    public List<Medication> getMedicationsByPatient(Long patientId) {
        return medicationRepository.findByPatientId(patientId);
    }

    // Get medications for all patients in a specific floor
    public List<Medication> getMedicationsByFloor(Long floorId) {
        return medicationRepository.findByPatientFloorId(floorId);
    }

}
