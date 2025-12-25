const basicasNouns = [
  'Luna', 'Mar', 'Bosque', 'Fuego', 'Viento', 'Arena', 'Río', 'Isla', 'Nube', 'Montaña', 'Puente',
  'Mapa', 'Faro', 'Barco', 'Cueva', 'Roca', 'Cielo', 'Sol', 'Estrella', 'Valle', 'Ciudad', 'Plaza',
  'Puerta', 'Camino', 'Lago', 'Sendero', 'Jardín', 'Desierto', 'Pradera', 'Templo', 'Castillo',
  'Bosquecillo', 'Río Grande', 'Cascada', 'Acantilado', 'Cuevita', 'Volcán', 'Glaciar', 'Tormenta',
  'Pantano', 'Pradera alta', 'Ciénaga', 'Gruta', 'Laguna', 'Cañón', 'Meseta', 'Caverna', 'Bahía azul',
  'Costa', 'Duna', 'Pico nevado', 'Refugio', 'Sendero oculto', 'Cordillera', 'Catarata', 'Naciente',
  'Desembocadura', 'Marisma', 'Parque', 'Aldea', 'Fortaleza', 'Muralla', 'Mercado', 'Puerto', 'Viñedo',
  'Huerto', 'Granero', 'Molino', 'Establo', 'Valle verde', 'Risco', 'Fosa', 'Islote', 'Arrecife',
  'Atalaya', 'Fuerte', 'Puente viejo', 'Caleta', 'Garganta', 'Desfiladero', 'Reserva', 'Granja',
];
const viajesNouns = [
  'Aeropuerto', 'Hotel', 'Pasaporte', 'Maleta', 'Taxi', 'Metro', 'Museo', 'Playa', 'Safari',
  'Crucero', 'Tren', 'Camping', 'Caravana', 'Turismo', 'Guía', 'Souvenir', 'Hostal', 'Billete',
  'Terminal', 'Puerta de embarque', 'Control', 'Frontera', 'Autobús', 'Ferry', 'Funicular', 'Mirador',
  'Parque', 'Catedral', 'Mercado', 'Plaza', 'Bazar', 'Rascacielos', 'Pensión', 'Refugio', 'Ruta',
  'Sendero', 'Puente colgante', 'Islote', 'Bahía', 'Calzada', 'Travesía', 'Excursión', 'Itinerario',
  'Malecón', 'Andén', 'Balcón', 'Farallón', 'Cueva turística', 'Esquina', 'Rotonda', 'Playón',
  'Acera', 'Transbordador', 'Globo aerostático', 'Paseo marítimo', 'Avenida', 'Callejón', 'Mirador alto',
  'Puerto deportivo', 'Canal', 'Estación', 'Terminal 2', 'Zona duty-free', 'Aduana', 'Puerta 7',
  'Circuito', 'Carretera', 'Autopista', 'Mirador norte', 'Zona arqueológica', 'Cascada turística',
  'Río navegable', 'Selva', 'Volcán activo', 'Parque natural', 'Cabo', 'Delta', 'Isla privada',
];

const comidaNouns = [
  'Pizza', 'Taco', 'Hamburguesa', 'Pasta', 'Paella', 'Sushi', 'Arepa', 'Ceviche', 'Curry',
  'Empanada', 'Ramen', 'Gofre', 'Helado', 'Chocolate', 'Café', 'Té', 'Queso', 'Pan', 'Ensalada',
  'Sopa', 'Crema', 'Gazpacho', 'Tarta', 'Brownie', 'Croqueta', 'Bao', 'Dumpling', 'Kebab',
  'Falafel', 'Hummus', 'Guacamole', 'Nachos', 'Bruschetta', 'Risotto', 'Tempura', 'Yakitori',
  'Maki', 'Nigiri', 'Okonomiyaki', 'Burrito', 'Pupusa', 'Tamales', 'Gyoza', 'Bibimbap', 'Pho',
  'Pad Thai', 'Cochinita', 'Mole', 'Quesadilla', 'Chilaquiles', 'Tiramisú', 'Cheesecake', 'Fondue',
  'Raclette', 'Bagel', 'Croissant', 'Brioch', 'Pão de queijo', 'Churro', 'Buñuelo', 'Fainá',
  'Milanesa', 'Asado', 'Causa', 'Anticucho', 'Seco', 'Ajiaco', 'Locro', 'Feijoada', 'Moqueca',
  'Borscht', 'Shawarma', 'Samosa', 'Pakora', 'Dal', 'Moussaka', 'Kofta', 'Katsu', 'Onigiri',
];

const tecnologiaNouns = [
  'Satélite', 'Robot', 'Dron', 'Láser', 'Chip', 'Servidor', 'Nube', 'Batería', 'Sensor',
  'Cámara', 'Módem', 'Antena', 'Consola', 'Algoritmo', 'Virus', 'Firewall', 'Pantalla', 'Teclado',
  'Monitor', 'Red', 'Ruteador', 'Switch', 'Placa base', 'Procesador', 'Memoria', 'SSD', 'Disco',
  'Ciberseguridad', 'API', 'Microservicio', 'Gateway', 'Enrutador', 'Proxy', 'Sistema', 'Firmware',
  'Controlador', 'Microchip', 'Mainframe', 'Transistor', 'Compilador', 'Kernel', 'Driver', 'Script',
  'IDE', 'Repositorio', 'Branch', 'Commit', 'Merge', 'Container', 'Pipeline', 'Cluster', 'Nodo',
  'Balanceador', 'Cache', 'Índice', 'Base de datos', 'Consultas', 'Tabla', 'Esquema', 'Vector',
  'Modelo', 'Dataset', 'Entrenamiento', 'Inference', 'Embeddings', 'Token', 'GPU', 'CPU', 'NPU',
  'Sensor LIDAR', 'Sensor IR', 'SoC', 'BIOS', 'UEFI', 'Ventilador', 'Heatsink', 'Rail', 'Bus',
];

