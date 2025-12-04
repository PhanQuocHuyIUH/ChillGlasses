package iuh.fit.se.backend.service;

import iuh.fit.se.backend.entity.User;
import iuh.fit.se.backend.entity.PasswordResetToken;
import iuh.fit.se.backend.repository.UserRepository;
import iuh.fit.se.backend.repository.PasswordResetTokenRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PasswordService {

    private final UserRepository userRepo;
    private final PasswordResetTokenRepository tokenRepo;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public PasswordService(UserRepository userRepo, PasswordResetTokenRepository tokenRepo,
                           JavaMailSender mailSender, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    public void sendOtp(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        // tạo OTP 6 chữ số
        String otp = String.format("%06d", new Random().nextInt(999999));

        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setToken(otp);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(10)); // 10 phút
        tokenRepo.deleteByEmail(email); // xóa OTP cũ nếu có
        tokenRepo.save(token);

        // gửi email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OTP reset password");
        message.setText("Mã OTP của bạn là: " + otp + ". Hết hạn sau 10 phút.");
        mailSender.send(message);
    }

    public void verifyOtp(String email, String otp) {
        PasswordResetToken token = tokenRepo.findByEmailAndToken(email, otp)
                .orElseThrow(() -> new RuntimeException("OTP không hợp lệ"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP đã hết hạn");
        }

        // xóa OTP sau khi dùng
        tokenRepo.delete(token);
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }
}
