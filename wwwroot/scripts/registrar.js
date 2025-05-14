document.getElementById("RegistrarBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const role = document.getElementById("role").value;

    if(!role){
        alert("Selecione um tipo de usuário");
        return;
    }
    const response = await fetch("/api/Auth/registrar", {
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            email : email,
            senha : senha,
            role : role
        })
    });

    const data = await response.json();
    if(response.ok){
        alert("Usuaŕio registrado com sucesso!");
    }
    else{
        alert("error:"+data);
    }
})