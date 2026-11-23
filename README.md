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

### Usar Supabase como base de datos

La aplicación guarda sus tablas en PostgreSQL de Supabase. Express se conecta con `DATABASE_URL` desde el servidor; el navegador nunca recibe la contraseña de la base. El archivo `base_de_datos/supabase_schema.sql` crea el esquema y el servidor lo vuelve a aplicar de forma segura al iniciar.

#### Preparación inicial

1. Crea un proyecto Supabase y espera a que termine de aprovisionarse.
2. En **Connect**, copia la conexión de **Session pooler**. Codifica en formato URL los caracteres especiales de la contraseña. La conexión directa requiere IPv6 en algunos entornos.
3. En el menú principal del proyecto abre **Database > Settings > SSL Configuration**, descarga el certificado CA de Supabase y guárdalo en la raíz del proyecto con el nombre `supabase-ca.crt`. La conexión verifica el certificado y el host; no desactives esta validación.
4. En tu `.env` actual configura `DATABASE_URL` con la URI y estos parámetros al final: `?sslmode=verify-full&sslrootcert=supabase-ca.crt`. Si la URI ya contiene parámetros, reemplaza `?` por `&`. Si aún no tienes `.env`, copia `.env.example` y completa sus valores. Conserva las variables `MYSQL_*` hasta terminar la importación. Deja también `SUPABASE_URL` y `SUPABASE_KEY` configurados para el login social. No compartas ni subas `.env` a Git.
5. En el Dashboard de Supabase abre **SQL Editor**, pega el contenido de `base_de_datos/supabase_schema.sql` y ejecútalo.
6. En la computadora que aún tiene MySQL instala dependencias (`npm install`) y conserva configuradas en `.env` las variables `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD` y `MYSQL_DATABASE` para esa base de origen.
7. Detén la aplicación para que no haya cambios nuevos mientras copias los datos. Ejecuta una sola vez `npm run migrar:mysql-supabase`. El importador copia `users`, `residuos`, `puntos`, `sessions`, `reportes` y `bitacora` dentro de una transacción. Si alguna tabla destino ya contiene filas, se detiene para evitar duplicados; usa un proyecto Supabase vacío para importar.
8. Cuando el importador confirme que terminó, inicia la aplicación con `npm start` y abre <http://localhost:3000>. A partir de ahí, las lecturas y escrituras de la app ya van a Supabase. Mantén MySQL como respaldo hasta comprobar la aplicación.

En otro dispositivo solo necesitas clonar el proyecto, instalar dependencias, configurar `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY` y `PORT` en su `.env`, y ejecutar `npm start`. No necesitas instalar ni mantener MySQL allí. La importación es una sola vez y solo desde el equipo que conserva el MySQL original.

El importador presupone que el esquema fuente contiene las tablas de la aplicación. No migra usuarios internos de Supabase Auth; conserva las cuentas de ReciclaTech en la tabla propia `users`, incluyendo sus hashes de contraseña.

### Publicar en Vercel

El proyecto exporta Express desde la raíz y guarda HTML, CSS, JavaScript e imágenes en `public/`. Antes de subir cambios de páginas, ejecuta `npm run build` y agrega `public/` a Git. Vercel sirve esos assets desde su CDN y ejecuta las rutas de Express como una función Node. El servidor carga el certificado CA desde una ruta estática para que se incluya en la función.

