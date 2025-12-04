package iuh.fit.se.backend.controller;

import iuh.fit.se.backend.service.PasswordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String email) {
        passwordService.sendOtp(email);
        return "OTP sent";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
        passwordService.verifyOtp(email, otp);
        return "OTP verified";
    }

    @PostMapping("/reset")
    public String resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        passwordService.resetPassword(email, newPassword);
        return "Password reset successfully";
    }
}
