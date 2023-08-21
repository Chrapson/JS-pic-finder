import "./css/styles.css";

export const renderPics = (pics) => {
  return pics.data.hits
    .map(
      (pic) => `
    <div class="photo-card">
      <a href="${pic.largeImageURL}">
      <img src="${pic.webformatURL}" alt="${pic.tags}" loading="lazy"/></a>
      <div class="info">
      <p class="info-item">
        <b>Likes ${pic.likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${pic.views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${pic.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${pic.downloads}</b>
      </p>
    </div>
  </div>`
    )
    .join("");
};
