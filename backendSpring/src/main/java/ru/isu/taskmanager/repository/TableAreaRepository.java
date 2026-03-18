package ru.isu.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.taskmanager.model.TableArea;

import java.util.List;

@Repository
public interface TableAreaRepository extends JpaRepository<TableArea, Long> {
    List<TableArea> findByServiceType(String serviceType);
}
