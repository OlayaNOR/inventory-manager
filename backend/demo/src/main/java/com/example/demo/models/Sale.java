package com.example.demo.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Denormalized order id for simple JSON responses
    @Column(name = "order_id", insertable = false, updatable = false)
    private Long orderId;

    private LocalDate date;
    private Double total;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}