package com.example.nursemedication.repository;

import com.example.nursemedication.model.MedicationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MedicationScheduleRepository
        extends JpaRepository<MedicationSchedule, Long> {

    List<MedicationSchedule> findByStatus(MedicationSchedule.Status status);

    List<MedicationSchedule> findByScheduledTimeBefore(LocalDateTime time);

    List<MedicationSchedule> findByMedicationId(Long medicationId);
}
