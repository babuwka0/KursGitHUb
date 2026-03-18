package ru.isu.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ru.isu.taskmanager.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    //чек на существенование
    User findByUsername(String username);
    
    boolean existsByUsername(String username);

}
