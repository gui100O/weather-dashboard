import requests

url = "https://api.open-meteo.com/v1/forecast"

parametros = {
    "latitude": -22.58,
    "longitude": -44.96,
    "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    "timezone": "America/Sao_Paulo"
}

resposta = requests.get(url, params=parametros)

dados = resposta.json()

codigo = dados["daily"]["weather_code"][0]


def traduzir_clima(codigo):
    if codigo == 0:
        return "Ensolarado"
    elif codigo in [1, 2]:
        return "Parcialmente nublado"
    elif codigo == 3:
        return "Nublado"
    elif codigo in [61, 63, 65]:
        return "Chuvoso"
    else:
        return "Condição desconhecida"


clima = traduzir_clima(codigo)

maxima = dados["daily"]["temperature_2m_max"][0]
minima = dados["daily"]["temperature_2m_min"][0]
chuva = dados["daily"]["precipitation_probability_max"][0]


print("Bom dia!")
print("Cruzeiro - SP")
print()

print(f"Máxima: {maxima}°C")
print(f"Mínima: {minima}°C")
print(f"Chance de chuva: {chuva}%")
print(f"Condição: {clima}")