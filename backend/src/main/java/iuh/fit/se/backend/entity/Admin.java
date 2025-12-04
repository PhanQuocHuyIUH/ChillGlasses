package iuh.fit.se.backend.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name="user_id")
    private User user;
    // admin-specific fields
}
