-- puntos reales de cdmx
BEGIN;

DELETE FROM puntos WHERE nombre LIKE '%(ejemplo)%';

-- Evita duplicar el punto real que ya existía en la base local.
DELETE FROM puntos
WHERE nombre = 'Reciclemos Juntos' AND calle = 'Jaime Torres Bodet 72';

-- Catálogo de residuos usado por los filtros del sitio.
INSERT INTO residuos (nombre) VALUES ('Celulares y tablets') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO residuos (nombre) VALUES ('Computadoras y laptops') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO residuos (nombre) VALUES ('Pantallas y televisores') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO residuos (nombre) VALUES ('Baterías y pilas') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO residuos (nombre) VALUES ('Cables y cargadores') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO residuos (nombre) VALUES ('Impresoras') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO residuos (nombre) VALUES ('Consolas y videojuegos') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO residuos (nombre) VALUES ('Electrodomésticos pequeños') ON CONFLICT (nombre) DO NOTHING;

-- 1. Recicladora / centro de acopio privado | Rinsa Reciclaje
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/rinsa-reciclaje/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Rinsa Reciclaje', '24 De Marzo De 1867 4', 'Leyes de Reforma 3ra Sección', 'Iztapalapa', '09310',
  19.3822377, -99.0617431,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"08:30","cierra":"18:00","cerrado":false},"martes":{"abre":"08:30","cierra":"18:00","cerrado":false},"miercoles":{"abre":"08:30","cierra":"18:00","cerrado":false},"jueves":{"abre":"08:30","cierra":"18:00","cerrado":false},"viernes":{"abre":"08:30","cierra":"18:00","cerrado":false},"sabado":{"abre":"08:30","cierra":"14:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-001","fecha":"2026-11-26","archivo":"ficha-reciclatech-001.pdf","estado":"verificada"}'::jsonb
);

-- 2. Recicladora / centro de acopio privado | Red Recicla
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/red-recicla/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Red Recicla', 'Pedro Sainz De Baranda 139-Oficina C2', 'Coapa, Cipreses', 'Coyoacán', '04830',
  19.3206005, -99.1289591,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"10:00","cierra":"19:00","cerrado":false},"martes":{"abre":"10:00","cierra":"19:00","cerrado":false},"miercoles":{"abre":"10:00","cierra":"19:00","cerrado":false},"jueves":{"abre":"10:00","cierra":"19:00","cerrado":false},"viernes":{"abre":"10:00","cierra":"19:00","cerrado":false},"sabado":{"abre":"10:00","cierra":"14:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-002","fecha":"2026-11-26","archivo":"ficha-reciclatech-002.pdf","estado":"verificada"}'::jsonb
);

-- 3. Recicladora / centro de acopio privado | Recyel Electronics Recycling
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/recyel-electronics-recycling/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Recyel Electronics Recycling', 'Av. San Lorenzo 279', 'San Nicolás Tolentino', 'Iztapalapa', '09850',
  19.3283196, -99.0753758,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"08:00","cierra":"18:00","cerrado":false},"martes":{"abre":"08:00","cierra":"18:00","cerrado":false},"miercoles":{"abre":"08:00","cierra":"18:00","cerrado":false},"jueves":{"abre":"08:00","cierra":"18:00","cerrado":false},"viernes":{"abre":"08:00","cierra":"18:00","cerrado":false},"sabado":{"abre":"08:00","cierra":"14:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-003","fecha":"2026-11-26","archivo":"ficha-reciclatech-003.pdf","estado":"verificada"}'::jsonb
);

-- 4. Recicladora / centro de acopio privado | Recupera del Valle
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/recupera-del-valle/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Recupera del Valle', 'C. Pilares 129', 'Colonia del Valle Sur', 'Benito Juárez', '03100',
  19.3786107, -99.1697749,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"07:00","cierra":"17:00","cerrado":false},"martes":{"abre":"07:00","cierra":"17:00","cerrado":false},"miercoles":{"abre":"07:00","cierra":"17:00","cerrado":false},"jueves":{"abre":"07:00","cierra":"17:00","cerrado":false},"viernes":{"abre":"07:00","cierra":"17:00","cerrado":false},"sabado":{"abre":"07:00","cierra":"13:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-004","fecha":"2026-11-26","archivo":"ficha-reciclatech-004.pdf","estado":"verificada"}'::jsonb
);

-- 5. Recicladora / centro de acopio privado | Reciclemos Juntos
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/reciclemos-juntos/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Reciclemos Juntos', 'Jaime Torres Bodet 72', 'Santa María la Ribera', 'Cuauhtémoc', '06400',
  19.4448705, -99.1589791,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"08:00","cierra":"18:00","cerrado":false},"martes":{"abre":"08:00","cierra":"18:00","cerrado":false},"miercoles":{"abre":"08:00","cierra":"18:00","cerrado":false},"jueves":{"abre":"08:00","cierra":"18:00","cerrado":false},"viernes":{"abre":"08:00","cierra":"18:00","cerrado":false},"sabado":{"abre":"08:00","cierra":"15:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-005","fecha":"2026-11-26","archivo":"ficha-reciclatech-005.pdf","estado":"verificada"}'::jsonb
);

