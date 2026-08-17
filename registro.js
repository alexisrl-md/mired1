import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const supabaseUrl =
    "https://pcwcmeahwbozwitqahue.supabase.co";


const supabaseKey =
    "sb_publishable_sT_QqB0PnBdFx6iFK2JZiw_LoB68n2Z";


const supabase =
    createClient(
        supabaseUrl,
        supabaseKey
    );


const formulario =
    document.getElementById(
        "registroForm"
    );


const mensaje =
    document.getElementById(
        "mensaje"
    );


formulario.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const nombre =
            document.getElementById(
                "nombre"
            ).value.trim();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;


        if (
            password !==
            confirmPassword
        ) {

            mensaje.textContent =
                "Las contraseñas no coinciden.";

            return;

        }


        mensaje.textContent =
            "Creando cuenta...";


        /* =========================
           CREAR CUENTA
        ========================= */

        const {
            data,
            error
        } =
            await supabase.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {

                        nombre: nombre

                    }

                }

            });


        if (error) {

            console.error(
                "ERROR AUTH:",
                error
            );

            mensaje.textContent =
                error.message;

            return;

        }


        console.log(
            "USUARIO CREADO:",
            data.user
        );


        if (!data.user) {

            mensaje.textContent =
                "No se pudo crear el usuario.";

            return;

        }


        /* =========================
           CREAR USERNAME
        ========================= */

        const username =
            nombre
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                )
                .replace(
                    /\s+/g,
                    ""
                );


        /* =========================
           CREAR PERFIL
        ========================= */

        const {
            data: perfil,
            error: perfilError
        } =
            await supabase
                .from("perfiles")
                .insert({

                    id:
                        data.user.id,

                    nombre:
                        nombre,

                    correo:
                        email,

                    username:
                        username,

                    foto:
                        null

                })
                .select()
                .single();


        if (perfilError) {

            console.error(
                "ERROR PERFIL:",
                perfilError
            );


            mensaje.textContent =
                "La cuenta se creó, pero no se pudo crear el perfil.";

            return;

        }


        console.log(
            "PERFIL CREADO:",
            perfil
        );


        /* =========================
           TODO CORRECTO
        ========================= */

        mensaje.textContent =
            "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta.";


        formulario.reset();

    }
);