package ru.isu.taskmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "game_copies")
@Getter
@Setter
public class GameCopy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_game_id", nullable = false)
    @JsonIgnore
    private BoardGame boardGame;

    @Column(nullable = false)
    private String status;

    @Column(name = "inventory_number", unique = true)
    private String inventoryNumber;

    public GameCopy() {}
}
