package com.example.nursemedication.controller;

//import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationSocketSender {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationSocketSender(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendNotification(Long nurseId, String message) {
        // Send to a topic unique for each nurse
        messagingTemplate.convertAndSend("/topic/notifications/" + nurseId, message);
    }
}
