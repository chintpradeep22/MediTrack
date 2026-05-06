package com.example.nursemedication.repository;

import com.example.nursemedication.model.Notification;
import com.example.nursemedication.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByNurseOrderByCreatedAtDesc(Nurse nurse);
}
