package ru.isu.taskmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
//ошибка не даёт загрузить брони 
@Entity
@Table(name = "table_areas")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
public class TableArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "service_type")
    private String serviceType;

    public TableArea() {}
}
