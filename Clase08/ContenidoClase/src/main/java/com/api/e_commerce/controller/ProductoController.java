package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.model.Producto;
import com.api.e_commerce.repository.ProductoRepository;

@RestController
@RequestMapping("/api/productos") //localhost:8080/api/productos del locahost:8080/api/productos/id
public class ProductoController {
    
    @Autowired
    private ProductoRepository productoRepository;

    //https://localhost:8080/api/productos con metodo get http
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    // https://localhost:8080/api/productos/1 con metodo get http
    @GetMapping("/{id}")
    public Producto getProductoById(@PathVariable Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    //https://localhost:8080/api/productos con metodo post http, enviar un body
    @PostMapping
    public Producto addProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }
}
