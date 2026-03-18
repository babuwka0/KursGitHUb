package ru.isu.taskmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.isu.taskmanager.model.BoardGame;
import ru.isu.taskmanager.repository.BoardGameRepository;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/boardgames")
public class BoardGameController {

    @Autowired
    private BoardGameRepository boardGameRepository;

    @GetMapping
    public List<BoardGame> getAllBoardGames() {
        return boardGameRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardGame> getBoardGameById(@PathVariable Long id) {
        return boardGameRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public BoardGame createBoardGame(@RequestBody BoardGame boardGame) {
        return boardGameRepository.save(boardGame);
    }

    // админ панель обновление свойств 
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<BoardGame> updateBoardGame(@PathVariable Long id, @RequestBody BoardGame updated) {
        return boardGameRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setDescription(updated.getDescription());
                    existing.setMinPlayers(updated.getMinPlayers());
                    existing.setMaxPlayers(updated.getMaxPlayers());
                    existing.setComplexity(updated.getComplexity());
                    if (updated.getImageUrl() != null) {
                        existing.setImageUrl(updated.getImageUrl());
                    }
                    BoardGame saved = boardGameRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
