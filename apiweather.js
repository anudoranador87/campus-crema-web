  // asybgncronía para mostrar el clima en el widget del clima
async function myApiWeather(){ 
try{
const datos = await fetch ("https://api.openweathermap.org/data/2.5/weather?q=Malaga&appid=a7c274fbfdc82c83ec391428c873820b&units=metric&lang=es")    // esperando los datos
const jsonDatos = await datos.json();     // convertimos de json a objeto
const myClima = {name: jsonDatos.name ,temp:  jsonDatos.main.temp,description: jsonDatos.weather[0].description}

const clima = document.querySelector("#weather-widget")
clima.innerHTML = `📍 ${jsonDatos.name} · ${Math.round(jsonDatos.main.temp)}°C · ${jsonDatos.weather[0].description}`


}

catch(error){
console.log("Error, no se puede mostrar la información")
}
}


document.addEventListener('DOMContentLoaded', () => {
  myApiWeather();
});





