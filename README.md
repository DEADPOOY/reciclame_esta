# reciclame_esta
-----------------------------------------------
INTEGRANTES 

- ***Martinez Sanchez Geraldine Melody***
- ***Monzon Vega Ian Adolfo***
- ***Solis Palacios Ian Yahel***
- ***Vertiz Angeles Jose Elias Caleb***

-----------------------------------------------

proyecto de la escuela sobre reciclar los residuos electronicos actualmente con muy pocos puntos y con posible escalamiento a un sistema entre usuarios

queria ver como se hacia una tabla dentro del readme ya esta bueno la principal funcionalidad del proyecto es poder apoyar 
a que las personas puedan encontrar un punto para poder des hacer los dispositivos ya que hay varias personas que tienen
directamente residuos electronicos y esto ayuda a que sepan a donde llevarlosr


| Columna 1 | Columna 2 | Columna 3 |
| --------- | --------- | --------- |
| Fila 1 A  | Fila 1 B  | Fila 1 C  |
| Fila 2 A  | Fila 2 B  | Fila 2 C  |


-- ------------------------------------------------------------
- ReciclaTech · Centros de acopio de EJEMPLO
-- ------------------------------------------------------------
Estos NO son centros reales, son datos para probar el sitio.
los datos usados dentro del proyecto no son reales y estan dentro de

- datos_de_ejemplo

Ejecutar con:
  mysql -h 127.0.0.1 -u reciclatech -p091119 < bd/datos_ejemplo.sql
  o desde dentro de MySQL:
  SOURCE /ruta/al/proyecto/bd/datos_ejemplo.sql;

- actualizacion del 16/11/26
    la parte pricipal de los html son funcionales y realmente sirven agregue el js de paginas


## JAVA SCRIPT

- *pagina.js*, *datos.js*, *app.js*
-- -------------------------------------------------------------

### paginas.js
- el archivo pagina.js contiene la logica y el comportamiento que deberia de hacer los html *espere un poco antes de buscar este archivo*

#### Para qué sirve

- Se ejecuta según la propiedad data-pagina del <"body"> de cada HTML.
- Conecta los formularios y botones con las funciones de API y App.
- Valida datos introducidos por usuarios y administradores.
- Genera tablas, tarjetas, resultados y detalles dinámicamente.
- Controla búsquedas, reportes, sesiones y administración.

Expone un objeto global llamado Paginas, con una función por pantalla.

También incluye:

- Consulta: consulta y visualiza puntos.
- Buscar: muestra resultados y filtros.
- Filtro: permite filtrar por tipo de residuo.
- Punto: muestra la información detallada de un centro.
- Horarios: consulta horarios.
- Reporte: envía una incidencia sobre un centro.

#### Funciones administrativas

- MenuAdmin: muestra estadísticas y la bitácora.
- AdmPuntos: crea, edita y elimina puntos.
- Ficha: verifica o revoca la ficha oficial de un punto.
- AdmResiduos: administra los residuos aceptados.
- AdmHorarios: configura los horarios.
- AdmUbicacion: administra dirección y coordenadas.
- AdmReportes: revisa, da de alta o elimina reportes.

En resumen, este archivo es el **controlador principal de todas las vistas** de la aplicación.

 al principio tenia pensado que dejaria un script directamente solo con eso pero la verdad es que me confundia un chingo y cuando sucedia un error me perdia un chingo por eso quedo dividido en 3

disculpen aun no se como mandar a vinculos asi que dejare el nombre exacto pero hey de algo me va a servir aprender hacer tablas

| *Archivo* | *Descripcion* |
| --- | --- |
| `paginas_publicas.js`| no hay mucho que explicar ya esta explicado pero esto es para el publico general usuarios sin login |
| `paginas_pa_admins.js` | lo mismo no hay muchoq ue explicar pero esto controla la parte de los admins  |
| `paginas_usuarios.js` | alch me mame con el nombre XD pero ni pedo es lo mismo pero gestiona las de los usuarios :3 |

antes de continuar tuve que cambiar el nombre de la carpeta de js porque cuando agregue nuevos se me hacia muy tedioso estar escribiendo todo de nuez

### datos.js
datos por dios datos digamos que es aca lo mero bueno y lo cabron porque son los datos que se necesitan usar en la pagina web directos haciendo mejor su funcionamiento aparte apa eso les va a ayudar para las apis en postman es para ver si si jala o nomas puro vendehumo alch

### app.js
*** matenme porfavor ***
bueno vamos a lo que es directamente esta madre es cosas utiles para las paginas como el mapa y asi mero jejeje

ya dormi asi que sigamos

### validaciones.js
ahora si esta madre es p que no puedan hacer sus mamadas y sobre todo que jale chido la base de datos no quiero que me la deshagan segun yo las validaciones deberia de ser aca lo cabron porque alch sin eso se me jode todo jejejejeje

## el pinchi server

ps hay dos archivos vamos directo esta madre

| Archivo | Detalles |
| --- | --- |
| `server.js` | no hay mucho que explicar pero el funcionaiento principal es que son directamente parametros para llamar y que funcionen de manera correcta las paginas al igual que si tienen un fallo lo puedan decir abiertamente |
| `base_datos.js` | es ahora si que la base de datos es para que la llame y funcione que busque todo lo necesario y lo traiga al frente |

y con esto marcariamos el punto final de este bonito proyecto ya como ultimo lo ultimo son pequeños cambios que are talvez muy necesarios pero al final ya estan casi todos hechos

ahora si que meti vercel y supabase 

supabase controla la abse y los logins

vercel es el dominio publico asi bn vergas

bueno ahora si este es el final me diverti y me gusto gracias por todo


que gracias putas soy la puta mera cabra y me la pela todo

yujuuuuuuuuuuuuuuu

aaa
**psd: actaulmente hay dos formas de inciar el proyecto**
- *1* npm start en la carpeta del proyecto en una terminal
- *2* visitar la url reciclameesta.vercel.app

el servidor local lo uso mas para pruebas antes de haces algun cambio en la que se muestra mas formal
