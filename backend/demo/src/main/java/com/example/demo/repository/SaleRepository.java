package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}