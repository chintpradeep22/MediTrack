package com.example.nursemedication.repository;

import com.example.nursemedication.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findByFloorId(Long floorId);

    List<Patient> findByNurseId(Long employeeId);

}
