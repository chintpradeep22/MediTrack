package com.example.nursemedication.service;

import com.example.nursemedication.model.User;
import com.example.nursemedication.model.Nurse;
import com.example.nursemedication.repository.UserRepository;
import com.example.nursemedication.repository.NurseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final NurseRepository nurseRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, NurseRepository nurseRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.nurseRepository = nurseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Object login(String username, String password, String role) {

        if (role.equalsIgnoreCase("Admin")) {

            User admin = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

            if (!passwordEncoder.matches(password, admin.getPassword())) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid password");
            }
            return admin;

        } else if (role.equalsIgnoreCase("Nurse")) {

            Nurse nurse = nurseRepository.findByEmployeeId(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nurse not found"));

            if (!passwordEncoder.matches(password, nurse.getPassword())) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid password");
            }
            return nurse;

        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid role");
        }
    }

}
