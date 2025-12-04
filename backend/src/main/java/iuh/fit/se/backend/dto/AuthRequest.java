package iuh.fit.se.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    @NotBlank
    @Email
    private String email;
    @NotBlank private String password;
}

