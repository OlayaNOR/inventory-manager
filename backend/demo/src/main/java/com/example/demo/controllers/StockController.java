package com.example.demo.controllers;

import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Stock;
import com.example.demo.services.StockService;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    @GetMapping
    public List<Stock> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Stock create(@RequestBody Stock stock) {
        return service.create(stock);
    }

    @PutMapping("/{id}")
    public Stock update(@PathVariable Long id, @RequestBody Stock stock) {
        return service.update(id, stock);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}