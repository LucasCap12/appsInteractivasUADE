package com.api.e_commerce.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validador para la anotación @ValidImageUrl
 * 
 * Implementa la lógica de validación de URLs de imágenes
 */
public class ValidImageUrlValidator implements ConstraintValidator<ValidImageUrl, String> {

    private static final String[] VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};
    
    @Override
    public void initialize(ValidImageUrl constraintAnnotation) {
        // No se necesita inicialización especial
    }

    @Override
    public boolean isValid(String url, ConstraintValidatorContext context) {
        // Null es válido (usar @NotNull para validar nulidad)
        if (url == null || url.trim().isEmpty()) {
            return true;
        }
        
        String urlLower = url.toLowerCase().trim();
        
        // Verificar que comience con http:// o https://
        if (!urlLower.startsWith("http://") && !urlLower.startsWith("https://")) {
            return false;
        }
        
        // Verificar que termine con una extensión válida
        for (String extension : VALID_EXTENSIONS) {
            if (urlLower.endsWith(extension)) {
                return true;
            }
        }
        
        return false;
    }
}
