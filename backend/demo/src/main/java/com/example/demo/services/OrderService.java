package com.example.demo.services;

import org.springframework.stereotype.Service;

import com.example.demo.models.Order;
import com.example.demo.models.OrderItem;
import com.example.demo.models.Product;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository repository, ProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }

    public List<Order> getAll() {
        return repository.findAll();
    }

    public Order create(Order order) {
        prepareItems(order);
        recalculateTotal(order);
        return repository.save(order);
    }

    public Order update(Long id, Order data) {
        Order existing = repository.findById(id).orElseThrow();
        existing.setCustomer(data.getCustomer());
        existing.getItems().clear();
        if (data.getItems() != null) {
            for (OrderItem item : data.getItems()) {
                item.setOrder(existing);
                populateItemPrice(item);
                existing.getItems().add(item);
            }
        }
        recalculateTotal(existing);
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private void prepareItems(Order order) {
        if (order.getItems() == null) {
            return;
        }
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
            populateItemPrice(item);
        }
    }

    private void populateItemPrice(OrderItem item) {
        if (item.getUnitPrice() != null) {
            return;
        }
        Product product = item.getProduct() != null && item.getProduct().getId() != null
                ? productRepository.findById(item.getProduct().getId()).orElseThrow()
                : null;
        if (product != null) {
            item.setUnitPrice(product.getPrice());
        }
    }

    private void recalculateTotal(Order order) {
        if (order.getItems() == null) {
            order.setTotalAmount(0.0);
            return;
        }
        double total = order.getItems().stream()
                .filter(i -> i.getQuantity() != null && i.getUnitPrice() != null)
                .mapToDouble(i -> i.getQuantity() * i.getUnitPrice())
                .sum();
        order.setTotalAmount(total);
    }
}