-- 6. Recicladora / centro de acopio privado | Recicladora Venado Azul
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/recicladora-venado-azul/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Recicladora Venado Azul', 'Av Canal De Apatlaco', 'Campamento 2 de Octubre', 'Iztacalco', '08930',
  19.3815661, -99.1112563,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"18:00","cerrado":false},"martes":{"abre":"09:00","cierra":"18:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"18:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"18:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"18:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"15:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-006","fecha":"2026-11-26","archivo":"ficha-reciclatech-006.pdf","estado":"verificada"}'::jsonb
);

-- 7. Recicladora / centro de acopio privado | The Ewaste Group
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/recicladora-the-ewaste-group/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'The Ewaste Group', 'Callejon', 'José Espinoza Gorostiza 7b,La Guadalupe', 'Tláhuac', '13100',
  19.3100392, -98.9732933,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"18:00","cerrado":false},"martes":{"abre":"09:00","cierra":"18:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"18:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"18:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"18:00","cerrado":false},"sabado":{"abre":"","cierra":"","cerrado":true},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-007","fecha":"2026-11-26","archivo":"ficha-reciclatech-007.pdf","estado":"verificada"}'::jsonb
);

-- 8. Recicladora / centro de acopio privado | Recicladora Janice
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/recicladora-janice/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Recicladora Janice', 'Sur 25 # 512 Leyes De Reforma 2da. Secc 09310', 'Leyes de Reforma 2da Sección', 'Iztapalapa', '09300',
  19.3691754, -99.0674858,
  '["Computadoras y laptops","Pantallas y televisores","Cables y cargadores","Impresoras","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"08:00","cierra":"18:00","cerrado":false},"martes":{"abre":"08:00","cierra":"18:00","cerrado":false},"miercoles":{"abre":"08:00","cierra":"18:00","cerrado":false},"jueves":{"abre":"08:00","cierra":"18:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"17:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"17:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-008","fecha":"2026-11-26","archivo":"ficha-reciclatech-008.pdf","estado":"verificada"}'::jsonb
);

-- 9. Recicladora / centro de acopio privado | Recicladora Imperio
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/recicladora-imperio/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Recicladora Imperio', 'Av. 5', 'Renovación', 'Iztapalapa', '09209',
  19.3703695, -99.0483306,
  '["Computadoras y laptops","Baterías y pilas","Cables y cargadores","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"08:00","cierra":"18:00","cerrado":false},"martes":{"abre":"08:00","cierra":"18:00","cerrado":false},"miercoles":{"abre":"08:00","cierra":"18:00","cerrado":false},"jueves":{"abre":"08:00","cierra":"18:00","cerrado":false},"viernes":{"abre":"08:00","cierra":"18:00","cerrado":false},"sabado":{"abre":"07:00","cierra":"13:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-009","fecha":"2026-11-26","archivo":"ficha-reciclatech-009.pdf","estado":"verificada"}'::jsonb
);

-- 10. Recicladora / centro de acopio privado | Ecoglob Reciclaje
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/ecoglob-reciclaje/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Ecoglob Reciclaje', 'Chihuahua 95', 'Tizapán San Ángel, Progreso Tizapán', 'Álvaro Obregón', '01080',
  19.3419031, -99.2023049,
  '["Celulares y tablets","Computadoras y laptops","Cables y cargadores","Impresoras","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"18:00","cerrado":false},"martes":{"abre":"09:00","cierra":"18:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"18:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"18:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"18:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"13:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-010","fecha":"2026-11-26","archivo":"ficha-reciclatech-010.pdf","estado":"verificada"}'::jsonb
);

-- 11. Recicladora / centro de acopio privado | Biorecicla · Destrucción de archivo muerto
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/biorecicla-destruccion-de-archivo-muerto/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Biorecicla · Destrucción de archivo muerto', 'C/ 26 29', 'Olivar del Conde 2da Sección', 'Álvaro Obregón', '01408',
  19.3724775, -99.2177675,
  '["Computadoras y laptops","Baterías y pilas","Cables y cargadores","Impresoras","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"07:00","cierra":"19:00","cerrado":false},"martes":{"abre":"07:00","cierra":"19:00","cerrado":false},"miercoles":{"abre":"07:00","cierra":"19:00","cerrado":false},"jueves":{"abre":"07:00","cierra":"19:00","cerrado":false},"viernes":{"abre":"07:00","cierra":"19:00","cerrado":false},"sabado":{"abre":"08:00","cierra":"19:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-011","fecha":"2026-11-26","archivo":"ficha-reciclatech-011.pdf","estado":"verificada"}'::jsonb
);

