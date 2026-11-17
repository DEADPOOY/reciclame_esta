-- base de wuebos perro
-- importante de mencionar antes de iniciar esta base de datos,
-- no es como tal la principal son datos de prueba para la base principal
-- son ejemplos no existen en la vida real, no se debe de tomar como referencia para nada
-- y si si es mera concidencia porfavor mi todos pendejos no tomar en cuenta eso, es mera 
-- concidencia, no es como tal la base de datos principal, va gracias pinches putos

USE reciclatech;
START TRANSACTION; -- Agrupa los cambios se aplicarán juntos cuando se ejecute COMMIT.
-- Quita únicamente registros cuyo nombre termina con la marca "(ejemplo)".
-- Esto permite volver a cargar este archivo sin duplicar mamadas.
DELETE FROM puntos WHERE nombre LIKE '%(ejemplo)%'; -- Borra ejemplos, no elimina centros que no tengan esa marca.

INSERT INTO puntos
  (nombre, calle, colonia, alcaldia, cp, lat, lng, residuos, horarios, ficha)
VALUES
-- Centro 1
('Centro de acopio Centro Histórico (ejemplo)', -- Nombre del primer centro y agrega la mamada esta "(ejemplo)" lo identifica pal futuro
 'Calle Ejemplo 101', 'Centro', 'Cuauhtémoc', '06000', 19.432600, -99.133200, 
 -- Calle, colonia, alcaldía, código postal, latitud y longitud.
 JSON_ARRAY('Celulares y tablets','Computadoras y laptops','Pantallas y televisores','Baterías y pilas','Cables y cargadores'),
 JSON_OBJECT(
   'lunes',     JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'martes',    JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'miercoles', JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'jueves',    JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'viernes',   JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'sabado',    JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'domingo',   JSON_OBJECT('abre','','cierra','','cerrado',true)
 ),
 JSON_OBJECT('numero','SEDEMA-0001','fecha','2026-01-15','archivo','ficha_0001.pdf','estado','verificada')),
 -- tecnicamente Metadatos de ficha ficticia: número, fecha, nombre de archivo y estado
 -- pero ya sin tecnico ora si que esta madre es aca bn aca lo que le dice simon jefa si es bueno
 -- los proximos centros no los voy a comentar porque ya me dio hueva y ya se entiende la mamada

-- Centro de ejemplo 2
('Punto verde Coyoacán (ejemplo)',
 'Avenida Ejemplo 202', 'Del Carmen', 'Coyoacán', '04100',
 JSON_ARRAY('Celulares y tablets','Baterías y pilas','Cables y cargadores','Electrodomésticos pequeños'),
 JSON_OBJECT( 
   'lunes',     JSON_OBJECT('abre','10:00','cierra','16:00','cerrado',false),
   'martes',    JSON_OBJECT('abre','10:00','cierra','16:00','cerrado',false),
   'miercoles', JSON_OBJECT('abre','10:00','cierra','16:00','cerrado',false),
   'jueves',    JSON_OBJECT('abre','10:00','cierra','16:00','cerrado',false),
   'viernes',   JSON_OBJECT('abre','10:00','cierra','16:00','cerrado',false),
   'sabado',    JSON_OBJECT('abre','','cierra','','cerrado',true),
   'domingo',   JSON_OBJECT('abre','','cierra','','cerrado',true)
 ),
 JSON_OBJECT('numero','SEDEMA-0002','fecha','2026-02-03','archivo','ficha_0002.pdf','estado','verificada')),

-- Centro de ejemplo 3
('Acopio tecnológico Polanco (ejemplo)',
 'Calle Ejemplo 303', 'Polanco', 'Miguel Hidalgo', '11560'
 JSON_ARRAY('Computadoras y laptops','Pantallas y televisores','Impresoras','Consolas y videojuegos'),
 JSON_OBJECT(
   'lunes',     JSON_OBJECT('abre','08:00','cierra','15:00','cerrado',false),
   'martes',    JSON_OBJECT('abre','08:00','cierra','15:00','cerrado',false),
   'miercoles', JSON_OBJECT('abre','08:00','cierra','15:00','cerrado',false),
   'jueves',    JSON_OBJECT('abre','08:00','cierra','15:00','cerrado',false),
   'viernes',   JSON_OBJECT('abre','08:00','cierra','15:00','cerrado',false),
   'sabado',    JSON_OBJECT('abre','08:00','cierra','15:00','cerrado',false),
   'domingo',   JSON_OBJECT('abre','','cierra','','cerrado',true)
 ),
 JSON_OBJECT('numero','SEDEMA-0003','fecha','2026-02-20','archivo','ficha_0003.pdf','estado','verificada')),

