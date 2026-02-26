package com.example.demo.services;

import org.springframework.stereotype.Service;

import com.example.demo.models.Order;
import com.example.demo.models.OrderItem;
import com.example.demo.models.Product;
import com.example.demo.models.Sale;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.SaleRepository;

import java.util.List;
import java.time.LocalDate;

@Service
public class SaleService {

    private final SaleRepository repository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public SaleService(SaleRepository repository, OrderRepository orderRepository, ProductRepository productRepository) {
        this.repository = repository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<Sale> getAll() {
        return repository.findAll();
    }

    public Sale create(Sale sale) {
        return repository.save(sale);
    }

    public Sale update(Long id, Sale data) {
        Sale existing = repository.findById(id).orElseThrow();
        existing.setDate(data.getDate());
        existing.setTotal(data.getTotal());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Sale recordSale(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();

        // Avoid duplicate sales for the same order
        boolean alreadySold = repository.findAll().stream()
                .anyMatch(s -> orderId.equals(s.getOrderId()));
        if (alreadySold) {
            throw new IllegalStateException("Sale already recorded for order " + orderId);
        }

        // Decrease product stock based on order items
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                if (product != null && product.getId() != null) {
                    Product managed = productRepository.findById(product.getId()).orElseThrow();
                    Integer currentQty = managed.getQuantityInStock() != null ? managed.getQuantityInStock() : 0;
                    int newQty = currentQty - (item.getQuantity() != null ? item.getQuantity() : 0);
                    if (newQty < 0) {
                        newQty = 0;
                    }
                    managed.setQuantityInStock(newQty);
                    productRepository.save(managed);
                }
            }
            order.setOrderStatus(true);
        }

        Sale sale = new Sale();
        sale.setOrder(order);
        sale.setDate(LocalDate.now());
        sale.setTotal(order.getTotalAmount());

        return repository.save(sale);
    }
}