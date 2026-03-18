// task 
package ru.isu.taskmanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.isu.taskmanager.payload.response.MessageResponse;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class HomeController {
    @GetMapping("/")
    public String startPage() {
        return "Start page";
    }

    @GetMapping("/admin")
    public ResponseEntity<?> helloAdmin() {
        return ResponseEntity.ok(new MessageResponse("Hello Admin"));
    }
}