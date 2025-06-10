
    document.addEventListener("DOMContentLoaded", function () {
      const tipoSelect = document.getElementById("signup-user-type");
      const camposProdutor = document.getElementById("campos-produtor");
      const camposCliente = document.getElementById("campos-cliente");

      tipoSelect.addEventListener("change", function () {
        if (this.value === "produtor") {
          camposProdutor.style.display = "block";
          camposCliente.style.display = "none";
        } else if (this.value === "cliente") {
          camposProdutor.style.display = "none";
          camposCliente.style.display = "block";
        } else {
          camposProdutor.style.display = "none";
          camposCliente.style.display = "none";
        }
      });
    });
  