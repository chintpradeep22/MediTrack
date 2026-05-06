package com.example.nursemedication.repository;

import com.example.nursemedication.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NurseRepository extends JpaRepository<Nurse, Long> {

    Optional<Nurse> findByEmployeeId(String employeeId);

    List<Nurse> findByFloorId(Long floorId);
}