-- 12. Recicladora / centro de acopio privado | Reciclables Los Gallos
-- Fuente: https://reciclamexico.com.mx/centros-de-reciclaje/amigos-del-medio-ambiente-reciclables-los-gallos/
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Reciclables Los Gallos', 'Prolongacion San Antonio 390 Col. Nicanor Arvide', 'A La Altura De Eje 5 Poniente,Minas de Cristo', 'Álvaro Obregón', '01280',
  19.381903, -99.2003536,
  '["Computadoras y laptops","Baterías y pilas","Cables y cargadores","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"08:30","cierra":"17:30","cerrado":false},"martes":{"abre":"08:30","cierra":"17:30","cerrado":false},"miercoles":{"abre":"08:30","cierra":"17:30","cerrado":false},"jueves":{"abre":"08:30","cierra":"17:30","cerrado":false},"viernes":{"abre":"08:30","cierra":"17:30","cerrado":false},"sabado":{"abre":"08:00","cierra":"16:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-012","fecha":"2026-11-26","archivo":"ficha-reciclatech-012.pdf","estado":"verificada"}'::jsonb
);

-- 13. Punto de retorno Steren | Steren Shop Paseo Acoxpa
-- Fuente: https://www.steren.com.mx/steren-shop-paseo-acoxpa
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Shop Paseo Acoxpa', 'Calzada Acoxpa 430, Int. Local 46', 'Ex Hacienda Coapa', 'Tlalpan', '14300',
  19.298568, -99.137266,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"11:00","cierra":"21:00","cerrado":false},"martes":{"abre":"11:00","cierra":"21:00","cerrado":false},"miercoles":{"abre":"11:00","cierra":"21:00","cerrado":false},"jueves":{"abre":"11:00","cierra":"21:00","cerrado":false},"viernes":{"abre":"11:00","cierra":"21:00","cerrado":false},"sabado":{"abre":"11:00","cierra":"21:00","cerrado":false},"domingo":{"abre":"11:00","cierra":"21:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-013","fecha":"2026-11-26","archivo":"ficha-reciclatech-013.pdf","estado":"verificada"}'::jsonb
);

-- 14. Punto de retorno Steren | Steren Shop Gran Terraza Coapa
-- Fuente: https://www.steren.com.mx/steren-shop-gran-terraza-coapa
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Shop Gran Terraza Coapa', 'Calzada Acoxpa 610, Int. Local 104', 'Villa Coapa', 'Tlalpan', '14390',
  19.2943185, -99.1264271,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"11:00","cierra":"21:00","cerrado":false},"martes":{"abre":"11:00","cierra":"21:00","cerrado":false},"miercoles":{"abre":"11:00","cierra":"21:00","cerrado":false},"jueves":{"abre":"11:00","cierra":"21:00","cerrado":false},"viernes":{"abre":"11:00","cierra":"21:00","cerrado":false},"sabado":{"abre":"11:00","cierra":"21:00","cerrado":false},"domingo":{"abre":"11:00","cierra":"21:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-014","fecha":"2026-11-26","archivo":"ficha-reciclatech-014.pdf","estado":"verificada"}'::jsonb
);

-- 15. Punto de retorno Steren | Steren Shop Galerías Coapa
-- Fuente: https://www.steren.com.mx/steren-shop-galerias-coapa
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Shop Galerías Coapa', 'Calzada del Hueso 519, Int. Local 376', 'Residencial Acoxpa', 'Tlalpan', '14300',
  19.301894, -99.123494,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"11:00","cierra":"20:00","cerrado":false},"martes":{"abre":"11:00","cierra":"20:00","cerrado":false},"miercoles":{"abre":"11:00","cierra":"20:00","cerrado":false},"jueves":{"abre":"11:00","cierra":"20:00","cerrado":false},"viernes":{"abre":"11:00","cierra":"21:00","cerrado":false},"sabado":{"abre":"11:00","cierra":"20:00","cerrado":false},"domingo":{"abre":"11:00","cierra":"20:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-015","fecha":"2026-11-26","archivo":"ficha-reciclatech-015.pdf","estado":"verificada"}'::jsonb
);

-- 16. Punto de retorno Steren | Steren Shop Tec Coapa
-- Fuente: https://www.steren.com.mx/steren-shop-tec-coapa
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Shop Tec Coapa', 'Calle Puente 186, Int. L-3a', 'Coapa, Amsa', 'Tlalpan', '14380',
  19.2846575, -99.1385929,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"10:00","cierra":"21:00","cerrado":false},"martes":{"abre":"10:00","cierra":"21:00","cerrado":false},"miercoles":{"abre":"10:00","cierra":"21:00","cerrado":false},"jueves":{"abre":"10:00","cierra":"21:00","cerrado":false},"viernes":{"abre":"10:00","cierra":"21:00","cerrado":false},"sabado":{"abre":"10:00","cierra":"21:00","cerrado":false},"domingo":{"abre":"10:00","cierra":"21:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-016","fecha":"2026-11-26","archivo":"ficha-reciclatech-016.pdf","estado":"verificada"}'::jsonb
);

