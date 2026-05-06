package com.example.nursemedication.service;

import com.example.nursemedication.model.Notification;
import com.example.nursemedication.model.Nurse;
import com.example.nursemedication.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Single constructor for Spring DI
    public NotificationService(NotificationRepository notificationRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // Create notification and send real-time WebSocket message
    public Notification createNotification(String message, Nurse nurse) {
        Notification notification = new Notification(message, nurse);
        Notification saved = notificationRepository.save(notification);

        // Send real-time notification to the nurse
        messagingTemplate.convertAndSend("/topic/notifications/" + nurse.getId(), saved);

        return saved;
    }

    // Get all notifications for a nurse
    public List<Notification> getNotificationsForNurse(Nurse nurse) {
        return notificationRepository.findByNurseOrderByCreatedAtDesc(nurse);
    }

    // Mark a notification as read
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // Optional: just send a WebSocket message without saving
    public void sendNotification(String message, Long nurseId) {
        messagingTemplate.convertAndSend("/topic/notifications/" + nurseId, message);
    }
}
