package ru.isu.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.taskmanager.model.BoardGame;

@Repository
public interface BoardGameRepository extends JpaRepository<BoardGame, Long> {
}
