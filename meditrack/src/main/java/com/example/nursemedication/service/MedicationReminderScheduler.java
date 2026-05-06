package com.example.nursemedication.service;

import com.example.nursemedication.model.MedicationSchedule;
import com.example.nursemedication.model.MedicationSchedule.Status;
import com.example.nursemedication.repository.MedicationScheduleRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MedicationReminderScheduler {

    private final MedicationScheduleRepository scheduleRepository;
    private final NotificationService notificationService;

    public MedicationReminderScheduler(
            MedicationScheduleRepository scheduleRepository,
            NotificationService notificationService) {
        this.scheduleRepository = scheduleRepository;
        this.notificationService = notificationService;
    }

    // Runs every 1 minute
    @Scheduled(fixedRate = 60000)
    public void sendReminders() {

        LocalDateTime now = LocalDateTime.now();

        List<MedicationSchedule> pendingSchedules = scheduleRepository.findByStatus(MedicationSchedule.Status.PENDING);

        for (MedicationSchedule schedule : pendingSchedules) {

            long minutesLeft = Duration.between(now, schedule.getScheduledTime()).toMinutes();

            if (minutesLeft < 0 && schedule.getStatus() == Status.PENDING) {
                schedule.setStatus(Status.MISSED);
                scheduleRepository.save(schedule);
            }

            // 10-minute reminder
            if (minutesLeft == 10 && !schedule.isReminder10Sent()) {
                send(schedule, 10);
                schedule.setReminder10Sent(true);
            }

            // 5-minute reminder
            else if (minutesLeft == 5 && !schedule.isReminder5Sent()) {
                send(schedule, 5);
                schedule.setReminder5Sent(true);
            }

            // 1-minute reminder
            else if (minutesLeft == 1 && !schedule.isReminder1Sent()) {
                send(schedule, 1);
                schedule.setReminder1Sent(true);
            }

            scheduleRepository.save(schedule);
        }
    }

    private void send(MedicationSchedule schedule, int minutes) {
        String message = "Reminder: Medication '"
                + schedule.getMedication().getMedicineName()
                + "' for patient "
                + schedule.getPatient().getName()
                + " in " + minutes + " minute(s).";

        notificationService.createNotification(
                message,
                schedule.getNurse());
    }
}
