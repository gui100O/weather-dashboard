async function buscarClima() {

    const url = "https://api.open-meteo.com/v1/forecast";

    const parametros = {

        latitude: -22.58,
        longitude: -44.96,
        current: "temperature_2m",
        hourly: "temperature_2m,weather_code",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        timezone: "America/Sao_Paulo"
    };


    const consulta = new URLSearchParams(parametros);
    const resposta = await fetch(`${url}?${consulta}`);
    const dados = await resposta.json();


    const codigo = dados.daily.weather_code[0];
    const maxima = dados.daily.temperature_2m_max[0];
    const minima = dados.daily.temperature_2m_min[0];
    const chuva = dados.daily.precipitation_probability_max[0];
    const temperatura = dados.current.temperature_2m;
    const horarios = dados.hourly.time;
    const temperaturas = dados.hourly.temperature_2m;
    const codigos = dados.hourly.weather_code;


    const elementoMaxima = document.getElementById("maxima");
    elementoMaxima.textContent = `${maxima}°C`;


    const elementoMinima = document.getElementById("minima");
    elementoMinima.textContent = `${minima}°C`;

    const elementoChuva = document.getElementById("chuva");
    elementoChuva.textContent = `${chuva}%`;

    const elementoTemperatura = document.getElementById("temperatura");
    elementoTemperatura.textContent = `${temperatura}°C`;

    const elementoCondicao = document.getElementById("condicao");
    elementoCondicao.textContent = `${traduzirClima(codigo)}`;


    const elementoData = document.getElementById("data");

    const hoje = new Date();

    const dataFormatada = hoje.toLocaleDateString("pt-BR", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

    elementoData.textContent = dataFormatada.toUpperCase();


    const elementoHorarios = document.getElementById("horarios");

    const horaAtual = hoje.getHours();

    const indiceAtual = horarios.findIndex(horario => {
    const hora = Number(horario.split("T")[1].split(":")[0]);
    return hora === horaAtual;
    });


    for (let i = indiceAtual; i < indiceAtual + 12; i++) {
        const horario = horarios[i].split("T")[1];
        const temperaturaHorario = temperaturas[i];
        const codigoHorario = codigos[i];


        const card = document.createElement("div");

        card.classList.add("horario");


        card.innerHTML = `

            <p class="horario-hora">
                ${horario}
            </p>

            <p class="horario-temperatura">
                ${temperaturaHorario}°C
            </p>

            <p class="horario-condicao">
                ${traduzirClima(codigoHorario)}
            </p>

        `;


        elementoHorarios.appendChild(card);

    }


    function traduzirClima(codigo) {

        if (codigo === 0) {

            return "Ensolarado";

        }

        else if (codigo === 1 || codigo === 2) {

            return "Parcialmente nublado";

        }

        else if (codigo === 3) {

            return "Nublado";

        }

        else if (codigo === 61 || codigo === 63 || codigo === 65) {

            return "Chuvoso";

        }

        else {

            return "Condição desconhecida";

        }
    }

}


buscarClima();