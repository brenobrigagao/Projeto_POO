async function completarCadastro(){
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("enedereco").value;

    let dto = {
        nome,
        telefone,
        endereco
    };

    if(role === "Produtor"){
        dto.nomeLoja = document.getElementById("nomeLoja").value;
        dto.descricao = document.getElementById("descricao").value;
    }else if(role === "Cliente"){
        dto.gostos = document.getElementById("gostos").value;
    }else{
        document.getElementById("mensagem").innerText = "Role inválida!";
        return;
    }

    try{
        const response = await fetch("http://localhost:5000/api/Auth/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Beares ${token}`
            },
            body: JSON.stringfy(dto)
        });
        const mensagem = await response.text();
        document.getElementById("mensagem").innerText = mensagem;
    } catch(err){
        console.error("Erro:",err);
        document.getElementById("mensagem").innerText = "Erro ao completar o cadastro!";
    }
}