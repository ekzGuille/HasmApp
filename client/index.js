const API_URL_NOW = `https://hasmappapi.now.sh`;
const API_URL_HEROKU = `https://hasmapp-api.herokuapp.com`;
// const API_URL = `http://localhost:5000;
let API_URL = API_URL_HEROKU;
const cors_headers = {
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};
const input = document.getElementById('texto');
const cargando = document.getElementById('cargandoGif');
const noEncontrado = document.getElementById('noEncontrado');
const div = document.getElementById('resultados');
async function buscar(e) {
  e.preventDefault();
  div.innerHTML = '';
  const texto = input.value;
  if (!texto) {
    return;
  }
  cargando.style.display = 'block';
  noEncontrado.style.display = 'none';
  const jsonData = await fetch(`${API_URL}/api/ver_imagenes/${texto}`, cors_headers);
  try {
    const { docs } = await jsonData.json();
    div.innerHTML = '';
    cargando.style.display = 'none';
    if (docs.length === 0) {
      noEncontrado.style.display = 'block';
      return;
    }
    docs.map(({ fileName, image }) => {
      const img = document.createElement('img');
      img.src = image;
      img.alt = fileName;
      img.className = 'imagen'
      div.appendChild(img);
    });
  } catch (e) {
    console.error(e);
    cargando.style.display = 'none';
    noEncontrado.style.display = 'block';
  }
}