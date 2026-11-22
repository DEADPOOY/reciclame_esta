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

### Iniciar el servidor local

Se necesita Node.js 18 o posterior y MySQL. Desde la carpeta principal del proyecto:

1. Inicializa MySQL con el esquema y el usuario de la aplicación:

   ```bash
   mysql -u root -p < base_de_datos/Reciclame_esta.sql
   ```

2. Instala las dependencias e inicia el servidor:

   ```bash
   npm install
   npm start
   ```

   En el primer inicio, el servidor pregunta los datos de conexión a MySQL y crea `.env` en la carpeta principal. Los valores sugeridos corresponden al usuario creado por el SQL; introduce la contraseña configurada en MySQL.

3. Abre <http://localhost:3000>. Para cargar los datos ficticios de prueba, en otra terminal ejecuta:

   ```bash
   mysql -h localhost -u reciclame_esta -p reciclame_esta < base_de_datos/datos_de_ejemplo.sql
   ```

No subas `.env` a Git: contiene la contraseña de MySQL.

## Inicio de sesión con GitHub (Supabase)

El login social usa Supabase. La publishable/anon key es pública y el servidor la entrega al navegador desde `/api/config`; nunca se manda la service role key.

1. Crea un proyecto en <https://supabase.com/dashboard>.
2. En **Project Settings > API** copia el **Project URL** y la **publishable/anon key**.
3. Agrégalos al `.env` y reinicia el servidor:

   ```env
   SUPABASE_URL=https://TU-PROYECTO.supabase.co
   SUPABASE_KEY=TU_PUBLISHABLE_KEY
   ```

4. En **Authentication > Providers** activa GitHub. La URL de callback que pide Supabase es:

   ```text
   https://TU-PROYECTO.supabase.co/auth/v1/callback
   ```

5. En **Authentication > URL Configuration** agrega las URLs de retorno de la app:

   ```text
   http://localhost:3000/publico/Login.html*
   https://TU-DOMINIO/publico/Login.html*
   ```

6. Si `SUPABASE_URL` sigue siendo el valor de ejemplo (`https://supabase.co`), el servidor avisa que el OAuth está desactivado y los botones muestran el error al pulsarlos. No es un proyecto real de Supabase.

El flujo es: el navegador inicia OAuth con Supabase, Supabase regresa a `Login.html?oauth=1`, el frontend manda el token a `/api/auth/supabase`, el servidor lo verifica contra Supabase, crea o reutiliza la cuenta local y emite la cookie de sesión de ReciclaTech.

## Validación de dominios de correo

El registro rechaza correos de dominios temporales/desechables. La lista se comparte entre el navegador y el servidor desde `js/dominios_correo.js`:

- Si `permitidos` está vacío, se bloquean los dominios de `bloqueados`.
- Si llenas `permitidos`, solo se aceptan esos dominios.

El mensaje que se muestra es: **“Esta terminación de correo no está permitida. Usa otro correo.”**

bueno ahora si este es el final me diverti y me gusto gracias por todo