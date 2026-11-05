# Plan del proyecto web --- Centro de estética

## 1. Objetivo del proyecto

Crear una página web profesional para el centro de estética que permita
presentar el negocio, mostrar sus servicios y cursos, recibir reservas e
inscripciones y facilitar que la propietaria gestione el contenido sin
depender de un desarrollador.

La web deberá funcionar correctamente en móvil, tablet y ordenador.

## 2. Funciones principales

### Página pública

-   Presentación del centro y de la profesional.
-   Listado de servicios con descripción, precio, duración y
    fotografías.
-   Apartado de cursos, con información e inscripción.
-   Galería de trabajos y fotografías.
-   Ubicación del nuevo local mediante mapa.
-   Contacto directo por WhatsApp y otros datos de contacto.

### Reservas y pagos

-   El cliente podrá reservar una cita.
-   Para confirmar la reserva se solicitará un anticipo del 50 %.
-   La reserva y el estado del pago quedarán guardados en la base de
    datos.
-   El cliente podrá inscribirse en los cursos disponibles.

### Panel de administración

-   Acceso para la propietaria y para el superadministrador.
-   Gestión de servicios, categorías, precios, cursos y fotografías.
-   Gestión de reservas, inscripciones y clientes.
-   Consulta del historial de reservas de cada cliente.
-   Edición de la información del negocio.

La propietaria podrá gestionar el contenido desde el móvil o desde un
ordenador. El superadministrador conservará el control técnico y de los
permisos principales.

## 3. Tecnologías propuestas

-   **Next.js y TypeScript:** desarrollo de la página web.
-   **Supabase:** base de datos PostgreSQL, autenticación y
    almacenamiento de imágenes.
-   **Tailwind CSS:** diseño y estilos adaptables.
-   **Vercel:** publicación y alojamiento de la web.
-   **Pasarela de pago:** pendiente de elegir entre las opciones
    adecuadas para el negocio.

Estas tecnologías son una propuesta inicial y se pueden ajustar antes de
empezar el desarrollo.

## 4. Base de datos: tablas y atributos

A continuación se muestran las tablas previstas. Cada tabla incluye sus
atributos y una breve explicación de cada uno. El modelo es una
propuesta inicial que se revisará antes de implementarlo.

### 4.1 `profiles` --- Perfiles de usuario

Guarda los datos básicos de las personas que tienen una cuenta en la
web.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador del usuario. Coincide
                                      con el usuario creado en el sistema
                                      de autenticación.

  `full_name`                         Nombre completo del usuario.

  `phone`                             Número de teléfono del usuario.

  `created_at`                        Fecha en la que se creó el perfil.

  `updated_at`                        Fecha de la última modificación del
                                      perfil.
  -----------------------------------------------------------------------

### 4.2 `user_roles` --- Roles de usuario

Indica qué permisos tiene cada cuenta dentro de la web.

  Atributo       Explicación
  -------------- -----------------------------------------------
  `id`           Identificador del registro de rol.
  `user_id`      Usuario al que se le asigna el rol.
  `role`         Tipo de acceso: superadmin, admin o customer.
  `created_at`   Fecha en la que se asignó el rol.

### 4.3 `business_settings` --- Datos del negocio

Guarda la información general del centro que se muestra en la página
web.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador del registro de
                                      configuración.

  `business_name`                     Nombre comercial del centro.

  `description`                       Texto de presentación del negocio.

  `phone`                             Teléfono de contacto público.

  `whatsapp`                          Número o enlace para abrir una
                                      conversación por WhatsApp.

  `email`                             Correo electrónico de contacto.

  `address`                           Dirección del local. Se añadirá
                                      cuando esté confirmada la nueva
                                      ubicación.

  `maps_url`                          Enlace a la ubicación del negocio
                                      en el mapa.

  `created_at`                        Fecha de creación del registro.

  `updated_at`                        Fecha de la última actualización.
  -----------------------------------------------------------------------

### 4.4 `service_categories` --- Categorías de servicios

Permite agrupar los servicios para que aparezcan ordenados en la web.

  Atributo        Explicación
  --------------- -----------------------------------------------------------
  `id`            Identificador de la categoría.
  `name`          Nombre de la categoría, por ejemplo, manicura o pedicura.
  `description`   Descripción breve de la categoría.
  `sort_order`    Posición en la que aparece la categoría en la web.
  `is_active`     Indica si la categoría está visible y disponible.

### 4.5 `services` --- Servicios

Contiene los tratamientos y servicios que ofrece el centro.

  Atributo             Explicación
  -------------------- ------------------------------------------------------
  `id`                 Identificador del servicio.
  `category_id`        Categoría a la que pertenece el servicio.
  `name`               Nombre del servicio.
  `description`        Descripción del tratamiento o servicio.
  `price`              Precio actual del servicio.
  `duration_minutes`   Duración aproximada en minutos.
  `image_path`         Ubicación de la fotografía principal del servicio.
  `is_active`          Indica si el servicio se ofrece y aparece en la web.
  `created_at`         Fecha en la que se creó el servicio.
  `updated_at`         Fecha de la última modificación.

