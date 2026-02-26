package com.example.demo.controllers;

import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Sale;
import com.example.demo.services.SaleService;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @GetMapping
    public List<Sale> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Sale create(@RequestBody Sale sale) {
        return service.create(sale);
    }

    @PostMapping("/record/{orderId}")
    public Sale record(@PathVariable Long orderId) {
        return service.recordSale(orderId);
    }

    @PutMapping("/{id}")
    public Sale update(@PathVariable Long id, @RequestBody Sale sale) {
        return service.update(id, sale);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}