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



/* =========================
   USUARIO ACTUAL
========================= */

const usuario =
    user;


const nombreUsuario =
    usuario.user_metadata?.nombre ||
    usuario.email?.split("@")[0] ||
    "Usuario";



/* =========================
   ELEMENTOS
========================= */

const nombreElemento =
    document.getElementById(
        "nombreUsuario"
    );


const usuarioElemento =
    document.getElementById(
        "usuarioNombre"
    );


const fotoSuperior =
    document.getElementById(
        "fotoUsuarioSuperior"
    );


const fotoUsuario =
    document.getElementById(
        "fotoUsuario"
    );


const fotoPublicacion =
    document.getElementById(
        "fotoUsuarioPublicacion"
    );


const postInput =
    document.getElementById(
        "postInput"
    );


const publishButton =
    document.getElementById(
        "publishButton"
    );


const feed =
    document.querySelector(
        ".feed"
    );



/* =========================
   MOSTRAR USUARIO
========================= */

if (nombreElemento) {

    nombreElemento.textContent =
        nombreUsuario;

}


if (usuarioElemento) {

    usuarioElemento.textContent =
        "@" +
        nombreUsuario
            .toLowerCase()
            .replace(/\s+/g, "");

}


if (postInput) {

    postInput.placeholder =
        `¿Qué estás pensando, ${nombreUsuario}?`;

}



/* =========================
   AVATAR
========================= */

function ponerAvatar(
    elemento
) {

    if (!elemento) {

        return;

    }


    elemento.textContent =
        nombreUsuario
            .charAt(0)
            .toUpperCase();

}


ponerAvatar(
    fotoSuperior
);


ponerAvatar(
    fotoUsuario
);


ponerAvatar(
    fotoPublicacion
);



/* =========================
   MODO OSCURO
========================= */

const darkMode =
    document.getElementById(
        "darkMode"
    );


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
   LIKES
========================= */

function activarLikes() {

    const botones =
        document.querySelectorAll(
            ".like-button"
        );


    botones.forEach(
        boton => {

            if (
                boton.dataset.likeActive ===
                "true"
            ) {

                return;

            }


            boton.dataset.likeActive =
                "true";


            boton.addEventListener(
                "click",
                () => {

                    boton.classList.toggle(
                        "liked"
                    );


                    if (
                        boton.classList.contains(
                            "liked"
                        )
                    ) {

                        boton.innerHTML =
                            "❤️ Me gusta";

                    } else {

                        boton.innerHTML =
                            "👍 Me gusta";

                    }

                }
            );

        }
    );

}



/* =========================
   COMENTARIOS
========================= */

function activarComentarios() {

    const botones =
        document.querySelectorAll(
            ".post-actions button:nth-child(2)"
        );


    botones.forEach(
        boton => {

            if (
                boton.dataset.commentActive ===
                "true"
            ) {

                return;

            }


            boton.dataset.commentActive =
                "true";


            boton.addEventListener(
                "click",
                () => {

                    const post =
                        boton.closest(
                            ".post"
                        );


                    let commentBox =
                        post.querySelector(
                            ".comment-box"
                        );


                    if (commentBox) {

                        commentBox
                            .querySelector(
                                "input"
                            )
                            .focus();

                        return;

                    }


                    commentBox =
                        document.createElement(
                            "div"
                        );


                    commentBox.className =
                        "comment-box";


                    commentBox.innerHTML = `

                        <input
                            type="text"
                            placeholder="Escribe un comentario..."
                        >

                        <button>
                            Publicar
                        </button>

                    `;


                    post.appendChild(
                        commentBox
                    );


                    const input =
                        commentBox.querySelector(
                            "input"
                        );


                    const publicar =
                        commentBox.querySelector(
                            "button"
                        );


                    input.focus();


                    publicar.addEventListener(
                        "click",
                        () => {

                            agregarComentario(
                                post,
                                input
                            );

                        }
                    );


                    input.addEventListener(
                        "keypress",
                        event => {

                            if (
                                event.key ===
                                "Enter"
                            ) {

                                agregarComentario(
                                    post,
                                    input
                                );

                            }

                        }
                    );

                }
            );

        }
    );

}



/* =========================
   AGREGAR COMENTARIO
========================= */

function agregarComentario(
    post,
    input
) {

    const texto =
        input.value.trim();


    if (texto === "") {

        return;

    }


    let comments =
        post.querySelector(
            ".comments"
        );


    if (!comments) {

        comments =
            document.createElement(
                "div"
            );


        comments.className =
            "comments";


        post.appendChild(
            comments
        );

    }


    const comentario =
        document.createElement(
            "div"
        );


    comentario.className =
        "comment";


    comentario.innerHTML = `

        <div
            class="profile-avatar profile-avatar-small"
        >

            ${nombreUsuario
                .charAt(0)
                .toUpperCase()}

        </div>


        <div>

            <strong>
                ${nombreUsuario}
            </strong>


            <p>
                ${escapeHtml(texto)}
            </p>

        </div>

    `;


    comments.appendChild(
        comentario
    );


    input.value = "";

    input.focus();

}



