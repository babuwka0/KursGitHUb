package ru.isu.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.taskmanager.model.GameCopy;

import java.util.List;

@Repository
public interface GameCopyRepository extends JpaRepository<GameCopy, Long> {
    List<GameCopy> findByBoardGameId(Long boardGameId);
}
