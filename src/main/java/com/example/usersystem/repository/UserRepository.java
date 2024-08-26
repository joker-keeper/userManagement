package com.example.usersystem.repository;

import com.example.usersystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUsernameContainingOrEmailContaining(String username, String email);

    // 新增方法：根据用户名和邮箱查找用户
    Optional<User> findByUsernameAndEmail(String username, String email);
}
