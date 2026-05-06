package com.example.nursemedication.service;

import com.example.nursemedication.model.Floor;
import com.example.nursemedication.model.Nurse;
import com.example.nursemedication.model.Patient;
import com.example.nursemedication.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NurseService {

    private final NurseRepository nurseRepository;
    private final FloorRepository floorRepository;
    private final PatientRepository patientRepository;

    public NurseService(NurseRepository nurseRepository, FloorRepository floorRepository,
            PatientRepository patientRepository) {
        this.nurseRepository = nurseRepository;
        this.floorRepository = floorRepository;
        this.patientRepository = patientRepository;
    }

    public List<Nurse> getAllNurses() {
        return nurseRepository.findAll();
    }

    public Nurse getNurseById(Long id) {
        return nurseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nurse not found"));
    }

    public Nurse assignFloorToNurse(Long nurseId, Long floorId) {
        Nurse nurse = getNurseById(nurseId);
        Floor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new RuntimeException("Floor not found"));

        nurse.setFloor(floor);
        return nurseRepository.save(nurse);
    }

    // Get nurses by floor
    public List<Nurse> getNursesByFloor(Long floorId) {
        return nurseRepository.findByFloorId(floorId);
    }

    public Nurse updateNurseProfile(Long nurseId, Nurse updatedNurse) {
        Nurse existingNurse = getNurseById(nurseId);

        if (updatedNurse.getName() != null) {
            existingNurse.setName(updatedNurse.getName());
        }
        if (updatedNurse.getPhoneNumber() != null) {
            existingNurse.setPhoneNumber(updatedNurse.getPhoneNumber());
        }
        if (updatedNurse.getPassword() != null) {
            existingNurse.setPassword(updatedNurse.getPassword());
        }

        return nurseRepository.save(existingNurse);
    }

    public Patient getPatientById(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

}
