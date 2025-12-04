package iuh.fit.se.backend.service;

import iuh.fit.se.backend.dto.RegisterRequest;
import iuh.fit.se.backend.entity.Customer;
import iuh.fit.se.backend.entity.User;
import iuh.fit.se.backend.config.JwtTokenProvider;
import iuh.fit.se.backend.repository.CustomerRepository;
import iuh.fit.se.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService{

    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepo,
            CustomerRepository customerRepo,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider
    ) {
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    /**
     * Đăng ký user + customer theo RegisterRequest
     */
    public String register(RegisterRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // 1) Tạo User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setGender(request.getGender());

        user.setDay(request.getDay());
        user.setMonth(request.getMonth());
        user.setYear(request.getYear());
        user.setRecoveryEmail(request.getRecoveryEmail());

        user.setRole("CUSTOMER");

        User savedUser = userRepo.save(user);

        // 2) Tạo Customer
        Customer customer = new Customer();
        customer.setUser(savedUser);
        customer.setCartId(null);

        customerRepo.save(customer);

        return "Register successfully";
    }

    /**
     * Login → trả về JWT
     */
    public String login(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return tokenProvider.generateToken(email, user.getRole());
    }
    public User getCurrentUser(String token) {
        String email = tokenProvider.getEmail(token);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}