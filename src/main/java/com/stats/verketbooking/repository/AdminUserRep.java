package com.stats.verketbooking.repository;

import com.stats.verketbooking.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminUserRep extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByUsername(String username);
}