const accionesNouns = [
  'Aprender a bailar', 'Cocinar', 'Salir a correr', 'Leer un libro', 'Ver una película',
  'Hacer yoga', 'Meditar', 'Jugar fútbol', 'Pintar un cuadro', 'Escribir un cuento',
  'Hacer senderismo', 'Andar en bici', 'Practicar natación', 'Tomar fotografías', 'Ir al gimnasio',
  'Cantar en karaoke', 'Tocar guitarra', 'Tocar piano', 'Hacer origami', 'Armar un puzzle',
  'Jugar ajedrez', 'Aprender un idioma', 'Hacer jardinería', 'Plantar un árbol', 'Ordenar la casa',
  'Hacer pan', 'Preparar café', 'Hornear galletas', 'Hacer cerámica', 'Tejer', 'Coser un disfraz',
  'Construir un mueble', 'Armar LEGO', 'Practicar boxeo', 'Bailar salsa', 'Bailar bachata',
  'Practicar skate', 'Patinar sobre hielo', 'Esquiar', 'Snowboard', 'Hacer parkour',
  'Practicar calistenia', 'Hacer pilates', 'Practicar escalada', 'Ir a pescar', 'Acampar',
  'Viajar en tren', 'Hacer voluntariado', 'Visitar un museo', 'Visitar una galería', 'Ir a un concierto',
  'Ir al teatro', 'Jugar videojuegos', 'Streaming', 'Hacer cosplay', 'Hacer magia', 'Resolver acertijos',
  'Hacer sudokus', 'Construir maquetas', 'Volar dron', 'Pilotar un velero', 'Hacer paddle surf',
  'Remar en kayak', 'Practicar buceo', 'Snorkel', 'Surfear', 'Esculpir madera', 'Soldar',
  'Imprimir en 3D', 'Modelar en 3D', 'Hacer animación', 'Editar video', 'Editar audio',
  'Hacer podcast', 'Dar una charla', 'Debatir', 'Practicar oratoria', 'Mentorizar', 'Hacer networking',
  'Correr una maratón', 'Subir una montaña', 'Observar aves', 'Observar estrellas', 'Hacer geocaching',
  'Cultivar bonsái', 'Hacer cocteles', 'Probar cervezas artesanales', 'Catar vinos', 'Dibujar cómics',
  'Escribir poesía', 'Grabar cortometraje', 'Improvisar teatro', 'Practicar stand-up', 'Tocar batería',
  'Tocar violín', 'Dirigir una banda', 'Hacer fotografía nocturna', 'Hacer timelapse',
];

const seriesNouns = [
  'Breaking Bad', 'Juego de Tronos', 'Stranger Things', 'The Office', 'Friends', 'The Crown',
  'Dark', 'El Mandaloriano', 'El Brujo', 'Narcos', 'The Boys', 'Sucesión', 'Mejor llama a Saul',
  'Sherlock', 'Espejo Negro', 'Westworld', 'Loki', 'Bruja Escarlata y Visión', 'The Last of Us', 'House of Cards',
  'Peaky Blinders', 'Vikingos', 'The Walking Dead', 'Perdidos', 'Mad Men', 'Fargo', 'True Detective',
  'Chernobyl', 'Mr. Robot', 'Severance', 'Ted Lasso', 'Solo asesinatos en el edificio', 'The Bear',
  'Andor', 'Ahsoka', 'The Expanse', 'The Leftovers', 'A dos metros bajo tierra', 'Ozark', 'Mindhunter',
  'Miércoles', 'Arcane', 'Halo', 'Fundación', 'The Morning Show', 'Para toda la humanidad', 'Silo', 'The Boys Gen V',
  'Invencible', 'Samurái de ojos azules', 'Dune', 'Avatar', 'El Padrino', 'Star Wars', 'El Señor de los Anillos',
  'Harry Potter', 'Matrix', 'Spider-Man', 'Batman', 'Superman', 'Iron Man', 'Capitán América',
  'Thor', 'Guardianes de la Galaxia', 'Pantera Negra', 'Doctor Strange', 'X-Men', 'Deadpool',
  'Shrek', 'Toy Story', 'Coco', 'Up', 'Del revés', 'Cars', 'Los Increíbles', 'Monstruos S.A.',
  'Buscando a Nemo', 'Soul', 'Luca', 'Wall-E', 'Ratatouille', 'Encanto', 'Moana', 'Frozen', 'Zootrópolis',
  'El Rey León', 'Aladdín', 'Mulán', 'Hércules', 'Tarzán', 'Cenicienta', 'La Bella y la Bestia',
  '101 Dálmatas', 'Cruella', 'Maléfica', 'Big Hero 6', 'Cómo entrenar a tu dragón',
  'Kung Fu Panda', 'Madagascar', 'Megamente', 'El Gato con Botas','One Piece','Naruto','Dragon Ball',
  'Rick y Morty','Los Simpson','Futurama','South Park'
];

const categories = {
  basicas: basicasNouns,
  viajes: viajesNouns,
  comida: comidaNouns,
  tecnologia: tecnologiaNouns,
  acciones: accionesNouns,
  series: seriesNouns,
};

export default categories;