-- 17. Punto de retorno Steren | Steren Huipulco Tlalpan
-- Fuente: https://www.steren.com.mx/steren-huipulco-tlalpan
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Huipulco Tlalpan', 'Calz. de Tlalpan 4372', 'Huipulco', 'Tlalpan', '14370',
  19.2970725, -99.1524871,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"20:30","cerrado":false},"martes":{"abre":"09:00","cierra":"20:30","cerrado":false},"miercoles":{"abre":"09:00","cierra":"20:30","cerrado":false},"jueves":{"abre":"09:00","cierra":"20:30","cerrado":false},"viernes":{"abre":"09:00","cierra":"20:30","cerrado":false},"sabado":{"abre":"10:00","cierra":"19:00","cerrado":false},"domingo":{"abre":"10:00","cierra":"17:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-017","fecha":"2026-11-26","archivo":"ficha-reciclatech-017.pdf","estado":"verificada"}'::jsonb
);

-- 18. Punto de retorno Steren | Steren Villa Coapa
-- Fuente: https://www.steren.com.mx/steren-miramontes
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Villa Coapa', 'Canal de Miramontes 2739', 'Prados de Coyoacán', 'Tlalpan', '04890',
  19.317444, -99.128823,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:30","cierra":"19:00","cerrado":false},"martes":{"abre":"09:30","cierra":"19:00","cerrado":false},"miercoles":{"abre":"09:30","cierra":"19:00","cerrado":false},"jueves":{"abre":"09:30","cierra":"19:00","cerrado":false},"viernes":{"abre":"09:30","cierra":"19:00","cerrado":false},"sabado":{"abre":"10:00","cierra":"18:00","cerrado":false},"domingo":{"abre":"10:00","cierra":"18:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-018","fecha":"2026-11-26","archivo":"ficha-reciclatech-018.pdf","estado":"verificada"}'::jsonb
);

-- 19. Punto de retorno Steren | Steren Pabellón Cuemanco
-- Fuente: https://www.steren.com.mx/steren-pabellon-cuemanco
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Pabellón Cuemanco', 'Cañaverales 222, Int. Local 31', 'Granjas Coapa', 'Tlalpan', '14330',
  19.294885, -99.109232,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"10:00","cierra":"19:00","cerrado":false},"martes":{"abre":"10:00","cierra":"19:00","cerrado":false},"miercoles":{"abre":"10:00","cierra":"19:00","cerrado":false},"jueves":{"abre":"10:00","cierra":"19:00","cerrado":false},"viernes":{"abre":"10:00","cierra":"19:00","cerrado":false},"sabado":{"abre":"10:00","cierra":"19:00","cerrado":false},"domingo":{"abre":"10:00","cierra":"19:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-019","fecha":"2026-11-26","archivo":"ficha-reciclatech-019.pdf","estado":"verificada"}'::jsonb
);

-- 20. Punto de retorno Steren | Steren Shop Gran Sur
-- Fuente: https://www.steren.com.mx/steren-shop-gran-sur
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Shop Gran Sur', 'Periférico Sur 5550, Int. Local 30', 'Pedregal de Carrasco', 'Coyoacán', '04700',
  19.30596, -99.165885,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"11:00","cierra":"20:30","cerrado":false},"martes":{"abre":"11:00","cierra":"20:30","cerrado":false},"miercoles":{"abre":"11:00","cierra":"20:30","cerrado":false},"jueves":{"abre":"11:00","cierra":"20:30","cerrado":false},"viernes":{"abre":"11:00","cierra":"20:30","cerrado":false},"sabado":{"abre":"11:00","cierra":"21:00","cerrado":false},"domingo":{"abre":"11:00","cierra":"20:30","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-020","fecha":"2026-11-26","archivo":"ficha-reciclatech-020.pdf","estado":"verificada"}'::jsonb
);

-- 21. Punto de retorno Steren | Steren Xochimilco
-- Fuente: https://www.steren.com.mx/steren-xochimilco
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Xochimilco', 'Avenida Prolongación División del Norte 5248', 'San Marcos', 'Xochimilco', '16050',
  19.271062, -99.117766,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"18:30","cerrado":false},"martes":{"abre":"09:00","cierra":"18:30","cerrado":false},"miercoles":{"abre":"09:00","cierra":"18:30","cerrado":false},"jueves":{"abre":"09:00","cierra":"18:30","cerrado":false},"viernes":{"abre":"09:00","cierra":"18:30","cerrado":false},"sabado":{"abre":"10:00","cierra":"17:30","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-021","fecha":"2026-11-26","archivo":"ficha-reciclatech-021.pdf","estado":"verificada"}'::jsonb
);

