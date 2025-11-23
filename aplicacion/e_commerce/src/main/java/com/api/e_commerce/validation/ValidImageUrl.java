package com.api.e_commerce.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * Anotación de validación personalizada para URLs de imágenes
 * 
 * Valida que:
 * - La URL no esté vacía
 * - Termine en una extensión de imagen válida (.jpg, .jpeg, .png, .gif, .webp)
 * - Comience con http:// o https://
 * 
 * Uso:
 * @ValidImageUrl
 * private String imagenUrl;
 */
@Documented
@Constraint(validatedBy = ValidImageUrlValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidImageUrl {
    
    String message() default "La URL de la imagen no es válida. Debe ser una URL HTTP/HTTPS que termine en .jpg, .jpeg, .png, .gif o .webp";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
