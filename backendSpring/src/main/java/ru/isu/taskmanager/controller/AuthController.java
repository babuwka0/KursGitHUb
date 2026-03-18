package ru.isu.taskmanager.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ru.isu.taskmanager.model.JwtResponse;
import ru.isu.taskmanager.model.User;
import ru.isu.taskmanager.payload.request.LoginRequest;
import ru.isu.taskmanager.payload.request.SignupRequest;
import ru.isu.taskmanager.payload.response.MessageResponse;
import ru.isu.taskmanager.repository.UserRepository;
import ru.isu.taskmanager.security.jwt.JwtUtils;
import ru.isu.taskmanager.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  // логин 
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
       User user = userRepository.findByUsername(loginRequest.getUsername());

        //матч паорля 
        if (user == null || !encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Неверно введенный логин или пароль"));
        }
        
        Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getUsername(), 
                                loginRequest.getPassword()
                        )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getRole();

        return ResponseEntity.ok(
                new JwtResponse(
                        jwt,
                        userDetails.getId(),
                        userDetails.getUsername(),
                        role
                )
        );
    }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
         return ResponseEntity.badRequest().body(new MessageResponse("Пользователь с данным логином существует"));
     }

    User user = new User(
        signUpRequest.getUsername(),
        encoder.encode(signUpRequest.getPassword())
    );

    String strRole = signUpRequest.getRole();

    user.setRole(strRole);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("Пользователь успешно зарегистрирован"));
  }
}
