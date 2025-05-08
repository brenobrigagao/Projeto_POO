document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = getElementById("email").value;
        const senha = getElementById("senha").value;

        try {
            const response = await fetch("https://localhost:5001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            if (!response.ok) {
                const error = await response.text();
                alert("Erro ao fazer login: " + error);
                return;
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data, role);
            localStorage.setItem("usuarioId", data.id);

            if (data.role == "Produtor") {
                window.location.href = "/produtor/dashboard.html";
            } else if (data.role == "Cliente") {
                window.location.href = "/cliente/dashboard.html";
            }
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            alert("Erro ao conectar com o servidor.");
        }
    });
});