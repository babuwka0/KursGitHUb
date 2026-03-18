package ru.isu.taskmanager.model;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class BookingRequest {
    private Long tableId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<Long> gameCopyIds;
}
