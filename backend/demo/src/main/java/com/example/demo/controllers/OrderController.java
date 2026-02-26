package com.example.demo.controllers;

import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Order;
import com.example.demo.services.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<Order> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        return service.create(order);
    }

    @PutMapping("/{id}")
    public Order update(@PathVariable Long id, @RequestBody Order order) {
        return service.update(id, order);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}