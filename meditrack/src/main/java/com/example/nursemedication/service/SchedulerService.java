package com.example.nursemedication.service;

import com.example.nursemedication.model.Medication;
import com.example.nursemedication.model.MedicationSchedule;
import com.example.nursemedication.model.Nurse;
import com.example.nursemedication.model.Patient;
import com.example.nursemedication.repository.MedicationRepository;
import com.example.nursemedication.repository.MedicationScheduleRepository;
import com.example.nursemedication.repository.NurseRepository;
import com.example.nursemedication.repository.PatientRepository;
import com.example.nursemedication.dto.MedicationScheduleDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchedulerService {

    private final MedicationScheduleRepository scheduleRepository;
    private final MedicationRepository medicationRepository;
    private final NurseRepository nurseRepository;
    private final PatientRepository patientRepository;
    private final NotificationService notificationService;

    public SchedulerService(MedicationScheduleRepository scheduleRepository,
            MedicationRepository medicationRepository,
            NurseRepository nurseRepository,
            PatientRepository patientRepository, NotificationService notificationService) {
        this.scheduleRepository = scheduleRepository;
        this.medicationRepository = medicationRepository;
        this.nurseRepository = nurseRepository;
        this.patientRepository = patientRepository;
        this.notificationService = notificationService;
    }

    // Create new schedule
    public MedicationSchedule createScheduleFromDto(MedicationScheduleDTO dto) {
        Medication medication = medicationRepository.findById(dto.getMedicationId())
                .orElseThrow(() -> new RuntimeException("Medication not found"));

        Nurse nurse = nurseRepository.findById(dto.getNurseId())
                .orElseThrow(() -> new RuntimeException("Nurse not found"));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        MedicationSchedule schedule = new MedicationSchedule(
                dto.getScheduledTime(),
                MedicationSchedule.Status.valueOf(dto.getStatus()),
                medication,
                nurse,
                patient);

        MedicationSchedule savedSchedule = scheduleRepository.save(schedule);

        // Send notification to nurse
        String message = "New medication scheduled: " + medication.getMedicineName() +
                " for patient: " + patient.getName() +
                " at " + dto.getScheduledTime();
        notificationService.createNotification(message, nurse);

        return savedSchedule;
    }

    // Get all schedules
    public List<MedicationSchedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // Update schedule
    public MedicationSchedule updateScheduleFromDto(Long scheduleId, MedicationScheduleDTO dto) {
        MedicationSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (dto.getScheduledTime() != null) {
            schedule.setScheduledTime(dto.getScheduledTime());
        }

        if (dto.getStatus() != null) {
            schedule.setStatus(MedicationSchedule.Status.valueOf(dto.getStatus()));
        }

        if (dto.getMedicationId() != null) {
            Medication medication = medicationRepository.findById(dto.getMedicationId())
                    .orElseThrow(() -> new RuntimeException("Medication not found"));
            schedule.setMedication(medication);
        }

        if (dto.getNurseId() != null) {
            Nurse nurse = nurseRepository.findById(dto.getNurseId())
                    .orElseThrow(() -> new RuntimeException("Nurse not found"));
            schedule.setNurse(nurse);
        }

        if (dto.getPatientId() != null) {
            Patient patient = patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            schedule.setPatient(patient);
        }

        MedicationSchedule updatedSchedule = scheduleRepository.save(schedule);

        // Send notification to nurse
        String message = "Medication schedule updated: " + schedule.getMedication().getMedicineName() +
                " for patient: " + schedule.getPatient().getName() +
                " at " + schedule.getScheduledTime();
        notificationService.createNotification(message, schedule.getNurse());

        return updatedSchedule;
    }

    // Delete schedule
    public void deleteSchedule(Long scheduleId) {
        MedicationSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        scheduleRepository.delete(schedule);
    }

    public MedicationSchedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    public MedicationSchedule saveSchedule(MedicationSchedule schedule) {
        return scheduleRepository.save(schedule);
    }

}
