import "./css/styles.css";
import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { renderPics } from "./renderPics";

const inputEl = document.querySelector("input");
const API_KEY = "35926698-1ace8dd5b7966b45102d68e39";
const API_URL = `https://pixabay.com/api/?key=${API_KEY}`;
const searchButton = document.querySelector("#search-form button");
const loadButton = document.querySelector(".load-more");
const galleryEl = document.querySelector(".gallery");

const limitPerPage = 40;
let totalPages = 0;
let currentPage = 1;
loadButton.style.visibility = "hidden";

const fetchPics = async () => {
  const response = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: inputEl.value,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: "true",
      page: currentPage,
      per_page: limitPerPage,
    },
  });
  console.log(response);
  return response;
};
const loadPics = async () => {
  await fetchPics()
    .then((pics) => {
      const totalHits = pics.data.totalHits;
      if (pics.data.hits.length === 0) throw new Error();
      totalPages = Math.ceil(totalHits / limitPerPage);
      totalHits > 40
        ? (loadButton.style.visibility = "visible")
        : (loadButton.style.visibility = "hidden");
      galleryEl.innerHTML = renderPics(pics);
      Notiflix.Notify.success(
        `Hooray! We found ${pics.data.totalHits} images.`
      );
      let lightbox = new SimpleLightbox(".gallery a");
    })
    .catch((error) => {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
    });
};

const loadMore = async () => {
  currentPage++;
  await fetchPics()
    .then((pics) => {
      const totalHits = pics.data.total;
      if (totalHits / currentPage > 40) {
        loadButton.style.visibility = "visible";
      } else if (currentPage > totalPages) {
        loadButton.style.visibility = "hidden";
        throw new Error();
      }

      galleryEl.insertAdjacentHTML("beforeend", renderPics(pics));
    })
    .catch((error) => {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    });
  let lightbox = new SimpleLightbox(".gallery a");
  lightbox.refresh();
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
};
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  currentPage = 1;
  loadPics();
});
loadButton.addEventListener("click", () => {
  loadMore();
});
