# reciclame_esta

proyecto de la escuela sobre reciclar los residuos electronicos actualmente con muy pocos puntos y con posible escalamiento a un sistema entre usuarios

queria ver como se hacia una tabla dentro del readme ya esta bueno la principal funcionalidad del proyecto es poder apoyar 
a que las personas puedan encontrar un punto para poder des hacer los dispositivos ya que hay varias personas que tienen
directamente residuos electronicos y esto ayuda a que sepan a donde llevarlos


| Columna 1 | Columna 2 | Columna 3 |
| --------- | --------- | --------- |
| Fila 1 A  | Fila 1 B  | Fila 1 C  |
| Fila 2 A  | Fila 2 B  | Fila 2 C  |


-- ------------------------------------------------------------
- ReciclaTech · Centros de acopio de EJEMPLO
-- ------------------------------------------------------------
Estos NO son centros reales, son datos para probar el sitio.
los datos usados dentro del proyecto no son reales y estan dentro de

- datos_de_wuebos

Ejecutar con:
  mysql -h 127.0.0.1 -u reciclame_esta -p reciclame_esta < base_de_wuebos/Reciclame_esta.sql
  o desde dentro de MySQL:
  SOURCE /ruta/al/proyecto/base_de_wuebos/Reciclame_esta.sql;

- actualizacion del 16/11/26
    la parte pricipal de los html son funcionales y realmente sirven agregue el js de paginas


## JavaScript y ejecución

Los archivos JavaScript se encuentran en `js_perrones/`. Cada HTML carga `datos.js`,
`app.js`, `validaciones.js` y el controlador correspondiente:

| Archivo | Función |
| --- | --- |
| `paginas_pa_jodidos.js` | Inicio, registro e inicio de sesión |
| `paginas_pa_mierdausuarios.js` | Búsqueda, consulta, horarios, reportes y menú de usuario |
| `paginas_pa_admins.js` | Panel y pantallas de administración |
| `validaciones.js` | Validación de formularios |

La interfaz consume una API HTTP en rutas `/api/*` (incluye `/api/bootstrap`,
autenticación, puntos y reportes). Este repositorio contiene el esquema SQL y el
cliente web, pero no incluye el servidor que implementa esa API; para usar las
funciones con datos hace falta ejecutar ese servicio en el mismo origen que la web.