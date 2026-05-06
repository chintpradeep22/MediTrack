package com.example.nursemedication.service;

import com.example.nursemedication.model.Floor;
import com.example.nursemedication.model.Patient;
import com.example.nursemedication.repository.FloorRepository;
import com.example.nursemedication.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final FloorRepository floorRepository;

    public PatientService(PatientRepository patientRepository, FloorRepository floorRepository) {
        this.patientRepository = patientRepository;
        this.floorRepository = floorRepository;
    }

    // Get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Get patient by ID
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    // Assign patient to floor
    public Patient assignPatientToFloor(Long patientId, Long floorId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Floor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new RuntimeException("Floor not found"));

        patient.setFloor(floor);
        return patientRepository.save(patient);
    }

    // Get patients by floor
    public List<Patient> getPatientsByFloor(Long floorId) {
        return patientRepository.findByFloorId(floorId);
    }
}