-- 22. Punto de retorno Steren | Steren Tezozomoc
-- Fuente: https://www.steren.com.mx/steren-tezozomoc
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Tezozomoc', 'Avenida Tezozomoc 121, Int. Local A', 'La Preciosa', 'Azcapotzalco', '02460',
  19.48923, -99.194589,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:30","cierra":"19:00","cerrado":false},"martes":{"abre":"09:30","cierra":"19:00","cerrado":false},"miercoles":{"abre":"09:30","cierra":"19:00","cerrado":false},"jueves":{"abre":"09:30","cierra":"19:00","cerrado":false},"viernes":{"abre":"09:30","cierra":"19:00","cerrado":false},"sabado":{"abre":"10:00","cierra":"15:30","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-022","fecha":"2026-11-26","archivo":"ficha-reciclatech-022.pdf","estado":"verificada"}'::jsonb
);

-- 23. Punto de retorno Steren | Steren México Centro
-- Fuente: https://www.steren.com.mx/steren-mexico-centro
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren México Centro', 'República de El Salvador 20, Int. Local A', 'Centro', 'Cuauhtémoc', '06000',
  19.4302586, -99.1403732,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"18:00","cerrado":false},"martes":{"abre":"09:00","cierra":"19:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"19:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"19:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"19:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"18:00","cerrado":false},"domingo":{"abre":"11:00","cierra":"17:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-023","fecha":"2026-11-26","archivo":"ficha-reciclatech-023.pdf","estado":"verificada"}'::jsonb
);

-- 24. Punto de retorno Steren | Steren La Villa
-- Fuente: https://www.steren.com.mx/steren-la-villa
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren La Villa', 'Calzada Guadalupe 498-B', 'Industrial', 'Gustavo A. Madero', '07800',
  19.474189, -99.121687,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:30","cierra":"19:00","cerrado":false},"martes":{"abre":"09:30","cierra":"19:00","cerrado":false},"miercoles":{"abre":"09:30","cierra":"19:00","cerrado":false},"jueves":{"abre":"09:30","cierra":"19:00","cerrado":false},"viernes":{"abre":"09:30","cierra":"19:00","cerrado":false},"sabado":{"abre":"09:30","cierra":"16:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-024","fecha":"2026-11-26","archivo":"ficha-reciclatech-024.pdf","estado":"verificada"}'::jsonb
);

-- 25. Punto de retorno Steren | Steren Tlalpan
-- Fuente: https://www.steren.com.mx/steren-tlalpan
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Tlalpan', 'Avenida Insurgentes Sur 3726', 'Peña Pobre', 'Tlalpan', '14060',
  19.2937859, -99.1798471,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"20:30","cerrado":false},"martes":{"abre":"09:00","cierra":"20:30","cerrado":false},"miercoles":{"abre":"09:00","cierra":"20:30","cerrado":false},"jueves":{"abre":"09:00","cierra":"20:30","cerrado":false},"viernes":{"abre":"09:00","cierra":"20:30","cerrado":false},"sabado":{"abre":"10:00","cierra":"19:00","cerrado":false},"domingo":{"abre":"10:00","cierra":"17:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-025","fecha":"2026-11-26","archivo":"ficha-reciclatech-025.pdf","estado":"verificada"}'::jsonb
);

-- 26. Punto de retorno Steren | Steren Shop Perisur
-- Fuente: https://www.steren.com.mx/steren-shop-perisur
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Shop Perisur', 'Boulevard Anillo Periférico 4690, Int. Local 316', 'Insurgentes Cuicuilco', 'Coyoacán', '04530',
  19.304404, -99.189929,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"11:00","cierra":"21:00","cerrado":false},"martes":{"abre":"11:00","cierra":"21:00","cerrado":false},"miercoles":{"abre":"11:00","cierra":"21:00","cerrado":false},"jueves":{"abre":"11:00","cierra":"21:00","cerrado":false},"viernes":{"abre":"11:00","cierra":"21:00","cerrado":false},"sabado":{"abre":"11:00","cierra":"21:00","cerrado":false},"domingo":{"abre":"11:00","cierra":"21:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-026","fecha":"2026-11-26","archivo":"ficha-reciclatech-026.pdf","estado":"verificada"}'::jsonb
);

-- 27. Punto de retorno Steren | Steren Universidad
-- Fuente: https://www.steren.com.mx/steren-universidad
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Universidad', 'Avenida Universidad 343, Int. Local D', 'Narvarte Poniente', 'Benito Juárez', '03020',
  19.3875817, -99.1543281,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"19:00","cerrado":false},"martes":{"abre":"09:00","cierra":"19:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"19:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"19:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"19:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"18:00","cerrado":false},"domingo":{"abre":"","cierra":"","cerrado":true}}'::jsonb,
  '{"numero":"RT-2026-027","fecha":"2026-11-26","archivo":"ficha-reciclatech-027.pdf","estado":"verificada"}'::jsonb
);

