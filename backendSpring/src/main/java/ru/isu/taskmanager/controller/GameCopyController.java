package ru.isu.taskmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.isu.taskmanager.model.BoardGame;
import ru.isu.taskmanager.model.GameCopy;
import ru.isu.taskmanager.model.GameCopyRequest;
import ru.isu.taskmanager.repository.BoardGameRepository;
import ru.isu.taskmanager.repository.GameCopyRepository;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/boardgames/{boardGameId}/copies")
public class GameCopyController {

    @Autowired
    private GameCopyRepository gameCopyRepository;

    @Autowired
    private BoardGameRepository boardGameRepository;

    @GetMapping
    public List<GameCopy> getCopiesByBoardGame(@PathVariable Long boardGameId) {
        return gameCopyRepository.findByBoardGameId(boardGameId);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createGameCopy(@PathVariable Long boardGameId, @RequestBody GameCopyRequest request) {
        BoardGame boardGame = boardGameRepository.findById(boardGameId).orElse(null);
        if (boardGame == null) {
            return ResponseEntity.notFound().build();
        }

        GameCopy copy = new GameCopy();
        copy.setBoardGame(boardGame);
        copy.setStatus(request.getStatus() != null ? request.getStatus() : "available");
        copy.setInventoryNumber(request.getInventoryNumber());

        GameCopy saved = gameCopyRepository.save(copy);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{copyId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateGameCopy(@PathVariable Long boardGameId, @PathVariable Long copyId, @RequestBody GameCopyRequest request) {
        GameCopy copy = gameCopyRepository.findById(copyId).orElse(null);
        if (copy == null || !copy.getBoardGame().getId().equals(boardGameId)) {
            return ResponseEntity.notFound().build();
        }
        if (request.getStatus() != null) {
            copy.setStatus(request.getStatus());
        }
        if (request.getInventoryNumber() != null) {
            copy.setInventoryNumber(request.getInventoryNumber());
        }
        GameCopy saved = gameCopyRepository.save(copy);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{copyId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteGameCopy(@PathVariable Long boardGameId, @PathVariable Long copyId) {
        GameCopy copy = gameCopyRepository.findById(copyId).orElse(null);
        if (copy == null || !copy.getBoardGame().getId().equals(boardGameId)) {
            return ResponseEntity.notFound().build();
        }
        gameCopyRepository.delete(copy);
        return ResponseEntity.ok().build();
    }
}