-- Centro de ejemplo 4
('Reciclaje electrónico Iztapalapa (ejemplo)',
 'Avenida Ejemplo 404', 'Santa Martha', 'Iztapalapa', '09300',
 JSON_ARRAY('Celulares y tablets','Computadoras y laptops','Baterías y pilas','Impresoras'),
 JSON_OBJECT(
   'lunes',     JSON_OBJECT('abre','09:00','cierra','18:00','cerrado',false),
   'martes',    JSON_OBJECT('abre','09:00','cierra','18:00','cerrado',false),
   'miercoles', JSON_OBJECT('abre','09:00','cierra','18:00','cerrado',false),
   'jueves',    JSON_OBJECT('abre','09:00','cierra','18:00','cerrado',false),
   'viernes',   JSON_OBJECT('abre','09:00','cierra','18:00','cerrado',false),
   'sabado',    JSON_OBJECT('abre','09:00','cierra','18:00','cerrado',false),
   'domingo',   JSON_OBJECT('abre','','cierra','','cerrado',true)
 ),
 JSON_OBJECT('numero','SEDEMA-0004','fecha','2026-03-08','archivo','ficha_0004.pdf','estado','verificada')),

-- Centro de ejemplo 5
('Centro de acopio Tlalpan (ejemplo)',
 'Calle Ejemplo 505', 'Centro de Tlalpan', 'Tlalpan', '14000',
 JSON_ARRAY('Pantallas y televisores','Baterías y pilas','Cables y cargadores','Electrodomésticos pequeños'),
 JSON_OBJECT(
   'lunes',     JSON_OBJECT('abre','09:00','cierra','14:00','cerrado',false),
   'martes',    JSON_OBJECT('abre','09:00','cierra','14:00','cerrado',false),
   'miercoles', JSON_OBJECT('abre','09:00','cierra','14:00','cerrado',false),
   'jueves',    JSON_OBJECT('abre','09:00','cierra','14:00','cerrado',false),
   'viernes',   JSON_OBJECT('abre','09:00','cierra','14:00','cerrado',false),
   'sabado',    JSON_OBJECT('abre','','cierra','','cerrado',true),
   'domingo',   JSON_OBJECT('abre','','cierra','','cerrado',true)
 ),
 JSON_OBJECT('numero','','fecha','','archivo','','estado','pendiente')), 

-- Centro de ejemplo 6
('Acopio Gustavo A. Madero (ejemplo)',
 'Avenida Ejemplo 606', 'Lindavista', 'Gustavo A. Madero', '07300',
 JSON_ARRAY('Celulares y tablets','Computadoras y laptops'),
 JSON_OBJECT(
   'lunes',     JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'martes',    JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'miercoles', JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'jueves',    JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'viernes',   JSON_OBJECT('abre','09:00','cierra','17:00','cerrado',false),
   'sabado',    JSON_OBJECT('abre','','cierra','','cerrado',true),
   'domingo',   JSON_OBJECT('abre','','cierra','','cerrado',true)
 ),
 JSON_OBJECT('numero','','fecha','','archivo','','estado','pendiente'));

COMMIT; -- esta madre es lo que dije que confirma los cambios y ya asi quedan bn vergas xd

-- Consulta de comprobación: lista los centros y el estado de su ficha.
SELECT id, nombre, alcaldia, -- Devuelve identificador, nombre y alcaldía de cada centro.
       JSON_UNQUOTE(JSON_EXTRACT(ficha, '$.estado')) AS ficha_estado -- Extrae el estado del JSON y lo devuelve como texto.
FROM puntos -- Lee los registros de la tabla de centros.
ORDER BY id; -- Ordena el resultado por identificador ascendente.