-- 28. Punto de retorno Steren | Steren Shop Parque Delta
-- Fuente: https://www.steren.com.mx/steren-shop-parque-delta
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Steren Shop Parque Delta', 'Avenida Cuauhtémoc 462, Int. Local 207 2do. piso', 'Narvarte', 'Benito Juárez', '03020',
  19.40263, -99.154404,
  '["Celulares y tablets","Computadoras y laptops","Baterías y pilas","Cables y cargadores","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"11:00","cierra":"21:00","cerrado":false},"martes":{"abre":"11:00","cierra":"21:00","cerrado":false},"miercoles":{"abre":"11:00","cierra":"21:00","cerrado":false},"jueves":{"abre":"11:00","cierra":"21:00","cerrado":false},"viernes":{"abre":"11:00","cierra":"21:00","cerrado":false},"sabado":{"abre":"11:00","cierra":"21:00","cerrado":false},"domingo":{"abre":"11:00","cierra":"21:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-028","fecha":"2026-11-26","archivo":"ficha-reciclatech-028.pdf","estado":"verificada"}'::jsonb
);

-- 29. Estación fija Reciclatrón | Reciclatrón Alameda Norte
-- Fuente: https://sedema.cdmx.gob.mx/programas/programa/reciclatron | https://www.google.com/maps/place/?q=place_id:ChIJ-8nbRAD50YURPYPWoovjQMo
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Reciclatrón Alameda Norte', 'Primer Callejón del Rosario 11C', 'Santa Bárbara', 'Azcapotzalco', '02230',
  19.5021973, -99.1778977,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"15:00","cerrado":false},"martes":{"abre":"09:00","cierra":"15:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"15:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"15:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"15:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"15:00","cerrado":false},"domingo":{"abre":"09:00","cierra":"15:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-029","fecha":"2026-11-26","archivo":"ficha-reciclatech-029.pdf","estado":"verificada"}'::jsonb
);

-- 30. Estación fija Reciclatrón | Reciclatrón Foro Cultural Magdalena Contreras
-- Fuente: https://sedema.cdmx.gob.mx/programas/programa/reciclatron | http://data.sedema.cdmx.gob.mx:8081/culturaambiental/index.php/programas2/reciclatron/puntos-fijos
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Reciclatrón Foro Cultural Magdalena Contreras', 'Camino Real de Contreras 27', 'La Concepción', 'La Magdalena Contreras', '10830',
  19.3046135, -99.234323,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"15:00","cerrado":false},"martes":{"abre":"09:00","cierra":"15:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"15:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"15:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"15:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"15:00","cerrado":false},"domingo":{"abre":"09:00","cierra":"15:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-030","fecha":"2026-11-26","archivo":"ficha-reciclatech-030.pdf","estado":"verificada"}'::jsonb
);

-- 31. Estación fija Reciclatrón | Reciclatrón Deportivo Francisco I. Madero
-- Fuente: https://sedema.cdmx.gob.mx/programas/programa/reciclatron | https://www.sedema.cdmx.gob.mx/comunicacion/nota/sedema-inaugura-modulo-fijo-de-reciclatron-en-alcaldia-iztapalapa-para-manejo-responsable-de-residuos-electricos-y-electronicos
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Reciclatrón Deportivo Francisco I. Madero', 'Av. Telecomunicaciones s/n', 'Chinampac de Juárez', 'Iztapalapa', '09208',
  19.3807895, -99.0469163,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"15:00","cerrado":false},"martes":{"abre":"09:00","cierra":"15:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"15:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"15:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"15:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"15:00","cerrado":false},"domingo":{"abre":"09:00","cierra":"15:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-031","fecha":"2026-11-26","archivo":"ficha-reciclatech-031.pdf","estado":"verificada"}'::jsonb
);

-- 32. Estación fija Reciclatrón | Reciclatrón Deportivo Sánchez Taboada
-- Fuente: https://sedema.cdmx.gob.mx/programas/programa/reciclatron | https://www.google.com/maps/place/?q=place_id:ChIJXQJAdVL-zYUR9_tFmHbI9tU
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Reciclatrón Deportivo Sánchez Taboada', 'Calle Izamal s/n', 'Héroes de Padierna', 'Tlalpan', '14200',
  19.28319, -99.2229844,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"09:00","cierra":"15:00","cerrado":false},"martes":{"abre":"09:00","cierra":"15:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"15:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"15:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"15:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"15:00","cerrado":false},"domingo":{"abre":"09:00","cierra":"15:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-032","fecha":"2026-11-26","archivo":"ficha-reciclatech-032.pdf","estado":"verificada"}'::jsonb
);

