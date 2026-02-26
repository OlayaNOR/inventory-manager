package com.example.demo.services;

import org.springframework.stereotype.Service;

import com.example.demo.exceptions.ProductAlreadyRegisteredException;
import com.example.demo.models.Product;
import com.example.demo.repository.ProductRepository;


import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAll() {
        return repository.findAll();
    }

    public Product getProductById(Long productId) {
        return repository.getReferenceById(productId);
    }

    public Product getProductByName(String name) {
        return repository.findByNameNative(name);
    }

    public Product create(Product product) {

        Product aux = repository.findByNameNative(product.getName());

        if(aux != null && aux.getName().equals(product.getName())){
            throw new ProductAlreadyRegisteredException("Product already registered.");
        }

        return repository.save(product);
    }

    public Product update(Long id, Product data) {
        Product existing = repository.findById(id).orElseThrow();
        existing.setName(data.getName());
        existing.setPrice(data.getPrice());
        existing.setQuantityInStock(data.getQuantityInStock());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}