### 4.6 `customers` --- Clientes

Guarda los datos de contacto de las personas que reservan o se
inscriben. También permite guardar clientes que no tienen una cuenta en
la web.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador del cliente.

  `profile_id`                        Cuenta de usuario asociada, si el
                                      cliente se ha registrado en la web.

  `full_name`                         Nombre completo del cliente.

  `email`                             Correo electrónico de contacto.

  `phone`                             Número de teléfono de contacto.

  `created_at`                        Fecha en la que se creó la ficha
                                      del cliente.

  `updated_at`                        Fecha de la última modificación de
                                      sus datos.
  -----------------------------------------------------------------------

### 4.7 `business_hours` --- Horario del negocio

Guarda los horarios habituales de apertura del centro.

  Atributo      Explicación
  ------------- -------------------------------------------------
  `id`          Identificador del horario.
  `weekday`     Día de la semana al que corresponde el horario.
  `opens_at`    Hora de apertura.
  `closes_at`   Hora de cierre.
  `is_closed`   Indica si el centro permanece cerrado ese día.

### 4.8 `availability_exceptions` --- Excepciones de disponibilidad

Registra cierres puntuales, vacaciones, festivos o bloqueos de agenda
que modifican el horario habitual.

  Atributo       Explicación
  -------------- ------------------------------------------------------
  `id`           Identificador de la excepción.
  `starts_at`    Fecha y hora en la que comienza el cierre o bloqueo.
  `ends_at`      Fecha y hora en la que termina.
  `reason`       Motivo del cierre o bloqueo, si se desea indicar.
  `created_by`   Usuario administrador que creó la excepción.

### 4.9 `appointments` --- Reservas

Guarda las citas solicitadas por los clientes y su estado.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador de la reserva.

  `customer_id`                       Cliente que ha solicitado la cita.

  `service_id`                        Servicio que se ha reservado.

  `starts_at`                         Fecha y hora de inicio de la cita.

  `ends_at`                           Fecha y hora de finalización
                                      prevista.

  `status`                            Estado de la reserva: pendiente de
                                      pago, confirmada, cancelada,
                                      completada, entre otros.

  `service_name_snapshot`             Nombre del servicio tal como estaba
                                      cuando se realizó la reserva.

  `price_snapshot`                    Precio acordado en el momento de
                                      realizar la reserva.

  `deposit_required`                  Importe del anticipo que se debe
                                      pagar para confirmar la cita.

  `notes`                             Observaciones relacionadas con la
                                      cita.

  `created_at`                        Fecha en la que se creó la reserva.
  -----------------------------------------------------------------------

### 4.10 `course_categories` --- Categorías de cursos

Organiza los cursos por temática.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador de la categoría.

  `name`                              Nombre de la categoría, por
                                      ejemplo, uñas, jabonería natural o
                                      exfoliación.

  `description`                       Descripción de la categoría.

  `sort_order`                        Orden en el que aparece en la web.

  `is_active`                         Indica si la categoría está
                                      disponible y visible.
  -----------------------------------------------------------------------

### 4.11 `courses` --- Cursos

Contiene la información general de cada curso que ofrece el negocio.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador del curso.

  `category_id`                       Categoría a la que pertenece el
                                      curso.

  `name`                              Nombre del curso.

  `description`                       Información sobre el contenido y lo
                                      que aprenderá el alumno.

  `price`                             Precio del curso.

  `modality`                          Modalidad del curso: presencial,
                                      online u otra.

  `image_path`                        Ubicación de la imagen principal
                                      del curso.

  `is_active`                         Indica si el curso está publicado y
                                      disponible.

  `created_at`                        Fecha de creación del curso.

  `updated_at`                        Fecha de la última modificación.
  -----------------------------------------------------------------------

### 4.12 `course_sessions` --- Convocatorias de cursos

Permite que un mismo curso tenga distintas ediciones, fechas u horarios.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador de la convocatoria.

  `course_id`                         Curso al que corresponde esta
                                      convocatoria.

  `starts_at`                         Fecha y hora de comienzo.

  `ends_at`                           Fecha y hora de finalización.

  `capacity`                          Número máximo de alumnos, si existe
                                      límite de plazas.

  `status`                            Estado de la convocatoria: abierta,
                                      completa, cancelada, etc.

  `location`                          Lugar donde se imparte o enlace si
                                      es online.
  -----------------------------------------------------------------------

### 4.13 `course_enrollments` --- Inscripciones a cursos

