package ru.isu.taskmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.isu.taskmanager.model.TableArea;
import ru.isu.taskmanager.repository.TableAreaRepository;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tables")
public class TableAreaController {

    @Autowired
    private TableAreaRepository tableAreaRepository;

    @GetMapping
    public List<TableArea> getAllTables(@RequestParam(required = false) String type) {
        if (type != null && !type.isBlank()) {
            return tableAreaRepository.findByServiceType(type.trim());
        }
        return tableAreaRepository.findAll();
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public TableArea createTableArea(@RequestBody TableArea tableArea) {
        return tableAreaRepository.save(tableArea);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<TableArea> updateTableArea(@PathVariable Long id, @RequestBody TableArea updated) {
        return tableAreaRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setCapacity(updated.getCapacity());
                    if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
                    if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl());
                    if (updated.getServiceType() != null) existing.setServiceType(updated.getServiceType());
                    TableArea saved = tableAreaRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
