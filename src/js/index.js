import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const elements = {
    breedSelector: document.querySelector('.breed-select'),
    divCatInfo: document.querySelector('.cat-info'),
    loaderEl: document.querySelector('.loader'),
    errorEl: document.querySelector('.error'),
};
const { breedSelector, divCatInfo, loaderEl, errorEl } = elements;
divCatInfo.classList.add('is-hidden');

breedSelector.addEventListener('change', createMarkUp);

updateSelect();
function updateSelect(data) {
  fetchBreeds(data)
    .then(data => {
      loaderEl.classList.replace('loader', 'is-hidden');

      let markSelect = data.map(({ name, id }) => {
        return `<option value ='${id}'>${name}</option>`;
      });
      breedSelector.insertAdjacentHTML('beforeend', markSelect);
      new SlimSelect({
        select: breedSelector,
      });
      breedSelector.classList.remove('is-hidden');
    })
    .catch(onFetchError);
}

function createMarkUp(event) {
  loaderEl.classList.replace('is-hidden', 'loader');
  breedSelector.classList.add('is-hidden');
  divCatInfo.classList.add('is-hidden');

  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      loaderEl.classList.replace('loader', 'is-hidden');
      breedSelector.classList.remove('is-hidden');
      const { url, breeds } = data[0];

      divCatInfo.innerHTML = `<img src="${url}" alt="${breeds[0].name}" width="400"/><div class="box"><h2>${breeds[0].name}</h2><p>${breeds[0].description}</p><p><strong>Temperament:</strong> ${breeds[0].temperament}</p></div>`;
      divCatInfo.classList.remove('is-hidden');
    })
    .catch(onFetchError);
}

function onFetchError() {
  // breedSelector.classList.remove('is-hidden');
  loaderEl.classList.replace('loader', 'is-hidden');

  Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!'
  );
}