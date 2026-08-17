
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
   USUARIO
========================= */

const { data } =
    await supabase.auth.getUser();


if (!data.user) {

    window.location.href =
        "index.html";

}


const usuario =
    data.user;


const nombreUsuario =
    usuario.user_metadata?.nombre ||
    "Usuario";


/* =========================
   MODO OSCURO
========================= */

const darkMode =
    document.getElementById("darkMode");


darkMode.addEventListener("click", () => {

    document.body.classList.toggle("dark");

});


/* =========================
   ACTUALIZAR NOMBRE
========================= */

const nombres =
    document.querySelectorAll(
        ".user-card strong"
    );


nombres.forEach(elemento => {

    elemento.textContent =
        nombreUsuario;

});


const postInput =
    document.getElementById("postInput");


if (postInput) {

    postInput.placeholder =
        `¿Qué estás pensando, ${nombreUsuario}?`;

}


/* =========================
   LIKES
========================= */

function activarLikes() {

    const likeButtons =
        document.querySelectorAll(
            ".like-button"
        );


    likeButtons.forEach(button => {

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

    });

}


/* =========================
   COMENTARIOS
========================= */

function activarComentarios() {

    const buttons =
        document.querySelectorAll(
            ".post-actions button:nth-child(2)"
        );


    buttons.forEach(button => {

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
                    button.closest(".post");


                let commentBox =
                    post.querySelector(
                        ".comment-box"
                    );


                /* si ya existe */

                if (commentBox) {

                    commentBox
                        .querySelector("input")
                        .focus();

                    return;

                }


                /* crear caja */

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


                /* publicar */

                publish.addEventListener(
                    "click",
                    () => {

                        agregarComentario(
                            post,
                            input
                        );

                    }
                );


                /* enter */

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

    });

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


    /* crear sección de comentarios */

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


    /* crear comentario */

    const nuevoComentario =
        document.createElement(
            "div"
        );


    nuevoComentario.className =
        "comment";


    nuevoComentario.innerHTML = `

        <img src="src/images/kevin.jpg">

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


    /* limpiar */

    input.value = "";

    input.focus();

}


/* =========================
   CREAR PUBLICACIÓN
========================= */

const publishButton =
    document.getElementById(
        "publishButton"
    );


const feed =
    document.querySelector(
        ".feed"
    );


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

                <img
                    src="src/images/kevin.jpg"
                >

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


        /* colocar publicación arriba */

        const firstPost =
            document.querySelector(
                ".post"
            );


        feed.insertBefore(
            newPost,
            firstPost
        );


        /* limpiar */

        postInput.value = "";


        /* activar funciones */

        activarLikes();

        activarComentarios();

    }
);


/* =========================
   INICIAR FUNCIONES
========================= */

activarLikes();

activarComentarios();

