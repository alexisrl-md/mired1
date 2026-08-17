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
   DATOS DEL USUARIO
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
   MOSTRAR NOMBRE
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

function ponerAvatar(elemento) {

    if (!elemento) {

        return;

    }


    const primeraLetra =
        nombreUsuario
            .charAt(0)
            .toUpperCase();


    elemento.textContent =
        primeraLetra;

}


ponerAvatar(fotoSuperior);

ponerAvatar(fotoUsuario);

ponerAvatar(fotoPublicacion);


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

    const likeButtons =
        document.querySelectorAll(
            ".like-button"
        );


    likeButtons.forEach(
        button => {


            if (
                button.dataset.likeActive ===
                "true"
            ) {

                return;

            }


            button.dataset.likeActive =
                "true";


            button.addEventListener(
                "click",
                () => {

                    button.classList.toggle(
                        "liked"
                    );


                    if (
                        button.classList.contains(
                            "liked"
                        )
                    ) {

                        button.innerHTML =
                            "❤️ Me gusta";

                    } else {

                        button.innerHTML =
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

    const buttons =
        document.querySelectorAll(
            ".post-actions button:nth-child(2)"
        );


    buttons.forEach(
        button => {


            if (
                button.dataset.commentActive ===
                "true"
            ) {

                return;

            }


            button.dataset.commentActive =
                "true";


            button.addEventListener(
                "click",
                () => {


                    const post =
                        button.closest(
                            ".post"
                        );


                    let commentBox =
                        post.querySelector(
                            ".comment-box"
                        );


                    if (commentBox) {

                        commentBox
                            .querySelector("input")
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


                    const publish =
                        commentBox.querySelector(
                            "button"
                        );


                    input.focus();


                    publish.addEventListener(
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


    const nuevoComentario =
        document.createElement(
            "div"
        );


    nuevoComentario.className =
        "comment";


    nuevoComentario.innerHTML = `

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
                ${texto}
            </p>

        </div>

    `;


    comments.appendChild(
        nuevoComentario
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


            const text =
                postInput.value.trim();


            if (text === "") {

                alert(
                    "Escribe algo antes de publicar."
                );

                return;

            }


            const newPost =
                document.createElement(
                    "article"
                );


            newPost.className =
                "post";


            newPost.innerHTML = `

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
                    ${text}
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


            const firstPost =
                document.querySelector(
                    ".post"
                );


            if (firstPost) {

                feed.insertBefore(
                    newPost,
                    firstPost
                );

            } else {

                feed.appendChild(
                    newPost
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
   INICIAR
========================= */

activarLikes();

activarComentarios();