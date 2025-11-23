package com.api.e_commerce.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.api.e_commerce.model.Categoria;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Role;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.CategoriaRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;

/**
 * Inicializa la base de datos con datos de prueba
 * Se ejecuta automáticamente al iniciar la aplicación
 */
@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(
            UsuarioRepository usuarioRepository,
            CategoriaRepository categoriaRepository,
            ProductoRepository productoRepository,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            try {
                // Solo inicializar si la base de datos está vacía
                if (usuarioRepository.count() > 0) {
                    logger.info("La base de datos ya contiene datos. Saltando inicialización.");
                    return;
                }

                logger.info("Iniciando carga de datos de prueba...");

            // ========================================
            // CREAR USUARIOS
            // ========================================
            Usuario usuario1 = new Usuario();
            usuario1.setNombre("Juan");
            usuario1.setApellido("Pérez");
            usuario1.setNombreUsuario("juanperez");
            usuario1.setEmail("juan@market.com");
            usuario1.setPassword(passwordEncoder.encode("123456"));
            usuario1.setTelefono("+54 11 1234-5678");
            usuario1.setDireccion("Av. Corrientes 1234, CABA");
            usuario1.setFechaRegistro(LocalDateTime.now().minusDays(30));
            usuario1.setRole(Role.USER);
            usuario1.setActivo(true);

            Usuario usuario2 = new Usuario();
            usuario2.setNombre("María");
            usuario2.setApellido("González");
            usuario2.setNombreUsuario("mariagonzalez");
            usuario2.setEmail("maria@market.com");
            usuario2.setPassword(passwordEncoder.encode("123456"));
            usuario2.setTelefono("+54 11 9876-5432");
            usuario2.setDireccion("Av. Santa Fe 5678, CABA");
            usuario2.setFechaRegistro(LocalDateTime.now().minusDays(35));
            usuario2.setRole(Role.USER);
            usuario2.setActivo(true);

            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("Sistema");
            admin.setNombreUsuario("admin");
            admin.setEmail("admin@market.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setTelefono("+54 11 0000-0000");
            admin.setDireccion("Oficina Central");
            admin.setFechaRegistro(LocalDateTime.now().minusDays(365));
            admin.setRole(Role.ADMIN);
            admin.setActivo(true);

            usuarioRepository.saveAll(Arrays.asList(usuario1, usuario2, admin));
            logger.info("✓ Usuarios creados: 3");

            // ========================================
            // CREAR CATEGORÍAS
            // ========================================
            Categoria tecnologia = new Categoria();
            tecnologia.setNombre("Tecnología");
            tecnologia.setDescripcion("Smartphones, laptops, tablets y más");
            tecnologia.setImagenUrl("https://cdn.jsdelivr.net/npm/@tabler/icons@2.40.0/icons/device-laptop.svg");
            tecnologia.setActiva(true);

            Categoria deportes = new Categoria();
            deportes.setNombre("Deportes");
            deportes.setDescripcion("Equipamiento deportivo y fitness");
            deportes.setImagenUrl("https://cdn.jsdelivr.net/npm/@tabler/icons@2.40.0/icons/ball-football.svg");
            deportes.setActiva(true);

            Categoria hogar = new Categoria();
            hogar.setNombre("Hogar");
            hogar.setDescripcion("Electrodomésticos y decoración");
            hogar.setImagenUrl("https://cdn.jsdelivr.net/npm/@tabler/icons@2.40.0/icons/home.svg");
            hogar.setActiva(true);

            Categoria moda = new Categoria();
            moda.setNombre("Moda");
            moda.setDescripcion("Ropa, calzado y accesorios");
            moda.setImagenUrl("https://cdn.jsdelivr.net/npm/@tabler/icons@2.40.0/icons/shirt.svg");
            moda.setActiva(true);

            Categoria libros = new Categoria();
            libros.setNombre("Libros");
            libros.setDescripcion("Literatura, educación y entretenimiento");
            libros.setImagenUrl("https://cdn.jsdelivr.net/npm/@tabler/icons@2.40.0/icons/book.svg");
            libros.setActiva(true);

            categoriaRepository.saveAll(Arrays.asList(tecnologia, deportes, hogar, moda, libros));
            logger.info("✓ Categorías creadas: 5");

            // ========================================
            // CREAR PRODUCTOS
            // ========================================
            List<Producto> productos = new ArrayList<>();

            // Producto 1: iPhone 15 Pro Max
            Producto producto1 = new Producto();
            producto1.setNombre("iPhone 15 Pro Max");
            producto1.setDescripcion("El iPhone más avanzado con chip A17 Pro, cámara de 48MP y pantalla Dynamic Island de 6.7 pulgadas");
            producto1.setPrecio(BigDecimal.valueOf(1299999.0));
            producto1.setPrecioOriginal(BigDecimal.valueOf(1499999.0));
            producto1.setDescuento(13);
            producto1.setImagenUrl("https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop");
            producto1.setStock(14);
            producto1.setMarca("Apple");
            producto1.setRating(4.8);
            producto1.setReviews(1250);
            producto1.setEnvioGratis(true);
            producto1.setVendido(2456);
            producto1.setFechaCreacion(LocalDateTime.now().minusDays(15));
            producto1.setActivo(true);
            producto1.setUsuario(usuario1);
            producto1.setCategorias(Arrays.asList(tecnologia));
            productos.add(producto1);

            // Producto 2: MacBook Air M3
            Producto producto2 = new Producto();
            producto2.setNombre("MacBook Air M3 13 pulgadas");
            producto2.setDescripcion("Laptop ultraliviana con chip M3, hasta 18 horas de batería y diseño elegante en colores vibrantes");
            producto2.setPrecio(BigDecimal.valueOf(1599999.0));
            producto2.setPrecioOriginal(null);
            producto2.setDescuento(0);
            producto2.setImagenUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop");
            producto2.setStock(8);
            producto2.setMarca("Apple");
            producto2.setRating(4.9);
            producto2.setReviews(890);
            producto2.setEnvioGratis(true);
            producto2.setVendido(1234);
            producto2.setFechaCreacion(LocalDateTime.now().minusDays(20));
            producto2.setActivo(true);
            producto2.setUsuario(usuario1);
            producto2.setCategorias(Arrays.asList(tecnologia));
            productos.add(producto2);

            // Producto 3: Samsung Galaxy S24 Ultra
            Producto producto3 = new Producto();
            producto3.setNombre("Samsung Galaxy S24 Ultra");
            producto3.setDescripcion("Smartphone premium con S Pen integrado, cámara de 200MP y pantalla AMOLED de 6.8 pulgadas");
            producto3.setPrecio(BigDecimal.valueOf(1199999.0));
            producto3.setPrecioOriginal(BigDecimal.valueOf(1399999.0));
            producto3.setDescuento(14);
            producto3.setImagenUrl("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop");
            producto3.setStock(20);
            producto3.setMarca("Samsung");
            producto3.setRating(4.7);
            producto3.setReviews(956);
            producto3.setEnvioGratis(true);
            producto3.setVendido(1876);
            producto3.setFechaCreacion(LocalDateTime.now().minusDays(10));
            producto3.setActivo(true);
            producto3.setUsuario(usuario2);
            producto3.setCategorias(Arrays.asList(tecnologia));
            productos.add(producto3);

            // Producto 4: AirPods Pro (2da gen)
            Producto producto4 = new Producto();
            producto4.setNombre("AirPods Pro (2da generación)");
            producto4.setDescripcion("Auriculares inalámbricos con cancelación activa de ruido, audio espacial y estuche MagSafe");
            producto4.setPrecio(BigDecimal.valueOf(329999.0));
            producto4.setPrecioOriginal(BigDecimal.valueOf(399999.0));
            producto4.setDescuento(18);
            producto4.setImagenUrl("https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&h=500&fit=crop");
            producto4.setStock(45);
            producto4.setMarca("Apple");
            producto4.setRating(4.6);
            producto4.setReviews(2340);
            producto4.setEnvioGratis(true);
            producto4.setVendido(5678);
            producto4.setFechaCreacion(LocalDateTime.now().minusDays(25));
            producto4.setActivo(true);
            producto4.setUsuario(usuario1);
            producto4.setCategorias(Arrays.asList(tecnologia));
            productos.add(producto4);

            // Producto 5: Bicicleta Mountain Bike
            Producto producto5 = new Producto();
            producto5.setNombre("Bicicleta Mountain Bike 29 Pulgadas");
            producto5.setDescripcion("Bicicleta todoterreno con 21 cambios Shimano, suspensión delantera y frenos de disco");
            producto5.setPrecio(BigDecimal.valueOf(349999.0));
            producto5.setPrecioOriginal(null);
            producto5.setDescuento(0);
            producto5.setImagenUrl("https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&h=500&fit=crop");
            producto5.setStock(12);
            producto5.setMarca("Venzo");
            producto5.setRating(4.4);
            producto5.setReviews(456);
            producto5.setEnvioGratis(false);
            producto5.setVendido(234);
            producto5.setFechaCreacion(LocalDateTime.now().minusDays(18));
            producto5.setActivo(true);
            producto5.setUsuario(usuario2);
            producto5.setCategorias(Arrays.asList(deportes));
            productos.add(producto5);

            // Producto 6: Zapatillas Running
            Producto producto6 = new Producto();
            producto6.setNombre("Zapatillas Nike Air Zoom Pegasus 40");
            producto6.setDescripcion("Zapatillas para running con tecnología Zoom Air y suela de goma para máxima tracción");
            producto6.setPrecio(BigDecimal.valueOf(129999.0));
            producto6.setPrecioOriginal(BigDecimal.valueOf(159999.0));
            producto6.setDescuento(19);
            producto6.setImagenUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop");
            producto6.setStock(28);
            producto6.setMarca("Nike");
            producto6.setRating(4.7);
            producto6.setReviews(1234);
            producto6.setEnvioGratis(true);
            producto6.setVendido(3456);
            producto6.setFechaCreacion(LocalDateTime.now().minusDays(12));
            producto6.setActivo(true);
            producto6.setUsuario(usuario2);
            producto6.setCategorias(Arrays.asList(deportes, moda));
            productos.add(producto6);

            // Producto 7: Smart TV 55"
            Producto producto7 = new Producto();
            producto7.setNombre("Smart TV Samsung 55\" 4K QLED");
            producto7.setDescripcion("Televisor 4K con tecnología Quantum Dot, HDR10+ y sistema operativo Tizen");
            producto7.setPrecio(BigDecimal.valueOf(799999.0));
            producto7.setPrecioOriginal(BigDecimal.valueOf(999999.0));
            producto7.setDescuento(20);
            producto7.setImagenUrl("https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop");
            producto7.setStock(6);
            producto7.setMarca("Samsung");
            producto7.setRating(4.5);
            producto7.setReviews(789);
            producto7.setEnvioGratis(true);
            producto7.setVendido(567);
            producto7.setFechaCreacion(LocalDateTime.now().minusDays(8));
            producto7.setActivo(true);
            producto7.setUsuario(usuario1);
            producto7.setCategorias(Arrays.asList(hogar, tecnologia));
            productos.add(producto7);

            // Producto 8: Cafetera Espresso
            Producto producto8 = new Producto();
            producto8.setNombre("Cafetera Espresso Nespresso Essenza Mini");
            producto8.setDescripcion("Cafetera de cápsulas compacta con 19 bares de presión y apagado automático");
            producto8.setPrecio(BigDecimal.valueOf(89999.0));
            producto8.setPrecioOriginal(null);
            producto8.setDescuento(0);
            producto8.setImagenUrl("/images/Cafetera Espresso Nespresso Essenza Mini.png");
            producto8.setStock(35);
            producto8.setMarca("Nespresso");
            producto8.setRating(4.3);
            producto8.setReviews(2134);
            producto8.setEnvioGratis(true);
            producto8.setVendido(4567);
            producto8.setFechaCreacion(LocalDateTime.now().minusDays(22));
            producto8.setActivo(true);
            producto8.setUsuario(usuario2);
            producto8.setCategorias(Arrays.asList(hogar));
            productos.add(producto8);

            // Producto 9: Libro "Cien años de soledad"
            Producto producto9 = new Producto();
            producto9.setNombre("Cien años de soledad - Gabriel García Márquez");
            producto9.setDescripcion("Obra maestra del realismo mágico que narra la historia de la familia Buendía");
            producto9.setPrecio(BigDecimal.valueOf(15999.0));
            producto9.setPrecioOriginal(BigDecimal.valueOf(19999.0));
            producto9.setDescuento(20);
            producto9.setImagenUrl("/images/Libro cien años de soledad de gabriel garcia marquez.png");
            producto9.setStock(50);
            producto9.setMarca("Editorial Sudamericana");
            producto9.setRating(4.9);
            producto9.setReviews(8901);
            producto9.setEnvioGratis(true);
            producto9.setVendido(12345);
            producto9.setFechaCreacion(LocalDateTime.now().minusDays(50));
            producto9.setActivo(true);
            producto9.setUsuario(usuario1);
            producto9.setCategorias(Arrays.asList(libros));
            productos.add(producto9);

            // Producto 10: Mochila deportiva
            Producto producto10 = new Producto();
            producto10.setNombre("Mochila Deportiva Adidas 40L");
            producto10.setDescripcion("Mochila espaciosa con compartimento para laptop, botellero y material resistente al agua");
            producto10.setPrecio(BigDecimal.valueOf(29999.0));
            producto10.setPrecioOriginal(null);
            producto10.setDescuento(0);
            producto10.setImagenUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop");
            producto10.setStock(40);
            producto10.setMarca("Adidas");
            producto10.setRating(4.4);
            producto10.setReviews(567);
            producto10.setEnvioGratis(true);
            producto10.setVendido(890);
            producto10.setFechaCreacion(LocalDateTime.now().minusDays(14));
            producto10.setActivo(true);
            producto10.setUsuario(usuario2);
            producto10.setCategorias(Arrays.asList(deportes, moda));
            productos.add(producto10);

            productoRepository.saveAll(productos);
            logger.info("✓ Productos creados: {}", productos.size());

            logger.info("========================================");
            logger.info("✓ CARGA DE DATOS COMPLETADA EXITOSAMENTE");
            logger.info("========================================");
            logger.info("Usuarios: 3 (admin@market.com / admin123)");
            logger.info("Categorías: 5");
            logger.info("Productos: {}", productos.size());
            logger.info("========================================");
            
            } catch (Exception e) {
                logger.error("❌ ERROR al inicializar datos de prueba: {}", e.getMessage(), e);
                throw new RuntimeException("Fallo crítico en la inicialización de la base de datos", e);
            }
        };
    }
}
