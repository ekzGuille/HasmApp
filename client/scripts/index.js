// const API_URL = `https://hasmapp-api.herokuapp.com`;
const API_URL = `http://localhost:5000`;
const cors_headers = {
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};

const inputTexto = document.getElementById('texto');
const cargando = document.getElementById('cargandoGif');
const noEncontrado = document.getElementById('noEncontrado');
const div = document.getElementById('resultados');
const divCategorias = document.getElementById('categorias');

async function buscar(e = undefined) {
  if (e){
    e.preventDefault();
  }
  div.innerHTML = '';
  const texto = inputTexto.value;
  if (!texto) {
    return;
  }
  cargando.style.display = 'block';
  noEncontrado.style.display = 'none';
  const docsPromise = await fetch(`${API_URL}/api/ver_imagenes/${texto}`, cors_headers);
  try {
    const { docs } = await docsPromise.json();
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

(async function () {
  const categoriasPromise = await fetch(`${API_URL}/api/obtener_categorias`, cors_headers);
  const { categorias } = await categoriasPromise.json();
  
  categorias.map((cat) => {
    const anchor = document.createElement('a');
    anchor.innerText = cat.key;
    anchor.setAttribute('class', 'a-categoria two columns');
    anchor.addEventListener('click', () => {
      const val = anchor.innerText;
      inputTexto.value = val;
      buscar();
    });
    divCategorias.appendChild(anchor);
  });
})()