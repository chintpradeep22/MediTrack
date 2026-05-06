package com.example.nursemedication.repository;

import com.example.nursemedication.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {

    List<Medication> findByPatientId(Long patientId);

    List<Medication> findByPatientFloorId(Long floorId);
}
