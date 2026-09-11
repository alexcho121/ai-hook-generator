package com.samcho.hookgenerator.history;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<History, Long> {

    List<History> findAllByOrderByCreatedAtDesc();
}