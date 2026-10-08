const API_URL = "https://api.open-meteo.com/v1/forecast";
const parametros = {
  latitude: -22.58,
  longitude: -44.96,
  current: "temperature_2m,weather_code",
  hourly: "temperature_2m,weather_code",
  daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
  timezone: "America/Sao_Paulo",
  forecast_days: 1
};

const traduzirClima = (codigo) => {
  if (codigo === 0) return "Céu limpo";
  if ([1, 2].includes(codigo)) return "Parcialmente nublado";
  if (codigo === 3) return "Nublado";
  if ([45, 48].includes(codigo)) return "Neblina";
  if ([51, 53, 55, 56, 57].includes(codigo)) return "Garoa";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return "Chuva";
  if ([71, 73, 75, 77, 85, 86].includes(codigo)) return "Neve";
  if ([95, 96, 99].includes(codigo)) return "Trovoadas";
  return "Condição variável";
};

const iconeClima = (codigo) => {
  if (codigo === 0) return "☀";
  if ([1, 2].includes(codigo)) return "⛅";
  if ([3, 45, 48].includes(codigo)) return "☁";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return "☂";
  if ([95, 96, 99].includes(codigo)) return "ϟ";
  return "✳";
};

const formatarTemperatura = (valor) => Number.isFinite(valor) ? `${Math.round(valor)}°C` : "--°C";

function atualizarData() {
  const agora = new Date();
  const elemento = document.getElementById("data");
  if (elemento) {
    elemento.textContent = agora.toLocaleDateString("pt-BR", {
      weekday: "short", day: "2-digit", month: "short", year: "numeric",
      timeZone: "America/Sao_Paulo"
    }).replace(".", "").toUpperCase();
  }
  const year = document.getElementById("year");
  if (year) year.textContent = agora.getFullYear();
}

function renderizarPrevisao(dados) {
  const container = document.getElementById("horarios");
  container.replaceChildren();

  const agora = new Date();
  const horaLocal = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", hourCycle: "h23", timeZone: "America/Sao_Paulo"
  }).format(agora);
  let indiceAtual = dados.hourly.time.findIndex((tempo) => tempo.slice(11, 13) >= horaLocal);
  if (indiceAtual < 0) indiceAtual = 0;

  const proximasHoras = dados.hourly.time.slice(indiceAtual, indiceAtual + 12);
  proximasHoras.forEach((tempo, indice) => {
    const posicao = indiceAtual + indice;
    const codigo = dados.hourly.weather_code[posicao];
    const card = document.createElement("article");
    card.className = "horario";

    const hora = document.createElement("p");
    hora.className = "horario-hora";
    hora.textContent = posicao === indiceAtual ? "AGORA" : tempo.slice(11, 16);

    const icone = document.createElement("span");
    icone.className = "horario-icone";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = iconeClima(codigo);

    const temperatura = document.createElement("p");
    temperatura.className = "horario-temperatura";
    temperatura.textContent = formatarTemperatura(dados.hourly.temperature_2m[posicao]);

    const condicao = document.createElement("p");
    condicao.className = "horario-condicao";
    condicao.textContent = traduzirClima(codigo);

    card.append(hora, icone, temperatura, condicao);
    container.appendChild(card);
  });

  if (!proximasHoras.length) {
    container.innerHTML = '<p class="loading-state">Não foi possível encontrar a previsão horária.</p>';
  }
}

async function buscarClima() {
  const consulta = new URLSearchParams(parametros);
  const elementoCondicao = document.getElementById("condicao");
  try {
    const resposta = await fetch(`${API_URL}?${consulta}`);
    if (!resposta.ok) throw new Error("A API retornou uma resposta inválida.");
    const dados = await resposta.json();

    document.getElementById("temperatura").innerHTML = `${Math.round(dados.current.temperature_2m)}<span>°C</span>`;
    elementoCondicao.textContent = traduzirClima(dados.current.weather_code);
    document.getElementById("maxima").textContent = formatarTemperatura(dados.daily.temperature_2m_max[0]);
    document.getElementById("minima").textContent = formatarTemperatura(dados.daily.temperature_2m_min[0]);
    const chuva = dados.daily.precipitation_probability_max[0];
    document.getElementById("chuva").textContent = Number.isFinite(chuva) ? `${chuva}%` : "N/D";
    renderizarPrevisao(dados);
  } catch (erro) {
    console.error("Erro ao buscar dados meteorológicos:", erro);
    elementoCondicao.textContent = "Não foi possível carregar o clima.";
    const container = document.getElementById("horarios");
    container.innerHTML = '<p class="error-state">Não conseguimos acessar a previsão agora. Verifique sua conexão e atualize a página.</p>';
  }
}

atualizarData();
buscarClima();