/* =========================
   CREAR PUBLICACION
========================= */

if (
    publishButton &&
    postInput &&
    feed
) {

    publishButton.addEventListener(
        "click",
        () => {

            const texto =
                postInput.value.trim();


            if (texto === "") {

                alert(
                    "Escribe algo antes de publicar."
                );

                return;

            }


            const nuevaPublicacion =
                document.createElement(
                    "article"
                );


            nuevaPublicacion.className =
                "post";


            nuevaPublicacion.innerHTML = `

                <div class="post-header">

                    <div
                        class="profile-avatar"
                    >

                        ${nombreUsuario
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div>

                        <strong>
                            ${nombreUsuario}
                        </strong>


                        <p>
                            Ahora · 🌎
                        </p>

                    </div>


                    <button class="more">
                        •••
                    </button>

                </div>


                <p class="post-text">
                    ${escapeHtml(texto)}
                </p>


                <div class="post-stats">

                    <span>
                        👍 0
                    </span>


                    <span>
                        0 comentarios
                    </span>

                </div>


                <div class="post-actions">

                    <button class="like-button">
                        👍 Me gusta
                    </button>


                    <button>
                        💬 Comentar
                    </button>


                    <button>
                        ↗️ Compartir
                    </button>

                </div>

            `;


            const primeraPublicacion =
                document.querySelector(
                    ".post"
                );


            if (primeraPublicacion) {

                feed.insertBefore(
                    nuevaPublicacion,
                    primeraPublicacion
                );

            } else {

                feed.appendChild(
                    nuevaPublicacion
                );

            }


            postInput.value = "";


            activarLikes();

            activarComentarios();

        }
    );

}



/* =========================
   CERRAR SESION
========================= */

const cerrarSesion =
    document.getElementById(
        "cerrarSesion"
    );


if (cerrarSesion) {

    cerrarSesion.addEventListener(
        "click",
        async event => {

            event.preventDefault();


            await supabase.auth.signOut();


            window.location.replace(
                "index.html"
            );

        }
    );

}



/* =========================
   CONTACTOS
========================= */

