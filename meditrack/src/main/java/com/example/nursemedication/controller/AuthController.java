package com.example.nursemedication.controller;

import com.example.nursemedication.dto.LoginRequest;
import com.example.nursemedication.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Login
    @PostMapping("/login")
    public Object login(@RequestBody LoginRequest request, HttpSession session) {

        Object user = authService.login(request.getUsername(), request.getPassword(), request.getRole());

        // Store in session based on role
        session.setAttribute("USER", user);

        return user;
    }

    // Logout
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged out successfully";
    }

    // Current user
    @GetMapping("/me")
    public Object currentUser(HttpSession session) {
        Object user = session.getAttribute("USER");
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }
        return user;
    }
}