1. Sube el proyecto a GitHub y en Vercel importa ese repositorio. Deja el framework en **Express** o en detección automática; no definas un Build Command ni Output Directory personalizado.
2. En Vercel > **Project Settings > Environment Variables**, configura:
   - `DATABASE_URL`: URI de Supabase **Session pooler** (puerto `5432`), con `sslmode=verify-full&sslrootcert=supabase-ca.crt` al final. En Vercel el pool de la app se limita a una conexión con `PG_POOL_MAX=1`.
   - `SUPABASE_URL`: Project URL de Supabase.
   - `SUPABASE_KEY`: publishable/anon key, para el login de GitHub.
   - `APP_ORIGIN`: dominio HTTPS final de la app, por ejemplo `https://reciclameesta.vercel.app` (sin `/` final). Si usas un dominio propio, este es el valor principal; si no lo configuras, se usa el dominio que entrega Vercel.
   - `APP_ORIGINS` (opcional): varios dominios separados por comas, por ejemplo `https://reciclameesta.vercel.app`. El servidor también detecta automáticamente `VERCEL_URL`, `VERCEL_BRANCH_URL` y `VERCEL_PROJECT_PRODUCTION_URL` para que funcionen las previews.
   No configures las variables `MYSQL_*` en Vercel; solo fueron necesarias para importar desde el MySQL local.

   **Importante:** cada variable debe quedar marcada para **Production** (marca también Preview y Development si quieres). La página **Environments** no es donde se guardan las variables; usa **Project Settings > Environment Variables**. Después de guardar, entra a **Deployments**, abre el último despliegue y pulsa **Redeploy**. Si `/api/health` responde `{"ok":false,"error":"Falta DATABASE_URL..."}`, la variable no está guardada en Production o el despliegue no se volvió a crear.
3. El archivo `supabase-ca.crt` ya está incluido en el repositorio. Es un certificado público de confianza, no una contraseña.
4. En Supabase **Authentication > URL Configuration > Redirect URLs**, agrega las URLs de la tabla de abajo.
5. En la app OAuth de GitHub, conserva como **Authorization callback URL** el callback de Supabase `https://TU-PROYECTO.supabase.co/auth/v1/callback`; la IP local o el dominio de Vercel no sustituyen ese callback.
6. Despliega y abre el dominio HTTPS de Vercel. La ubicación del celular funcionará en ese origen seguro; el HTTPS de Vercel también permite el flujo de GitHub.

#### URLs para Supabase y GitHub

| Dónde se configura | Valor |
| --- | --- |
| Supabase > Site URL | `https://TU-DOMINIO-VERCEL` |
| Supabase > Redirect URLs (local) | `http://localhost:3000/publico/Login.html*` |
| Supabase > Redirect URLs (producción) | `https://TU-DOMINIO-VERCEL/publico/Login.html*` |
| Supabase > Redirect URLs (previews) | `https://*-TU-EQUIPO.vercel.app/publico/Login.html*` |
| GitHub OAuth App > Authorization callback URL | `https://TU-PROYECTO.supabase.co/auth/v1/callback` |

Para imprimir las URLs exactas según tu `.env`:

```bash
npm run urls:supabase
```

Si no quieres habilitar el login social en las previews, omite el patrón de previews y deja solo localhost y producción. El callback de GitHub siempre apunta a Supabase, no a Vercel.

Usa la URI **Session pooler** del puerto `5432` tanto en local como en Vercel, tal como se indica arriba. En Vercel el pool de la aplicación se limita a una conexión.

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

   En Vercel puedes agregar también el patrón de previews y ejecutar `npm run urls:supabase` para copiar los valores exactos.

6. Si `SUPABASE_URL` sigue siendo el valor de ejemplo (`https://supabase.co`), el servidor avisa que el OAuth está desactivado y los botones muestran el error al pulsarlos. No es un proyecto real de Supabase.

El flujo es: el navegador inicia OAuth con Supabase, Supabase regresa a `Login.html?oauth=1`, el frontend manda el token a `/api/auth/supabase`, el servidor lo verifica contra Supabase, crea o reutiliza la cuenta local y emite la cookie de sesión de ReciclaTech.

## Validación de dominios de correo

El registro rechaza correos de dominios temporales/desechables. La lista se comparte entre el navegador y el servidor desde `js/dominios_correo.js`:

- Si `permitidos` está vacío, se bloquean los dominios de `bloqueados`.
- Si llenas `permitidos`, solo se aceptan esos dominios.

El mensaje que se muestra es: **“Esta terminación de correo no está permitida. Usa otro correo.”**

bueno ahora si este es el final me diverti y me gusto gracias por todo
