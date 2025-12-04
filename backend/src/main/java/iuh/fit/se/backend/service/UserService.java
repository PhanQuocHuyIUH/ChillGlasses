package iuh.fit.se.backend.service;

import iuh.fit.se.backend.entity.User;
import iuh.fit.se.backend.repository.UserRepository;
import iuh.fit.se.backend.config.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    /**
     * Cập nhật thông tin profile của user, có thể kèm avatar
     */
    public User updateProfile(String token, User updatedUser, MultipartFile avatarFile) throws IOException {
        String email = tokenProvider.getEmail(token);

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        user.setGender(updatedUser.getGender());
        user.setDay(updatedUser.getDay());
        user.setMonth(updatedUser.getMonth());
        user.setYear(updatedUser.getYear());
        user.setRecoveryEmail(updatedUser.getRecoveryEmail());

        if (avatarFile != null && !avatarFile.isEmpty()) {
            String uploadDir = "uploads/avatars/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String originalFilename = avatarFile.getOriginalFilename();
            String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = "avatar_" + user.getUserId() + ext;
            Path filepath = Paths.get(uploadDir, filename);
            Files.write(filepath, avatarFile.getBytes());

            user.setAvatar("/" + uploadDir + filename);
        }

        return userRepo.save(user);
    }

    /**
     * Đổi mật khẩu user
     */
    public String changePassword(String token, String oldPassword, String newPassword) {
        String email = tokenProvider.getEmail(token);

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        return "Password changed successfully";
    }

    /**
     * Lấy thông tin hiện tại của user từ token
     */
    public User getCurrentUser(String token) {
        String email = tokenProvider.getEmail(token);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
