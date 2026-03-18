package ru.isu.taskmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ru.isu.taskmanager.model.*;
import ru.isu.taskmanager.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TableAreaRepository tableAreaRepository;

    @Autowired
    private GameCopyRepository gameCopyRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Booking> getUserBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username);
        
        if (user != null) {
            return bookingRepository.findByUserId(user.getId());
        }
        return List.of();
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Optional<TableArea> tableOpt = tableAreaRepository.findById(request.getTableId());
        if (!tableOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Table not found");
        }

        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTableArea(tableOpt.get());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setStatus("PENDING");

        if (request.getGameCopyIds() != null && !request.getGameCopyIds().isEmpty()) {
            List<GameCopy> copies = gameCopyRepository.findAllById(request.getGameCopyIds());
            booking.setGameCopies(new HashSet<>(copies));
        }

        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Booking> getAllBookings(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDateTime fromDateTime = from != null ? from.atStartOfDay() : LocalDate.now().atStartOfDay();
        LocalDateTime toDateTime = to != null ? to.plusDays(1).atStartOfDay() : LocalDate.now().plusDays(7).atStartOfDay();
        return bookingRepository.findByStartTimeBetweenOrderByStartTimeAsc(fromDateTime, toDateTime);
    }
}
