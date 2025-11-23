import { 
  Smartphone, 
  Shirt, 
  Home, 
  Gamepad2, 
  Watch, 
  Headphones, 
  Camera, 
  Laptop, 
  TrendingUp,
  Dumbbell,
  Book,
  Car,
  Utensils,
  Baby,
  Briefcase,
  Music
} from 'lucide-react';

export const CATEGORY_ICONS = {
  'celular': Smartphone,
  'smartphone': Smartphone,
  'telefono': Smartphone,
  'tech': Smartphone,
  'tecnologia': Smartphone,
  'tecnología': Smartphone,
  
  'ropa': Shirt,
  'moda': Shirt,
  'camisa': Shirt,
  'shirt': Shirt,
  'indumentaria': Shirt,
  
  'hogar': Home,
  'casa': Home,
  'mueble': Home,
  'deco': Home,
  
  'juego': Gamepad2,
  'game': Gamepad2,
  'consola': Gamepad2,
  'gaming': Gamepad2,
  'videojuegos': Gamepad2,
  
  'reloj': Watch,
  'watch': Watch,
  'accesorio': Watch,
  'joya': Watch,
  
  'audio': Headphones,
  'auricular': Headphones,
  'sonido': Headphones,
  'music': Music,
  'musica': Music,
  'música': Music,
  
  'foto': Camera,
  'camara': Camera,
  'cámara': Camera,
  'video': Camera,
  
  'compu': Laptop,
  'laptop': Laptop,
  'notebook': Laptop,
  'pc': Laptop,
  'computacion': Laptop,
  'computación': Laptop,

  'deporte': Dumbbell,
  'deportes': Dumbbell,
  'fitness': Dumbbell,
  'gym': Dumbbell,

  'libro': Book,
  'libros': Book,
  'lectura': Book,

  'auto': Car,
  'autos': Car,
  'vehiculo': Car,
  'vehículo': Car,

  'cocina': Utensils,
  'alimentos': Utensils,
  'comida': Utensils,

  'bebe': Baby,
  'bebé': Baby,
  'niños': Baby,
  'juguetes': Gamepad2,

  'oficina': Briefcase,
  'trabajo': Briefcase,

  'default': TrendingUp
};

export const getCategoryIconComponent = (categoryName) => {
  if (!categoryName) return CATEGORY_ICONS.default;
  
  const normalizedName = categoryName.toLowerCase();
  
  // Direct match
  if (CATEGORY_ICONS[normalizedName]) {
    return CATEGORY_ICONS[normalizedName];
  }

  // Partial match
  const key = Object.keys(CATEGORY_ICONS).find(k => normalizedName.includes(k));
  return key ? CATEGORY_ICONS[key] : CATEGORY_ICONS.default;
};
