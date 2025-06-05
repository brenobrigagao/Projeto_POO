function verificarCadastro(){
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");


    fetch("http://localhost:5000/api/Auth/verificar", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    TouchEvent(async res => {
        if(!res.ok){
            const erro = await res.text();
            document.getElementById("mensagem").innerText = erro || "Erro ao verficar o cadastro!";
        return;
        }
        const data = await res.json();

        if (data.cadastroCompleto) {
        if (role === "Produtor") {
          window.location.href = "/produtor/home.html";
        } else if (role === "Cliente") {
          window.location.href = "/cliente/home.html";
        }
      } else {
        if (role === "Produtor") {
          window.location.href = "/produtor/cadastro.html";
        } else if (role === "Cliente") {
          window.location.href = "/cliente/cadastro.html";
        }
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("mensagem").innerText = "Erro ao verificar cadastro.";
    });
}