async function cargarContactos() {

    const lista =
        document.getElementById(
            "listaContactos"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = `

        <p class="loading-contacts">
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
                usuario.id
            )
            .order(
                "nombre",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Error cargando contactos:",
            error
        );


        lista.innerHTML = `

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

        lista.innerHTML = `

            <p>
                No hay otros usuarios registrados.
            </p>

        `;

        return;

    }


    lista.innerHTML = "";


    perfiles.forEach(
        perfil => {

            const contacto =
                document.createElement(
                    "div"
                );


            contacto.className =
                "contact";


            contacto.style.cursor =
                "pointer";


            let avatar;


            if (
                perfil.foto &&
                perfil.foto.trim() !== ""
            ) {

                avatar = `

                    <img
                        src="${perfil.foto}"
                        alt="${perfil.nombre}"
                    >

                `;

            } else {

                avatar = `

                    <div
                        class="
                            profile-avatar
                            profile-avatar-small
                        "
                    >

                        ${perfil.nombre
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                `;

            }


            contacto.innerHTML = `

                <div class="online">

                    ${avatar}

                    <span></span>

                </div>


                <div class="contact-info">

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

                    abrirChat(
                        perfil
                    );

                }
            );


            lista.appendChild(
                contacto
            );

        }
    );

}



/* =========================
   ELEMENTOS DEL CHAT
========================= */

const chatWindow =
    document.getElementById(
        "chatWindow"
    );


const chatAvatar =
    document.getElementById(
        "chatAvatar"
    );


const chatNombre =
    document.getElementById(
        "chatNombre"
    );


const chatMensajes =
    document.getElementById(
        "chatMensajes"
    );


const mensajeInput =
    document.getElementById(
        "mensajeInput"
    );


const enviarMensaje =
    document.getElementById(
        "enviarMensaje"
    );


const cerrarChat =
    document.getElementById(
        "cerrarChat"
    );



/* =========================
   CONTACTO ACTUAL
========================= */

let contactoActual =
    null;



/* =========================
   ABRIR CHAT
========================= */

async function abrirChat(
    contacto
) {

    contactoActual =
        contacto;


    if (chatWindow) {

        chatWindow.classList.add(
            "activo"
        );

    }


    if (chatNombre) {

        chatNombre.textContent =
            contacto.nombre;

    }


    if (chatAvatar) {

        chatAvatar.textContent =
            contacto.nombre
                .charAt(0)
                .toUpperCase();

    }


    if (mensajeInput) {

        mensajeInput.value = "";

        mensajeInput.focus();

    }


    await cargarMensajes();

}



/* =========================
   CERRAR CHAT
========================= */

if (cerrarChat) {

    cerrarChat.addEventListener(
        "click",
        () => {

            contactoActual =
                null;


            if (chatWindow) {

                chatWindow.classList.remove(
                    "activo"
                );

            }


            if (chatMensajes) {

                chatMensajes.innerHTML = `

                    <p class="chat-vacio">

                        Selecciona un contacto
                        para comenzar.

                    </p>

                `;

            }

        }
    );

}



/* =========================
   CARGAR MENSAJES
========================= */

async function cargarMensajes() {

    if (
        !contactoActual ||
        !chatMensajes
    ) {

        return;

    }


    chatMensajes.innerHTML = `

        <p class="chat-vacio">
            Cargando mensajes...
        </p>

    `;


    const {
        data: mensajes,
        error
    } =
        await supabase
            .from("mensajes")
            .select(
                "id, remitente, destinatario, mensaje, creado_en"
            )
            .or(
                `and(remitente.eq.${usuario.id},destinatario.eq.${contactoActual.id}),and(remitente.eq.${contactoActual.id},destinatario.eq.${usuario.id})`
            )
            .order(
                "creado_en",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Error cargando mensajes:",
            error
        );


        chatMensajes.innerHTML = `

            <p class="chat-vacio">

                Error al cargar
                los mensajes.

            </p>

        `;

        return;

    }


    chatMensajes.innerHTML = "";


    if (
        !mensajes ||
        mensajes.length === 0
    ) {

        chatMensajes.innerHTML = `

            <p class="chat-vacio">

                No hay mensajes todavía.
                ¡Envía el primero!

            </p>

        `;

        return;

    }


    mensajes.forEach(
        mensaje => {

            mostrarMensaje(
                mensaje
            );

        }
    );


    bajarChat();

}



/* =========================
   MOSTRAR MENSAJE
========================= */

function mostrarMensaje(
    mensaje
) {

    if (!chatMensajes) {

        return;

    }


    const elemento =
        document.createElement(
            "div"
        );


    elemento.className =
        "mensaje";


    if (
        mensaje.remitente ===
        usuario.id
    ) {

        elemento.classList.add(
            "mensaje-propio"
        );

    } else {

        elemento.classList.add(
            "mensaje-otro"
        );

    }


    elemento.innerHTML = `

        <p>
            ${escapeHtml(
                mensaje.mensaje
            )}
        </p>


        <small>
            ${formatearHora(
                mensaje.creado_en
            )}
        </small>

    `;


    chatMensajes.appendChild(
        elemento
    );

}



/* =========================
   ESCAPAR HTML
========================= */

function escapeHtml(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto;


    return div.innerHTML;

}



/* =========================
   FORMATEAR HORA
========================= */

function formatearHora(
    fecha
) {

    if (!fecha) {

        return "";

    }


    return new Date(
        fecha
    ).toLocaleTimeString(
        "es-MX",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}



/* =========================
   BAJAR CHAT
========================= */

function bajarChat() {

    if (!chatMensajes) {

        return;

    }


    chatMensajes.scrollTop =
        chatMensajes.scrollHeight;

}



/* =========================
   ENVIAR MENSAJE
========================= */

async function enviarMensajeChat() {

    if (
        !contactoActual ||
        !mensajeInput ||
        !enviarMensaje
    ) {

        return;

    }


    const texto =
        mensajeInput.value.trim();


    if (texto === "") {

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

                remitente:
                    usuario.id,

                destinatario:
                    contactoActual.id,

                mensaje:
                    texto

            })
            .select()
            .single();


    enviarMensaje.disabled =
        false;


    if (error) {

        console.error(
            "Error enviando mensaje:",
            error
        );


        alert(
            "No se pudo enviar el mensaje."
        );

        return;

    }


    mensajeInput.value = "";

    mensajeInput.focus();


    /*
       Mostramos el mensaje
       inmediatamente.
    */

    if (data) {

        mostrarMensaje(
            data
        );

        bajarChat();

    }

}



/* =========================
   BOTON ENVIAR
========================= */

if (enviarMensaje) {

    enviarMensaje.addEventListener(
        "click",
        enviarMensajeChat
    );

}



/* =========================
   ENTER
========================= */

if (mensajeInput) {

    mensajeInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                enviarMensajeChat();

            }

        }
    );

}



/* =========================
   TIEMPO REAL
========================= */

const canalMensajes =
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

                const nuevoMensaje =
                    payload.new;


                if (
                    !contactoActual
                ) {

                    return;

                }


                /*
                   Evitar duplicar
                   mensajes propios.
                */

                if (
                    nuevoMensaje.remitente ===
                    usuario.id
                ) {

                    return;

                }


                const esConversacion =
                    (
                        nuevoMensaje.remitente ===
                        usuario.id &&
                        nuevoMensaje.destinatario ===
                        contactoActual.id
                    )
                    ||
                    (
                        nuevoMensaje.remitente ===
                        contactoActual.id &&
                        nuevoMensaje.destinatario ===
                        usuario.id
                    );


                if (
                    !esConversacion
                ) {

                    return;

                }


                mostrarMensaje(
                    nuevoMensaje
                );


                bajarChat();

            }
        )
        .subscribe();



/* =========================
   INICIAR
========================= */

activarLikes();

activarComentarios();

cargarContactos();