import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


/* =========================
   SUPABASE
========================= */

const supabaseUrl =
    "https://pcwcmeahwbozwitqahue.supabase.co";


const supabaseKey =
    "sb_publishable_sT_QqB0PnBdFx6iFK2JZiw_LoB68n2Z";


const supabase =
    createClient(
        supabaseUrl,
        supabaseKey
    );


/* =========================
   VERIFICAR USUARIO
========================= */

const {
    data: {
        user
    }
} = await supabase.auth.getUser();


if (!user) {

    window.location.replace(
        "index.html"
    );

    throw new Error(
        "Usuario no autenticado"
    );

}


const usuarioActual =
    user;


/* =========================
   ELEMENTOS
========================= */

const listaContactos =
    document.getElementById(
        "listaContactos"
    );


const mensajes =
    document.getElementById(
        "mensajes"
    );


const chatHeader =
    document.getElementById(
        "chatHeader"
    );


const mensajeInput =
    document.getElementById(
        "mensajeInput"
    );


const enviarMensaje =
    document.getElementById(
        "enviarMensaje"
    );


const darkMode =
    document.getElementById(
        "darkMode"
    );


/* =========================
   MODO OSCURO
========================= */

if (darkMode) {

    darkMode.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );

        }
    );

}


/* =========================
   CONTACTO SELECCIONADO
========================= */

let contactoSeleccionado =
    null;


/* =========================
   CARGAR CONTACTOS
========================= */

async function cargarContactos() {


    listaContactos.innerHTML = `
        <p>
            Cargando contactos...
        </p>
    `;


    const {
        data: perfiles,
        error
    } =
        await supabase
            .from("perfiles")
            .select(
                "id, nombre, username, foto"
            )
            .neq(
                "id",
                usuarioActual.id
            )
            .order(
                "nombre",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            error
        );


        listaContactos.innerHTML = `
            <p>
                Error al cargar contactos.
            </p>
        `;

        return;

    }


    if (
        !perfiles ||
        perfiles.length === 0
    ) {

        listaContactos.innerHTML = `
            <p>
                No hay otros usuarios registrados.
            </p>
        `;

        return;

    }


    listaContactos.innerHTML = "";


    perfiles.forEach(
        perfil => {

            const contacto =
                document.createElement(
                    "div"
                );


            contacto.className =
                "message-contact";


            const letra =
                perfil.nombre
                    .charAt(0)
                    .toUpperCase();


            contacto.innerHTML = `

                <div class="profile-avatar">
                    ${letra}
                </div>

                <div>

                    <strong>
                        ${perfil.nombre}
                    </strong>

                    <small>
                        @${perfil.username}
                    </small>

                </div>

            `;


            contacto.addEventListener(
                "click",
                () => {

                    seleccionarContacto(
                        perfil
                    );

                }
            );


            listaContactos.appendChild(
                contacto
            );

        }
    );

}


/* =========================
   SELECCIONAR CONTACTO
========================= */

async function seleccionarContacto(
    perfil
) {


    contactoSeleccionado =
        perfil;


    chatHeader.innerHTML = `

        <div class="profile-avatar">
            ${perfil.nombre
                .charAt(0)
                .toUpperCase()}
        </div>

        <div>

            <strong>
                ${perfil.nombre}
            </strong>

            <p>
                @${perfil.username}
            </p>

        </div>

    `;


    mensajeInput.disabled =
        false;


    enviarMensaje.disabled =
        false;


    mensajeInput.focus();


    await cargarMensajes();

}


/* =========================
   CARGAR MENSAJES
========================= */

async function cargarMensajes() {


    if (
        !contactoSeleccionado
    ) {

        return;

    }


    mensajes.innerHTML = `
        <p>
            Cargando mensajes...
        </p>
    `;


    const {
        data,
        error
    } =
        await supabase
            .from("mensajes")
            .select("*")
            .or(
                `and(remitente_id.eq.${usuarioActual.id},receptor_id.eq.${contactoSeleccionado.id}),and(remitente_id.eq.${contactoSeleccionado.id},receptor_id.eq.${usuarioActual.id})`
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            error
        );


        mensajes.innerHTML = `
            <p>
                Error al cargar los mensajes.
            </p>
        `;

        return;

    }


    mensajes.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        mensajes.innerHTML = `

            <div class="empty-chat">

                <h3>
                    No hay mensajes todavía
                </h3>

                <p>
                    Envía el primer mensaje.
                </p>

            </div>

        `;

        return;

    }


    data.forEach(
        mensaje => {

            mostrarMensaje(
                mensaje
            );

        }
    );


    mensajes.scrollTop =
        mensajes.scrollHeight;

}


/* =========================
   MOSTRAR MENSAJE
========================= */

function mostrarMensaje(
    mensaje
) {


    const elemento =
        document.createElement(
            "div"
        );


    elemento.className =
        "message";


    if (
        mensaje.remitente_id ===
        usuarioActual.id
    ) {

        elemento.classList.add(
            "message-me"
        );

    } else {

        elemento.classList.add(
            "message-other"
        );

    }


    elemento.innerHTML = `

        <div class="message-bubble">

            ${mensaje.mensaje}

        </div>

    `;


    mensajes.appendChild(
        elemento
    );

}


/* =========================
   ENVIAR MENSAJE
========================= */

async function enviar() {


    if (
        !contactoSeleccionado
    ) {

        return;

    }


    const texto =
        mensajeInput.value.trim();


    if (
        texto === ""
    ) {

        return;

    }


    enviarMensaje.disabled =
        true;


    const {
        data,
        error
    } =
        await supabase
            .from("mensajes")
            .insert({

                remitente_id:
                    usuarioActual.id,

                receptor_id:
                    contactoSeleccionado.id,

                mensaje:
                    texto

            })
            .select()
            .single();


    if (error) {

        console.error(
            error
        );


        alert(
            "No se pudo enviar el mensaje."
        );


        enviarMensaje.disabled =
            false;

        return;

    }


    mensajeInput.value =
        "";


    mostrarMensaje(
        data
    );


    mensajes.scrollTop =
        mensajes.scrollHeight;


    enviarMensaje.disabled =
        false;


    mensajeInput.focus();

}


/* =========================
   BOTON ENVIAR
========================= */

enviarMensaje.addEventListener(
    "click",
    enviar
);


/* =========================
   ENTER
========================= */

mensajeInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            enviar();

        }

    }
);


/* =========================
   ACTUALIZAR MENSAJES
========================= */

supabase
    .channel(
        "mensajes-tiempo-real"
    )
    .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "mensajes"
        },
        payload => {

            const mensaje =
                payload.new;


            if (
                !contactoSeleccionado
            ) {

                return;

            }


            const pertenece =
                (
                    mensaje.remitente_id ===
                    usuarioActual.id &&
                    mensaje.receptor_id ===
                    contactoSeleccionado.id
                )
                ||
                (
                    mensaje.remitente_id ===
                    contactoSeleccionado.id &&
                    mensaje.receptor_id ===
                    usuarioActual.id
                );


            if (
                pertenece
            ) {

                const yaExiste =
                    document.querySelector(
                        `[data-mensaje-id="${mensaje.id}"]`
                    );


                if (
                    yaExiste
                ) {

                    return;

                }


                mostrarMensaje(
                    mensaje
                );


                mensajes.scrollTop =
                    mensajes.scrollHeight;

            }

        }
    )
    .subscribe();


/* =========================
   INICIAR
========================= */

cargarContactos();