package com.example.demo.exceptions;

public class ProductAlreadyRegisteredException extends RuntimeException {
    public ProductAlreadyRegisteredException(String message){
        super(message);
    }
}