-- 33. Estación fija Reciclatrón | Reciclatrón Utopía La Heróica
-- Fuente: https://sedema.cdmx.gob.mx/programas/programa/reciclatron | https://mexicocity.cdmx.gob.mx/venues/utopia-eduardo-molina
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Reciclatrón Utopía La Heróica', 'Av. Ing. Eduardo Molina 81', 'Ampliación 20 de Noviembre', 'Venustiano Carranza', '15260',
  19.4438702, -99.112085,
  '["Celulares y tablets","Computadoras y laptops","Pantallas y televisores","Baterías y pilas","Cables y cargadores","Impresoras","Consolas y videojuegos","Electrodomésticos pequeños"]'::jsonb,
  '{"lunes":{"abre":"","cierra":"","cerrado":true},"martes":{"abre":"09:00","cierra":"15:00","cerrado":false},"miercoles":{"abre":"09:00","cierra":"15:00","cerrado":false},"jueves":{"abre":"09:00","cierra":"15:00","cerrado":false},"viernes":{"abre":"09:00","cierra":"15:00","cerrado":false},"sabado":{"abre":"09:00","cierra":"15:00","cerrado":false},"domingo":{"abre":"09:00","cierra":"15:00","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-033","fecha":"2026-11-26","archivo":"ficha-reciclatech-033.pdf","estado":"verificada"}'::jsonb
);

-- 34. Columna Ponte Pilas | Columna Ponte Pilas · Eje 5 Sur
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJXaIcOgD_0YURLVFICaZ3AY8
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Eje 5 Sur', 'Eje 5 Sur 443', 'Col del Valle Centro', 'Benito Juárez', '03100',
  19.3875833, -99.169989,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-034","fecha":"2026-11-26","archivo":"ficha-reciclatech-034.pdf","estado":"verificada"}'::jsonb
);

-- 35. Columna Ponte Pilas | Columna Ponte Pilas · Loreto
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJS1reqP7_zYUR__oxidmzSYk
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Loreto', 'Loreto y Campamento', 'Loreto', 'Álvaro Obregón', '01090',
  19.333593, -99.1998796,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-035","fecha":"2026-11-26","archivo":"ficha-reciclatech-035.pdf","estado":"verificada"}'::jsonb
);

-- 36. Columna Ponte Pilas | Columna Ponte Pilas · Prado Coyoacán
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJ10qJ0HcBzoURf-TbNUCxzbc
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Prado Coyoacán', 'Prado Coyoacán', 'Coapa', 'Coyoacán', '04810',
  19.3187666, -99.1312771,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-036","fecha":"2026-11-26","archivo":"ficha-reciclatech-036.pdf","estado":"verificada"}'::jsonb
);

-- 37. Columna Ponte Pilas | Columna Ponte Pilas · Calzada del Hueso
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJC0QtL3kBzoURM0KroI6lWHU
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Calzada del Hueso', 'Calz. del Hueso 806', 'Coapa, Hacienda de Coyoacán', 'Coyoacán', '04970',
  19.3007733, -99.1133278,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-037","fecha":"2026-11-26","archivo":"ficha-reciclatech-037.pdf","estado":"verificada"}'::jsonb
);

-- 38. Columna Ponte Pilas | Columna Ponte Pilas · Moctezuma
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJ5TZtSXL90YURdpBRpJjuhNk
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Moctezuma', 'C. Ote. 158 178', 'Moctezuma 2da Secc', 'Venustiano Carranza', '15530',
  19.4319792, -99.0990538,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-038","fecha":"2026-11-26","archivo":"ficha-reciclatech-038.pdf","estado":"verificada"}'::jsonb
);

-- 39. Columna Ponte Pilas | Columna Ponte Pilas · Canal Nacional
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJVbeMsIIDzoUR-5qsk3drUX0
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Canal Nacional', 'Canal Nacional', 'Coapa', 'Coyoacán', '04909',
  19.3069422, -99.1006488,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-039","fecha":"2026-11-26","archivo":"ficha-reciclatech-039.pdf","estado":"verificada"}'::jsonb
);

-- 40. Columna Ponte Pilas | Columna Ponte Pilas · Parque Alameda del Sur
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJvSRNdWABzoURaHEoLMR-lYE
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Parque Alameda del Sur', 'Parque Alameda del Sur', 'Coapa', 'Coyoacán', '04920',
  19.3120131, -99.1183822,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-040","fecha":"2026-11-26","archivo":"ficha-reciclatech-040.pdf","estado":"verificada"}'::jsonb
);

-- 41. Columna Ponte Pilas | Columna Ponte Pilas · Alianza Popular
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJF5g97m4BzoURM3kUCL0dHhU
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Alianza Popular', 'Alianza Popular Revolucionaria', 'Coapa', 'Coyoacán', '04800',
  19.3151506, -99.1241433,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-041","fecha":"2026-11-26","archivo":"ficha-reciclatech-041.pdf","estado":"verificada"}'::jsonb
);

