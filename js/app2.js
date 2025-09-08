const apiURL = "https://68bb0de684055bce63f10516.mockapi.io/api/v1/dispositivos_IoT";

function getBadgeClass(status) {
    const normalized = status.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return "badge-status badge-" + normalized.replace(/ /g, "-");
}

async function loadRecords() {
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        const last10 = data.slice(-10).reverse();

        const table = document.getElementById("recordsTable2");
        table.innerHTML = "";

        last10.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.name}</td>
                <td><span class="${getBadgeClass(record.status)}">${record.status}</span></td>
                <td>${record.IP}</td>
                <td>${record.date}</td>
            `;
            table.appendChild(row);
        });

        document.getElementById("lastStatus2").textContent = data.length ? data[data.length - 1].status : "-";
    } catch (error) {
        console.error(error);
    }
}

// Carga inicial y polling cada 2 segundos
loadRecords();
setInterval(loadRecords, 2000);
