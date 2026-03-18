package ru.isu.taskmanager.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Collection;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

@Entity
@Table(name = "user",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username")
       })
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @NotBlank
  @Size(max = 20)
  private String username;


  @NotBlank
  @Size(max = 120)
  @JsonIgnore
  private String password;
  
  @Column(name = "role")
  private String role;


  public User() {
  }

  public User(String username, String password) {
    this.username = username;
    this.password = password;
  }
  
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return AuthorityUtils.createAuthorityList(this.role.toString());
    }

}