Registra las personas que se apuntan a una convocatoria.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador de la inscripción.

  `course_session_id`                 Convocatoria del curso en la que se
                                      inscribe el alumno.

  `customer_id`                       Cliente o alumno que realiza la
                                      inscripción.

  `status`                            Estado de la inscripción.

  `price_snapshot`                    Precio del curso en el momento de
                                      la inscripción.

  `created_at`                        Fecha en la que se realizó la
                                      inscripción.
  -----------------------------------------------------------------------

### 4.14 `payments` --- Pagos

Registra los pagos relacionados con las reservas y las inscripciones a
cursos.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador del pago.

  `appointment_id`                    Reserva a la que corresponde el
                                      pago, cuando se trata de una cita.

  `enrollment_id`                     Inscripción a la que corresponde el
                                      pago, cuando se trata de un curso.

  `amount`                            Importe del movimiento.

  `currency`                          Moneda del pago, normalmente EUR.

  `payment_type`                      Tipo de movimiento: anticipo, pago
                                      restante, pago completo o
                                      devolución.

  `status`                            Estado del pago: pendiente,
                                      aprobado, fallido o reembolsado.

  `provider`                          Plataforma o proveedor que procesa
                                      el pago.

  `provider_reference`                Identificador de la operación
                                      facilitado por el proveedor de
                                      pago.

  `created_at`                        Fecha en la que se inició el pago.

  `paid_at`                           Fecha en la que se confirmó el
                                      pago, si se completó.
  -----------------------------------------------------------------------

### 4.15 `media` --- Archivos multimedia

Guarda la referencia de las fotografías y otros archivos que se suben
desde el panel de administración.

  Atributo         Explicación
  ---------------- -----------------------------------------------------
  `id`             Identificador del archivo.
  `storage_path`   Ruta donde está almacenado el archivo.
  `alt_text`       Texto alternativo que describe la imagen.
  `caption`        Texto o pie de foto que puede acompañar al archivo.
  `media_type`     Tipo de archivo, por ejemplo, imagen o vídeo.
  `created_by`     Usuario que subió el archivo.
  `created_at`     Fecha en la que se subió.

### 4.16 `gallery_items` --- Elementos de la galería

Controla qué archivos aparecen en la galería pública y en qué orden.

  -----------------------------------------------------------------------
  Atributo                            Explicación
  ----------------------------------- -----------------------------------
  `id`                                Identificador del elemento de
                                      galería.

  `media_id`                          Archivo multimedia que se muestra.

  `sort_order`                        Posición en la que aparece dentro
                                      de la galería.

  `is_published`                      Indica si el elemento se muestra
                                      públicamente en la web.
  -----------------------------------------------------------------------

## 5. Relaciones principales entre tablas

-   Un perfil de usuario puede tener uno o varios roles.
-   Un perfil puede estar vinculado a una ficha de cliente.
-   Una categoría de servicios puede contener varios servicios.
-   Un cliente puede realizar varias reservas.
-   Un servicio puede aparecer en muchas reservas.
-   Una categoría de cursos puede contener varios cursos.
-   Un curso puede tener varias convocatorias.
-   Una convocatoria puede tener varias inscripciones.
-   Un cliente puede realizar varias inscripciones.
-   Una reserva o una inscripción puede tener uno o varios movimientos
    de pago.
-   Un archivo multimedia puede utilizarse como elemento de la galería.

## 6. Fases de desarrollo

1.  **Definición:** cerrar el funcionamiento, el diseño visual y los
    contenidos necesarios.
2.  **Base de datos:** crear las tablas, relaciones, usuarios y
    permisos.
3.  **Web pública:** desarrollar las páginas de inicio, servicios,
    cursos, galería y contacto.
4.  **Panel de administración:** permitir la gestión del contenido, las
    fotografías y los clientes.
5.  **Reservas e inscripciones:** implementar el proceso de reserva,
    inscripción y pago.
6.  **Pruebas:** revisar permisos, pagos, reservas, visualización y
    funcionamiento en distintos dispositivos.
7.  **Publicación:** desplegar la web y conectar el dominio definitivo.

## 7. Cuestiones pendientes de definir

-   Dirección definitiva y fotografías del nuevo local.
-   Pasarela de pago que se utilizará.
-   Fechas, modalidades y límite de plazas de los cursos.
-   Notificaciones por correo electrónico o WhatsApp.
-   Condiciones de cancelación, devolución y pago del importe restante.
-   Si habrá más de una profesional atendiendo reservas.

## 8. Criterios básicos de seguridad

-   La propietaria podrá gestionar el contenido del negocio, pero no
    podrá cambiar los permisos técnicos del superadministrador.
-   Los permisos deberán comprobarse también en la base de datos, no
    solo ocultando botones en la web.
-   Los pagos se procesarán mediante un proveedor externo. No se
    guardarán en la base de datos los números completos de tarjeta ni
    sus códigos de seguridad.
-   Los datos personales se utilizarán únicamente para gestionar la
    actividad y deberán tratarse conforme a la normativa de protección
    de datos aplicable.