-- 42. Columna Ponte Pilas | Columna Ponte Pilas · San Mateo
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJd6A8SST_0YUR1bhINAEW_UU
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · San Mateo', 'San Mateo', 'San Mateo', 'Coyoacán', '04120',
  19.3497453, -99.1458253,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-042","fecha":"2026-11-26","archivo":"ficha-reciclatech-042.pdf","estado":"verificada"}'::jsonb
);

-- 43. Columna Ponte Pilas | Columna Ponte Pilas · Cd Jardín
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJgSvSSHYBzoURS2CNa80K0jc
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Cd Jardín', 'Cd Jardín', 'Coyoacán', 'Coyoacán', '04370',
  19.3379594, -99.1428403,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-043","fecha":"2026-11-26","archivo":"ficha-reciclatech-043.pdf","estado":"verificada"}'::jsonb
);

-- 44. Columna Ponte Pilas | Columna Ponte Pilas · Portales Norte
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJsdne_er_0YURLyVR9oEWYFo
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Portales Norte', 'Portales Nte', 'Portales Norte', 'Benito Juárez', '03303',
  19.367736, -99.1421668,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-044","fecha":"2026-11-26","archivo":"ficha-reciclatech-044.pdf","estado":"verificada"}'::jsonb
);

-- 45. Columna Ponte Pilas | Columna Ponte Pilas · Río de la Magdalena
-- Fuente: https://www.google.com/maps/search/?api=1&query=19.3383093,-99.1931826
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Río de la Magdalena', 'Río de la Magdalena 10', 'Tizapán San Ángel', 'Álvaro Obregón', '01000',
  19.3383093, -99.1931826,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-045","fecha":"2026-11-26","archivo":"ficha-reciclatech-045.pdf","estado":"verificada"}'::jsonb
);

-- 46. Columna Ponte Pilas | Columna Ponte Pilas · Ex-Ejido Santa Úrsula
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJ7aagYu8BzoUR0vjzRtXaLv8
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Ex-Ejido Santa Úrsula', 'Ex-Ejido Sta Úrsula Coapa 27 Bis', 'Coapa', 'Coyoacán', '04980',
  19.3086664, -99.1327587,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-046","fecha":"2026-11-26","archivo":"ficha-reciclatech-046.pdf","estado":"verificada"}'::jsonb
);

-- 47. Columna Ponte Pilas | Columna Ponte Pilas · Del Carmen
-- Fuente: https://www.google.com/maps/search/?api=1&query=19.3583482,-99.1700932
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Del Carmen', 'Del Carmen', 'Del Carmen', 'Coyoacán', '04100',
  19.3583482, -99.1700932,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-047","fecha":"2026-11-26","archivo":"ficha-reciclatech-047.pdf","estado":"verificada"}'::jsonb
);

-- 48. Columna Ponte Pilas | Columna Ponte Pilas · Playa Pie de la Cuesta
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJFx9LCVv-0YURUlHCYJdTMsQ
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Playa Pie de la Cuesta', 'Playa Pie de la Cuesta 226', 'Reforma Iztaccihuatl Sur', 'Iztacalco', '08840',
  19.3772515, -99.1307964,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-048","fecha":"2026-11-26","archivo":"ficha-reciclatech-048.pdf","estado":"verificada"}'::jsonb
);

-- 49. Columna Ponte Pilas | Columna Ponte Pilas · Santa Fe
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJ5bInIAAB0oURsTQe3eJe8OI
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Santa Fe', 'Carlos A. Madrazo', 'Santa Fe, Carlos A. Madrazo', 'Álvaro Obregón', '01320',
  19.3782147, -99.2502696,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-049","fecha":"2026-11-26","archivo":"ficha-reciclatech-049.pdf","estado":"verificada"}'::jsonb
);

-- 50. Columna Ponte Pilas | Columna Ponte Pilas · Félix Cuevas
-- Fuente: https://www.google.com/maps/place/?q=place_id:ChIJ11goPwv_0YURwnRtDCCdgmw
INSERT INTO puntos (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha) VALUES (
  'Columna Ponte Pilas · Félix Cuevas', 'Félix Cuevas', 'Col del Valle Centro', 'Benito Juárez', '03200',
  19.3732343, -99.1763669,
  '["Baterías y pilas"]'::jsonb,
  '{"lunes":{"abre":"00:00","cierra":"23:59","cerrado":false},"martes":{"abre":"00:00","cierra":"23:59","cerrado":false},"miercoles":{"abre":"00:00","cierra":"23:59","cerrado":false},"jueves":{"abre":"00:00","cierra":"23:59","cerrado":false},"viernes":{"abre":"00:00","cierra":"23:59","cerrado":false},"sabado":{"abre":"00:00","cierra":"23:59","cerrado":false},"domingo":{"abre":"00:00","cierra":"23:59","cerrado":false}}'::jsonb,
  '{"numero":"RT-2026-050","fecha":"2026-11-26","archivo":"ficha-reciclatech-050.pdf","estado":"verificada"}'::jsonb
);

COMMIT;
