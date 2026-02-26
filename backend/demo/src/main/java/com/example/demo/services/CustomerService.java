package com.example.demo.services;

import org.springframework.stereotype.Service;

import com.example.demo.models.Customer;
import com.example.demo.repository.CustomerRepository;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<Customer> getAll() {
        return repository.findAll();
    }

    public Customer create(Customer customer) {
        return repository.save(customer);
    }

    public Customer update(Long id, Customer data) {
        Customer existing = repository.findById(id).orElseThrow();
        existing.setName(data.getName());
        existing.setEmail(data.getEmail());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
