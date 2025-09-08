const apiURL = "https://68bb0de684055bce63f10516.mockapi.io/api/v1/dispositivos_IoT";

const statusForm = document.getElementById("statusForm");
const recordsTable = document.getElementById("recordsTable");
const lastStatusSpan = document.getElementById("lastStatus");
const alertContainer = document.getElementById("alertContainer");

// Obtener IP pública
async function getPublicIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch {
        return "0.0.0.0";
    }
}

// Mostrar alert dinámico
function showAlert(message, type="success") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} fade show`;
    alert.textContent = message;
    alertContainer.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
}

// Asignar color de badge según status
function getBadgeClass(status) {
    const normalized = status.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quita acentos
    return "badge-status badge-" + normalized.replace(/ /g, "-");
}


// Agregar registro
statusForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const deviceName = document.getElementById("deviceName").value;
    const status = document.getElementById("statusSelect").value;
    const ip = await getPublicIP();
    const date = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

    const newRecord = { name: deviceName, status, IP: ip, date };

    try {
        await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRecord)
        });
        statusForm.reset();
        showAlert("Registro agregado correctamente!", "success");
        loadRecords();
    } catch {
        showAlert("Error al agregar el registro", "danger");
    }
});

// Cargar últimos 5 registros
async function loadRecords() {
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        const last5 = data.slice(-5).reverse();

        recordsTable.innerHTML = "";
        last5.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.name}</td>
                <td><span class="${getBadgeClass(record.status)}">${record.status}</span></td>
                <td>${record.IP}</td>
                <td>${record.date}</td>
            `;
            recordsTable.appendChild(row);
        });

        lastStatusSpan.textContent = data.length ? data[data.length - 1].status : "-";

    } catch {
        showAlert("Error cargando registros", "danger");
    }
}

// Inicializar
loadRecords();
