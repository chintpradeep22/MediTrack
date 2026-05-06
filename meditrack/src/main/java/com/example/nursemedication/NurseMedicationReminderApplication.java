package com.example.nursemedication;

import com.example.nursemedication.model.*;
import com.example.nursemedication.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
@EnableScheduling
public class NurseMedicationReminderApplication {

	public static void main(String[] args) {
		SpringApplication.run(NurseMedicationReminderApplication.class, args);
	}

	@Bean
	CommandLineRunner loadData(
			FloorRepository floorRepo,
			NurseRepository nurseRepo,
			PatientRepository patientRepo,
			MedicationRepository medicationRepo,
			MedicationScheduleRepository scheduleRepo,
			UserRepository userRepo,
			NotificationRepository notificationRepo,
			BCryptPasswordEncoder passwordEncoder) {
		return args -> {
			if (floorRepo.count() > 0) {
				System.out.println("ℹData already exists, skipping sample load");
				return;
			}
			// Floors
			Floor icu = new Floor("ICU", 1);
			Floor floor1 = new Floor("General Ward", 2);

			floorRepo.saveAll(List.of(icu, floor1));

			// Nurses
			Nurse nurse1 = new Nurse(
					"Anita",
					"EMP001",
					"9876543210",
					passwordEncoder.encode("anita@123"), // 🔐 HASHED
					icu);

			Nurse nurse2 = new Nurse(
					"Ravi",
					"EMP002",
					"9123456780",
					passwordEncoder.encode("anita@123"), // 🔐 HASHED
					floor1);

			nurseRepo.saveAll(List.of(nurse1, nurse2));

			// Patients
			Patient patient1 = new Patient("Suresh", 45, "ICU-101", nurse1, icu);
			Patient patient2 = new Patient("Meena", 60, "GW-202", nurse2, floor1);

			patientRepo.saveAll(List.of(patient1, patient2));

			// Medications
			Medication med1 = new Medication(
					"Paracetamol",
					"500mg",
					"After food",
					patient1);

			Medication med2 = new Medication(
					"Insulin",
					"10 units",
					"Before breakfast",
					patient2);

			medicationRepo.saveAll(List.of(med1, med2));

			// Medication Schedules
			MedicationSchedule s1 = new MedicationSchedule(
					LocalDateTime.now().plusMinutes(10),
					MedicationSchedule.Status.PENDING,
					med1,
					nurse1,
					patient1);

			MedicationSchedule s2 = new MedicationSchedule(
					LocalDateTime.now().plusMinutes(5),
					MedicationSchedule.Status.PENDING,
					med2,
					nurse2,
					patient2);

			MedicationSchedule s3 = new MedicationSchedule(
					LocalDateTime.now().minusMinutes(1),
					MedicationSchedule.Status.GIVEN,
					med1,
					nurse1,
					patient1);

			scheduleRepo.saveAll(List.of(s1, s2, s3));

			User admin1 = new User();
			admin1.setUsername("alice.admin");
			admin1.setPassword(passwordEncoder.encode("admin123")); // 🔐 HASHED
			admin1.setRole("ADMIN");
			userRepo.save(admin1);

			System.out.println("✅ Sample hospital data loaded successfully");

			// Notifications
			Notification n1 = new Notification("Medication Paracetamol is due for patient Suresh", nurse1);

			Notification n2 = new Notification("Medication Insulin scheduled in 5 minutes for patient Meena", nurse2);

			Notification n3 = new Notification("Medication Paracetamol has already been given", nurse1);

			notificationRepo.saveAll(List.of(n1, n2, n3));
		};

	}
}
