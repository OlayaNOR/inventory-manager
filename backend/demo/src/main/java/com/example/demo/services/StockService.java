package com.example.demo.services;

import org.springframework.stereotype.Service;

import com.example.demo.models.Stock;
import com.example.demo.repository.StockRepository;

import java.util.List;

@Service
public class StockService {

    private final StockRepository repository;

    public StockService(StockRepository repository) {
        this.repository = repository;
    }

    public List<Stock> getAll() {
        return repository.findAll();
    }

    public Stock create(Stock stock) {
        return repository.save(stock);
    }

    public Stock update(Long id, Stock data) {
        Stock existing = repository.findById(id).orElseThrow();
        existing.setName(data.getName());
        existing.setQuantityInStock(data.getQuantityInStock());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}