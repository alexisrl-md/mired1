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
    document.getElementById("loginForm");

const mensaje =
    document.getElementById("mensaje");

formulario.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        mensaje.textContent =
            "iniciando sesion...";

        const { data, error } =
            await supabase.auth.signInWithPassword({

                email: email,

                password: password

            });

        if (error) {

            mensaje.textContent =
                "correo o contraseña incorrectos.";

            return;

        }

        mensaje.textContent =
            "¡inicio de sesion exitoso!";

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1000);

    }
);