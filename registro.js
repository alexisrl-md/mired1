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
    document.getElementById("registroForm");


const mensaje =
    document.getElementById("mensaje");


formulario.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const nombre =
            document.getElementById("nombre").value.trim();


        const email =
            document.getElementById("email").value.trim();


        const password =
            document.getElementById("password").value;


        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;


        if (password !== confirmPassword) {

            mensaje.textContent =
                "Las contraseñas no coinciden.";

            return;

        }


        mensaje.textContent =
            "Creando cuenta...";


        const { data, error } =
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

            mensaje.textContent =
                error.message;

            return;

        }


        mensaje.textContent =
            "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta.";

        formulario.reset();

    }
);