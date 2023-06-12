import axios from 'axios'; // Importa la biblioteca Axios desde npm
import Notiflix from 'notiflix'; // Importa la biblioteca Notiflix desde npm
import SimpleLightbox from 'simplelightbox'; // Importa la biblioteca SimpleLightbox desde npm
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form'); // Obtiene el elemento del formulario de búsqueda
const gallery = document.querySelector('.gallery'); // Obtiene el elemento de la galería de imágenes
const loadMoreBtn = document.querySelector('.load-more'); // Obtiene el botón de cargar más imágenes
let page = 1; // Página actual de resultados de búsqueda
let searchQuery = ''; // Consulta de búsqueda ingresada por el usuario

searchForm.addEventListener('submit', async e => {
  e.preventDefault(); // Evita el comportamiento predeterminado de envío del formulario
  searchQuery = e.target.elements.searchQuery.value.trim(); // Obtiene la consulta de búsqueda del formulario y la almacena
  page = 1; // Reinicia la página a 1
  clearGallery(); // Limpia la galería de imágenes
  await fetchImages(); // Obtiene y muestra las imágenes correspondientes a la consulta
  showLoadMoreBtn(); // Muestra el botón de cargar más imágenes
});

loadMoreBtn.addEventListener('click', async () => {
  page++; // Incrementa la página para obtener los resultados de búsqueda siguientes
  await fetchImages(); // Obtiene y muestra más imágenes
});

async function fetchImages() {
  try {
    const apiKey = '37237543-aa08958e4f4ec45835618d6d1'; // Clave de API para acceder a la API de Pixabay
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page,
      },
    });

    const { hits, totalHits } = response.data; // Extrae los resultados y el total de resultados de la respuesta
    if (hits.length > 0) {
      renderImages(hits); // Renderiza las imágenes obtenidas
      if (page === 1) {
        showNotification(`Hooray! We found ${totalHits} images.`, 'success'); // Muestra una notificación de éxito si es la primera página de resultados
      }
    } else {
      showNotification(
        'Sorry, there are no images matching your search query. Please try again.',
        'warning'
      ); // Muestra una notificación de advertencia si no se encontraron imágenes
    }

    if (hits.length < 40) {
      hideLoadMoreBtn(); // Oculta el botón de cargar más si se alcanzó el final de los resultados
      showNotification(
        "We're sorry, but you've reached the end of search results.",
        'info'
      ); // Muestra una notificación informativa si se alcanzó el final de los resultados
    }
  } catch (error) {
    console.error(error);
    showNotification('An error occurred. Please try again later.', 'failure'); // Muestra una notificación de error si ocurrió un error en la solicitud
  }
}

function renderImages(images) {
  const photoCards = images.map(image => createPhotoCard(image)); // Crea las tarjetas de imágenes utilizando la función createPhotoCard
  gallery.insertAdjacentHTML('beforeend', photoCards.join('')); // Agrega las tarjetas de imágenes a la galería

  const lightbox = new SimpleLightbox('.gallery a'); // Crea una instancia de SimpleLightbox para las imágenes de la galería
  lightbox.refresh(); // Actualiza SimpleLightbox para que funcione correctamente con las nuevas imágenes agregadas

  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect(); // Obtiene la altura de la primera tarjeta de imagen en la galería
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  }); // Desplaza la ventana hacia abajo para mostrar las nuevas imágenes agregadas
}

function createPhotoCard(image) {
  return `
    <div class="photo-card">
      <a href="${image.largeImageURL}" data-lightbox="gallery">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `;
}

function clearGallery() {
  gallery.innerHTML = ''; // Limpia el contenido de la galería
}

function showLoadMoreBtn() {
  // loadMoreBtn.style.textAlign = 'right';
  loadMoreBtn.style.display = 'block'; // Muestra el botón de cargar más imágenes
}

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none'; // Oculta el botón de cargar más imágenes
}

function showNotification(message, type) {
  switch (type) {
    case 'success':
      Notiflix.Notify.success(message, {
        position: 'bottom-right',
        timeout: 3000,
        borderRadius: '3px',
      }); // Muestra una notificación de éxito
      break;
    case 'warning':
      Notiflix.Notify.warning(message, {
        position: 'bottom-right',
        timeout: 3000,
        borderRadius: '3px',
      }); // Muestra una notificación de advertencia
      break;
    case 'info':
      Notiflix.Notify.info(message, {
        position: 'bottom-right',
        timeout: 3000,
        borderRadius: '3px',
      }); // Muestra una notificación informativa
      break;
    case 'failure':
      Notiflix.Notify.failure(message, {
        position: 'bottom-right',
        timeout: 3000,
        borderRadius: '3px',
      }); // Muestra una notificación de error
      break;
    default:
      Notiflix.Notify.info(message, {
        position: 'bottom-right',
        timeout: 3000,
        borderRadius: '3px',
      }); // Muestra una notificación por defecto (informativa)
  }
}
