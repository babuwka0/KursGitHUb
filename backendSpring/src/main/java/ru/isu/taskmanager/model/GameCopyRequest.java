package ru.isu.taskmanager.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameCopyRequest {
    private String status = "available";
    private String inventoryNumber;
}
