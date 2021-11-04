// Main constants
const cardContainer = document.getElementById("card-grid-container");
const apiKey = "912ff9d8e7e14450a9323db86c7eaecf";
const url = "https://api.rawg.io/api/games";
const urlKey = `${url}?key=${apiKey}`;
const main = document.getElementById("main");
const modalOpen = false;
var idGlobal = [];
let singleColumnGrid = false;
let singleColumnGridOnclick = false;
var page;
var loadCardComplete = false;
let loadpage = false;
window.addEventListener("load", pageStarted);

function pageStarted() {
  document.querySelector(".icon_search").addEventListener("click", searchGame);
  document.getElementById("search-input").addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === 13) {
      searchGame();
    }
  });
  document.querySelectorAll("#home")[0].addEventListener("click", (e) => {
    e.preventDefault();
    homeGame();
  });
  document.querySelectorAll("#home")[1].addEventListener("click", (e) => {
    e.preventDefault();
    homeGame();
  });
  document.querySelectorAll(".week")[0].addEventListener("click", (e) => {
    e.preventDefault();
    thisWeek();
  });
  document.querySelectorAll(".week")[1].addEventListener("click", (e) => {
    e.preventDefault();
    thisWeek();
  });
  document.querySelectorAll(".month")[0].addEventListener("click", (e) => {
    e.preventDefault();
    thisMonth();
  });
  document.querySelectorAll(".month")[1].addEventListener("click", (e) => {
    e.preventDefault();
    thisMonth();
  });
  document.querySelector(".hamburguer").addEventListener("click", openNav);
  document.querySelector(".exit-nav").addEventListener("click", closeNav);
}

const additionalHeader = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Matias Garcia BFEDA",
  },
};
const pagesCounter = 1;

// Get the informtion from the api
document.querySelector(".loader-cards").style.display = "block";
fetch(urlKey)
  .then((res) => res.json())
  .then((resultApi) => {
    console.log(resultApi);
    cardsCreation(resultApi);
    changeColumnsButton(resultApi);
    infiniteScroll();
  })
  .catch((error) => {
    console.log("failed to get the information of the games");
  });



async function getGamesInformation(url, info) {
  const result = await fetch(url, info);
  if (result.status === 200) {
    const apidata = await result.json();
    return apidata;
  } else {
    console.log("failed to get the information of the games");
  }
}

//     Create cards
let createcard = ``;
async function cardsCreation(cardinfo) {
  page = cardinfo.next;
  loadCardComplete = false;
  for (let k = 0; k < cardinfo.results.length; k++) {
    let actualCard = cardinfo.results[k];
    createcard = `<li class='cards-style'>
        <button class='card-interact-button' id='button' onclick=showModalEvent(${
          actualCard.id
        })>
            <img class='image-card' src='${
              actualCard.background_image
            }' alt='games'>
            <div class="bottom-info-card">
                                    <div class="title-plataform-container">
                                        <p class="game-title" id="title">${
                                          actualCard.name
                                        }</p>
                                        <div class="platforms-icons">${platformSelector(
                                          actualCard
                                        )}</div>
                                    </div>
                                    <div class="date-gif">
                                        <div class="date-container">
                                            <div>
                                            <div class="text-container">
                                                <p class="release text-grid">Release date</p>
                                                <p class="date text-grid">${dateRelease(
                                                  actualCard
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                            <div>
                                            <div class="text-container">
                                                <p class="text-grid">Genres</p>
                                                <p class="text-grid" id="genres">${showGenres(
                                                  actualCard
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                        </div>
                                        <div class="number-gif">
                                            <p class="number-game">#${k + 1}</p>
                                            <div class="gif"><span class="plus">+</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3 1.11929 4.11929 0 5.5 0C6.88071 0 8 1.11929 8 2.5C8 1.11929 9.11929 0 10.5 0C11.8807 0 13 1.11929 13 2.5V2.506C13 2.576 13 2.776 12.962 3H15C15.5523 3 16 3.44772 16 4V5C16 5.55228 15.5523 6 15 6H1C0.447715 6 0 5.55228 0 5V4C0 3.44772 0.447715 3 1 3H3.038C3.01159 2.83668 2.99888 2.67144 3 2.506V2.5ZM4.068 3H7V2.5C7 1.9641 6.7141 1.46891 6.25 1.20096C5.7859 0.933013 5.2141 0.933013 4.75 1.20096C4.2859 1.46891 4 1.9641 4 2.5C4 2.585 4.002 2.774 4.045 2.93C4.05101 2.95385 4.05869 2.97724 4.068 3ZM11.932 3H9V2.5C9 1.67157 9.67157 1 10.5 1C11.3284 1 12 1.67157 12 2.5C12 2.585 11.998 2.774 11.955 2.93C11.9489 2.95381 11.9412 2.9772 11.932 3ZM15 7V14.5C15 15.3284 14.3284 16 13.5 16H9V7H15ZM1 14.5C1 15.3284 1.67157 16 2.5 16H7V7H1V14.5Z" fill="white"/>
                                                </svg>
                                                </div>
                                        </div>
                                    </div>
                        </div>
                        <div class="description-column"></div>
        </button>
        </li>`;
    document.querySelector("#card-grid-container").innerHTML += createcard;
    idGlobal.push(actualCard.id);
  }
  loadCardComplete = true;
  document.querySelector(".loader-cards").style.display = "none";
  descriptionText(idGlobal);
}

async function descriptionText(id){
  let descriptionContainer = document.querySelectorAll(".description-column");
  for (let e = 0 ; e < descriptionContainer.length; e ++) {
    descriptionContainer[e].innerHTML += await description(id[e])
  }
}

// Platforms icons in the card
function platformSelector(cardicons) {
  let platformSelected = "";
  if (!!cardicons.parent_platforms) {
    for (let f = 0; f < cardicons.parent_platforms.length; f++) {
      let platform = cardicons.parent_platforms[f].platform;
      if (platform.slug.indexOf("ios") === 0) {
        platformSelected += `<svg class="svg-space" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 18'><path fill='#FFF' d='M9.538 0H1.651C.896 0 .287.587.287 1.31v15.368c0 .723.61 1.31 1.364 1.31h7.887c.754 0 1.364-.587 1.364-1.31V1.31c0-.723-.61-1.31-1.364-1.31zm-5.89.796h3.894c.098 0 .178.14.178.315 0 .174-.08.316-.178.316H3.648c-.099 0-.177-.142-.177-.316 0-.174.078-.315.177-.315zm1.947 15.898c-.48 0-.87-.375-.87-.836 0-.462.39-.835.87-.835s.87.373.87.835c0 .461-.39.836-.87.836zM9.88 13.83H1.31V2.21h8.57v11.62z'/></svg>`;
        continue;
      }
      if (platform.slug.indexOf("mac") === 0) {
        platformSelected += `<svg class="svg-space" width="15" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 22.773 22.773" xml:space="preserve" fill="white">
                <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573
            c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                <path
                    d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334
            c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0
            c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019
            c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464
            c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648
            c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
            </svg>`;
        continue;
      }

      if (platform.slug.indexOf("nintendo") === 0) {
        platformSelected += `<svg class="svg-space" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.67443 13H7.67506C7.62406 13 7.58325 12.9591 7.58325 12.908V0.081761C7.58325 0.0408805 7.61385 0 7.66486 0H9.67443C11.5106 0 12.9999 1.49214 12.9999 3.33176V9.66824C12.9999 11.5079 11.5106 13 9.67443 13ZM11.4596 7.15409C11.4596 6.42846 10.8679 5.83569 10.1437 5.83569C9.41941 5.83569 8.83796 6.42846 8.82776 7.15409C8.82776 7.87972 9.41941 8.47248 10.1437 8.47248C10.8679 8.47248 11.4596 7.87972 11.4596 7.15409Z" fill="white"/>
                <path d="M2.16675 4.33333C2.16675 4.92917 2.65425 5.41667 3.25008 5.41667C3.84591 5.41667 4.33341 4.92917 4.33341 4.33333C4.33341 3.7375 3.84591 3.25 3.25008 3.25C2.64522 3.25 2.16675 3.72847 2.16675 4.33333Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.45677 0H6.40457C6.45759 0 6.5 0.0408805 6.5 0.0919811V12.908C6.5 12.9591 6.45759 13 6.40457 13H3.45677C1.54812 13 0 11.5079 0 9.66824V3.33176C0 1.49214 1.54812 0 3.45677 0ZM3.45677 11.9575H5.41843V1.04245H3.45677C2.82055 1.04245 2.22675 1.28774 1.7814 1.71698C1.32545 2.14623 1.08157 2.71855 1.08157 3.33176V9.66824C1.08157 10.2814 1.33605 10.8538 1.7814 11.283C2.22675 11.7225 2.82055 11.9575 3.45677 11.9575Z" fill="white"/>
                </svg>
                `;
        continue;
      }

      if (platform.slug.indexOf("xbox") === 0) {
        platformSelected += `<svg class="svg-space" width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.5 0C7.75357 0 8.79048 0.40056 9.73452 1.07423C9.75 1.07423 9.75 1.09244 9.75 1.11064C9.75 1.12885 9.73452 1.12885 9.71905 1.12885C8.5119 0.819328 6.68571 2.03922 6.51548 2.16667H6.5H6.48452C6.31429 2.03922 4.4881 0.819328 3.28095 1.12885C3.26548 1.12885 3.25 1.12885 3.25 1.11064C3.25 1.09244 3.25 1.07423 3.26548 1.07423C4.20952 0.40056 5.24643 0 6.5 0ZM10.6537 11.4392C11.6287 10.4302 8.40504 6.86712 6.5023 5.41667C6.5023 5.41667 6.48658 5.41667 6.48658 5.43243C4.59957 6.86712 1.3602 10.4302 2.35088 11.4392C3.45164 12.4167 4.91407 13 6.5023 13C8.09054 13 9.53724 12.4167 10.6537 11.4392ZM1.78082 2.19751C1.7734 2.19751 1.76969 2.20158 1.76598 2.20566C1.76227 2.20973 1.75856 2.2138 1.75114 2.2138C0.667808 3.40327 0 5.04896 0 6.8576C0 8.34035 0.460046 9.72534 1.21689 10.817C1.21689 10.8333 1.23174 10.8333 1.24658 10.8333C1.26142 10.8333 1.26142 10.817 1.24658 10.8007C0.78653 9.25282 3.11644 5.52149 4.31849 3.95726L4.33333 3.94097C4.33333 3.93257 4.33333 3.9285 4.3313 3.92653C4.32939 3.92467 4.32568 3.92467 4.31849 3.92467C2.49315 1.93681 1.8847 2.14863 1.78082 2.19751ZM8.66667 3.93424L8.68151 3.91793C10.5068 1.94443 11.1153 2.15646 11.2043 2.18908C11.2105 2.18908 11.2141 2.18908 11.2173 2.19025C11.2217 2.1919 11.2253 2.19586 11.234 2.20539C12.3322 3.39602 13 5.04332 13 6.85372C13 8.33792 12.54 9.72426 11.7831 10.817C11.7831 10.8333 11.7683 10.8333 11.7534 10.8333V10.8007C12.1986 9.25127 9.88356 5.5163 8.68151 3.95055C8.66667 3.95055 8.66667 3.93424 8.66667 3.93424Z"
                    fill="white" />
            </svg>`;
        continue;
      }
      if (platform.slug.indexOf("pc") === 0) {
        platformSelected += `<svg class="svg-space" width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M13 5.95833H5.95833V0.998704L13 0V5.95833ZM5.41667 1.08333V5.95833H0V1.80612L5.41667 1.08333ZM5.41667 6.5H0V11.1145L5.41667 11.9167V6.5ZM5.95833 11.912V6.5H13V13L5.95833 11.912Z"
                    fill="white" />
            </svg>`;
        continue;
      }
      if (platform.slug.indexOf("playstation") === 0) {
        platformSelected += `<svg class="svg-space" width="17" heigth="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg" fill="white">
                <path
                    d="M6.5 0.149317L6.5 12.0296L9.07955 12.8818L9.07955 2.92038C9.07955 2.45098 9.28024 2.13932 9.60212 2.2465C10.023 2.36823 10.1048 2.80063 10.1048 3.2648L10.1048 7.24326C11.7104 8.05369 12.9745 7.24283 12.9745 5.10456C12.9745 2.91953 12.2334 1.94614 10.0527 1.16352C9.19249 0.864854 7.59836 0.360857 6.5 0.149317Z" />
                <path
                    d="M9.75 11.1429L13.6492 9.45771C14.0903 9.25915 14.1578 8.9894 13.8008 8.84764C13.4382 8.70325 12.791 8.74457 12.3452 8.93895L9.75 10.0506V8.27688L9.89861 8.21729C9.89861 8.21729 10.6498 7.89415 11.7064 7.75502C12.7609 7.61465 14.0541 7.77328 15.0706 8.2385C16.2156 8.68019 16.3439 9.32446 16.0542 9.77281C15.7603 10.2165 15.0478 10.5375 15.0478 10.5375L9.75 12.8484" />
                <path
                    d="M1.18907 11.3389C-0.0278308 10.9683 -0.230758 10.1851 0.324385 9.73273C0.836458 9.31962 1.70854 9.00863 1.70854 9.00863L5.31353 7.60333L5.31353 9.20276L2.72172 10.2185C2.26263 10.398 2.1938 10.6507 2.56358 10.7828C2.93997 10.9203 3.60794 10.8834 4.0673 10.698L5.31353 10.2068V11.6346C5.23321 11.6494 5.1439 11.6642 5.06238 11.6794C3.81985 11.9049 2.49607 11.8123 1.18907 11.3389Z" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M16.1271 12.7978C16.0247 12.8989 15.8903 12.9561 15.7455 12.9561C15.6008 12.9561 15.462 12.8989 15.3594 12.7978C15.2582 12.6948 15.2021 12.5603 15.2021 12.4154C15.2021 12.1153 15.4451 11.8727 15.7455 11.8727C15.8903 11.8727 16.0247 11.928 16.1271 12.0314C16.2284 12.1324 16.2855 12.2692 16.2855 12.4154C16.2855 12.5603 16.2284 12.6948 16.1271 12.7978ZM15.2934 12.4154C15.2934 12.292 15.3396 12.1788 15.4239 12.095C15.5104 12.0092 15.6257 11.963 15.7455 11.963C15.8655 11.963 15.9779 12.0092 16.0622 12.095C16.1473 12.1788 16.1932 12.292 16.1932 12.4154C16.1932 12.6627 15.9922 12.8634 15.7455 12.8634C15.6257 12.8634 15.5104 12.8177 15.4239 12.7331C15.3396 12.6477 15.2934 12.5358 15.2934 12.4154ZM15.9927 12.6405C15.9976 12.6544 16.0034 12.6627 16.0118 12.6651L16.0193 12.6694V12.7038H15.9018L15.8996 12.6969L15.8916 12.6761C15.8903 12.6651 15.8887 12.6508 15.8871 12.6267L15.8819 12.5325C15.8805 12.4991 15.8696 12.4796 15.8494 12.4667C15.8345 12.4617 15.8141 12.4579 15.7837 12.4579H15.6205V12.7038H15.5134V12.0997H15.7941C15.8399 12.0997 15.8785 12.1078 15.908 12.1204C15.9672 12.1482 15.9976 12.1984 15.9976 12.269C15.9976 12.3037 15.9889 12.3362 15.9741 12.3601C15.9612 12.377 15.946 12.3924 15.9295 12.4075L15.9339 12.4106C15.9451 12.4185 15.9563 12.4263 15.9628 12.4378C15.9778 12.4543 15.9846 12.482 15.9858 12.5177L15.9885 12.5946C15.9889 12.6143 15.9905 12.6296 15.9927 12.6405ZM15.8661 12.3435C15.8835 12.3323 15.8916 12.31 15.8916 12.276C15.8916 12.2401 15.8792 12.2162 15.8549 12.2042C15.8399 12.1984 15.8214 12.1942 15.7964 12.1942H15.6205V12.3639H15.7867C15.8198 12.3639 15.846 12.3571 15.8661 12.3435Z" />
                </svg>`;
        continue;
      }
      if (platform.slug.indexOf("linux") === 0) {
        platformSelected += `<svg class="svg-space" width="15" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 841.9 980" xml:space="preserve" fill="white">
                <path class="st0"
                    d="M617.9,980c-5.7,0-11.3,0-17,0c-5-1.2-10-2.1-14.9-3.7c-17.7-5.7-28.4-19.1-37-34.6c-1.5-2.7-3.2-4.2-6.3-4.9
            c-72.9-16.9-145.5-12.8-218.1,2.1c-1.5,0.3-3.2,1.7-4,3c-14.4,24.7-37.5,35.3-65.9,30.6c-23-3.8-44.7-11.5-66.5-19.3
            c-24.9-8.9-49.5-18.9-75.6-23.7c-18-3.3-36.2-5.4-54.2-8.7c-14.3-2.6-28.3-6.4-40.7-14.3c-13.2-8.4-16.7-18.4-12-33.4
            c3.1-10,6.3-20,9.5-30c5.1-15.7,5.5-31.3-0.1-47c-1.7-4.7-2.7-9.6-3.6-14.5c-4-21.5,4.9-35.7,25.8-41.6c1.6-0.5,3.2-0.7,4.9-1.2
            c11.1-2.9,22.3-5.4,33.2-9c16.4-5.5,30.3-14.7,38.2-30.8c5.9-12,12.8-23,25.1-29.4c-5.3-15.7-6.3-31.5-1.6-47
            c3.1-10.1,8.7-19.4,12.6-29.3c9.6-24.8,19.6-49.5,27.9-74.8c14.2-42.8,34.6-82,62.9-117.2c14.3-17.8,27.3-36.6,40.9-54.9
            c4.7-6.3,8-13.3,8.4-21.1c1.1-21.1,2.9-42.3,2.2-63.3c-1-31.1-4-62.2-5.7-93.3c-1.4-25-0.3-50,5.5-74.5c6.3-26,18-48.7,40.7-64.3
            C350.3,18,369.7,9.7,390.5,5c9.4-2.1,18.9-3.4,28.4-5c8.7,0,17.3,0,26,0c1.3,0.3,2.5,0.8,3.8,0.9c46.2,5.2,81.7,27.1,104.8,67.7
            c19.2,33.8,27.6,70.9,30.3,109.3c1.9,26.9,2.4,53.9,4.2,80.8c2,30.5,10.9,58.6,29.3,83.6c17.6,23.9,34.4,48.3,51.1,72.8
            c25.9,38,50.9,76.5,70.9,118c11.7,24.3,18.7,49.7,18.9,76.9c0.2,24.6-2.8,48.8-8.6,72.7c-0.5,1.9-0.1,4.8,1.1,6.1
            c14.1,15.3,21.3,32.9,20.6,54c-0.5,16.2,5.4,30.4,18.4,40.3c8.6,6.6,18.4,11.9,28.2,16.6c20.9,10.1,26.6,31.7,12.7,50.3
            c-6.2,8.3-14.6,14.1-23.5,19c-23.3,12.8-46.8,25.4-70,38.6c-26.7,15.2-52.7,31.1-74.7,53.1c-5.4,5.4-12.6,9.4-19.7,12.4
            C634.9,976.3,626.2,977.7,617.9,980z M311.9,304.5c0.3,1.8,0.6,3.5,0.8,5.1c0.2,1.8,0.3,3.7,0.2,5.5c-1.2,32.2-12.4,60.6-31.8,86.1
            c-3.3,4.3-6.9,8.8-9,13.7c-7.4,17.8-14.5,35.7-21.2,53.8c-7.6,20.6-13.6,41.9-24.9,60.9c-19.9,33.5-28.2,69.8-27.1,108.4
            c0.7,23.2,7.9,43.8,25.9,59.6c8.9,7.8,17.7,15.7,26.8,23.2c16.5,13.5,33.4,26.5,49.5,40.4c6.2,5.3,11.7,12,15.9,19
            c8.2,13.7,3.2,31.4-10.6,39.6c-4,2.3-8.4,3.9-12.7,5.8c0.1,0.2,0.2,0.7,0.5,1.1c12.7,14.6,25.3,29.2,38.2,43.6
            c1.3,1.5,4,2.3,6.1,2.6c21.4,2.9,42.9,2.8,64.3,0.8c18.4-1.7,37-3.2,54.8-7.5c43.3-10.5,76.5-36.9,104.4-70.7
            c1.3-1.6,1.7-4.2,1.8-6.4c0.4-16.5,0.4-33,1.1-49.5c0.6-14.6,1.9-29.2,3.2-43.8c0.6-6.7,4.4-12.1,10.9-13.5
            c6.9-1.5,14.1-1.4,21.2-1.7c2.5-0.1,5.1,0.6,7.7,1c0.4-1.2,0.6-1.9,0.7-2.5c11.9-50.3,11.6-100.2-4.6-149.7
            c-18.8-57.3-42-112.9-67.1-167.6c-9.6-21-20.3-41.5-30.8-62.1c-3.1-6.2-5.1-6.6-11.8-4.7c-1.8,0.5-3.6,0.9-5.2,1.8
            c-12.3,6.3-24.6,12.6-36.8,19c-18.7,9.9-37.2,20.1-55.9,29.8c-10.6,5.5-21.8,5.3-32.2-0.2c-9.4-4.9-18.5-10.6-26.8-17.1
            C328.7,321.1,320.8,312.7,311.9,304.5z M258.4,946c4.1-1.1,9.1-1.1,12.1-3.5c7.6-6.1,15-12.8,21.1-20.3c8.9-10.9,10.4-23.8,6.4-37.3
            c-4.2-14-12.4-25.6-21.5-36.8c-8.5-10.5-17.1-20.9-24.4-32.2c-16.7-26.1-32-53-48.9-79c-7.4-11.3-16.8-21.4-25.9-31.5
            c-3.7-4.1-8.8-7.1-13.8-9.7c-8.4-4.4-14.3-3-20.1,4.6c-3,3.9-5.4,8.4-7.8,12.8c-3.5,6.4-6.6,13.1-10.2,19.4
            c-5.1,8.9-12.6,15-22.6,17.7c-6.6,1.8-13.2,3.3-19.8,5c-9.8,2.6-19.7,5-29.3,8.1c-8,2.6-11.7,8.5-10.8,17c0.6,5.3,1.2,10.6,2.4,15.8
            c3.5,14.8,3.3,29.3-1.3,43.8c-3.2,10-6.3,20.1-8.1,30.3c-2,11.6,1,16.3,12.3,19c16.5,3.9,33.2,7.1,49.9,9.9
            c24.3,4.1,48.3,8.9,71,19.3c13.6,6.2,27.8,11.1,41.9,16.1C226.4,939.7,241.9,944.4,258.4,946z M613.3,711.1
            c-1.3-0.1-2.8-0.4-4.3-0.4c-8.8-0.1-12.3,2.8-12.8,11.5c-0.3,5.8,0.1,11.7,0.3,17.5c0.6,18,3.1,36.1,1.5,53.8
            c-2.3,25.3-7.3,50.4-11.8,75.4c-2.5,14-5.1,27.8-2.3,42.1c6.5,32.8,30.7,44.6,60,29.1c14.6-7.7,26.9-18.3,38.7-29.7
            c5.7-5.5,11.6-11.3,18.4-15.3c23.7-13.8,47.9-26.7,71.9-40.1c9.6-5.4,19.2-10.6,28.4-16.7c6.4-4.2,6.7-10.1,1.5-15.8
            c-2.7-2.9-5.8-5.6-9.1-7.7c-5.6-3.6-11.3-7.1-17.3-10c-12.8-6.1-20.8-16.2-25.8-29.1c-3.9-9.9-5.3-20.2-5-30.8
            c0.2-9.1-2.3-17.2-10.3-22.8c-0.5,0.4-0.7,0.5-0.8,0.6c-1.4,2.5-2.8,4.9-4.2,7.4c-9.6,17.8-23.4,30.6-43.1,36.4
            c-7.8,2.3-15.8,4.6-23.8,5.2c-27.7,2-43.1-8.3-48-35.6C614.2,728,614,719.8,613.3,711.1z M385.5,327.4c5.2-1.8,10.9-2.9,15.7-5.5
            c25.6-14.1,51.1-28.6,76.4-43.2c7.1-4.1,7.7-11.2,1.5-16.6c-4.5-3.9-9.6-7.4-15-9.6c-19.6-7.9-39.5-15-59.1-22.8
            c-10.2-4.1-19.5-2.6-28.4,3.1c-2,1.3-4.1,2.3-5.9,3.8c-14.8,11.9-29.6,23.7-44.2,35.8c-1.5,1.2-2.4,4.8-1.8,6.5
            c1.6,4.3,3.8,8.6,6.7,12c11.6,13.6,26.6,23,41.8,32.1C376.7,325.1,380.9,325.8,385.5,327.4z M438.4,219.1c0.3-0.7,0.4-0.9,0.4-1
            c-0.5-1.4-1-2.8-1.4-4.2c-3-10.3-2.8-20.5,2.1-30.1c4.3-8.5,10.5-14.8,20.8-14.8c10.2,0,16.5,6.3,20.8,14.8
            c8.3,16.6,4.1,34.8-10.8,47.9c13.1,6.6,10.7,7.8,20.9-2.5c22.6-22.8,21.9-66-0.9-88.6c-15.9-15.8-38.6-17.3-55.7-3.3
            c-21,17.1-26.1,48.6-17,72.1c0.5,1.2,1.8,2.3,3,2.9C426.4,214.5,432.3,216.8,438.4,219.1z M353.9,220.5c5-3.5,9.1-7.7,14-9.6
            c6.6-2.5,8.4-6.9,8.6-13.2c0.9-18.4-2.3-35.6-14.8-49.9c-12.7-14.6-31.3-14.6-44.4-0.3c-1.8,2-3.6,4-4.9,6.3
            c-14.1,24.9-14.5,50.1-0.2,74.9c3,5.3,8.5,9.1,13,13.4c0.8,0.8,3.2,1.3,3.9,0.7c4.4-3.4,8.6-7.2,12.5-10.6c-4.1-1.4-8-2-11.1-3.9
            c-14.6-9.2-19.2-37.5-8.6-51.2c5.5-7.1,13.8-8.9,20.5-3.1c4.7,4.1,8.6,9.7,11.2,15.4C358.2,199.3,357.9,209.8,353.9,220.5z" />
            </svg>`;
        continue;
      }
      if (platform.slug.indexOf("android") === 0) {
        platformSelected += `<svg class="svg-space" width="15" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 475.071 475.071" style="enable-background:new 0 0 475.071 475.071;"
                xml:space="preserve" fill="white">
                <path d="M65.947,153.884c-8.183,0-15.136,2.853-20.844,8.566c-5.708,5.711-8.564,12.562-8.564,20.555v122.772
            c0,8.179,2.855,15.126,8.564,20.837c5.708,5.712,12.657,8.562,20.841,8.562c8.186,0,15.085-2.851,20.699-8.562
            c5.618-5.711,8.425-12.658,8.425-20.837V183.005c0-7.996-2.857-14.847-8.565-20.555C80.794,156.74,73.939,153.884,65.947,153.884z
            " />
                <path d="M106.494,349.457c0,8.754,3.046,16.177,9.136,22.269c6.091,6.085,13.512,9.13,22.27,9.13h21.128l0.288,64.81
            c0,8.186,2.855,15.129,8.564,20.841c5.708,5.711,12.562,8.565,20.555,8.565c8.188,0,15.133-2.854,20.844-8.565
            c5.711-5.712,8.564-12.655,8.564-20.841v-64.81h39.397v64.81c0,8.186,2.854,15.129,8.562,20.841
            c5.715,5.711,12.662,8.565,20.848,8.565c8.179,0,15.126-2.854,20.834-8.565c5.708-5.712,8.559-12.655,8.559-20.841v-64.81h21.416
            c8.56,0,15.89-3.039,21.98-9.13c6.092-6.092,9.138-13.515,9.138-22.269V159.308H106.494V349.457z" />
                <path d="M302.345,43.682L322.61,6.279c1.335-2.474,0.855-4.377-1.424-5.708c-2.478-1.143-4.38-0.572-5.708,1.714L294.918,39.97
            c-18.082-7.994-37.205-11.991-57.384-11.991c-20.174,0-39.304,3.997-57.387,11.991L159.591,2.286
            c-1.328-2.286-3.234-2.857-5.708-1.714c-2.285,1.331-2.758,3.234-1.426,5.708l20.271,37.402
            c-20.559,10.467-36.923,25.076-49.108,43.824c-12.181,18.749-18.273,39.259-18.273,61.525h264.095
            c0-22.266-6.091-42.777-18.273-61.525C338.982,68.758,322.717,54.148,302.345,43.682z M185.144,98.068
            c-2.187,2.19-4.803,3.284-7.849,3.284c-3.046,0-5.614-1.093-7.71-3.284c-2.091-2.187-3.14-4.805-3.14-7.85
            c0-3.046,1.049-5.664,3.14-7.854c2.093-2.19,4.665-3.282,7.71-3.282c3.042,0,5.659,1.091,7.849,3.282
            c2.19,2.19,3.284,4.808,3.284,7.854C188.428,93.264,187.334,95.878,185.144,98.068z M305.489,98.068
            c-2.098,2.19-4.668,3.284-7.713,3.284c-3.046,0-5.657-1.093-7.848-3.284c-2.19-2.187-3.281-4.805-3.281-7.85
            c0-3.046,1.091-5.664,3.281-7.854c2.19-2.19,4.802-3.282,7.848-3.282c3.045,0,5.615,1.091,7.713,3.282
            c2.088,2.19,3.139,4.808,3.139,7.854C308.628,93.264,307.58,95.878,305.489,98.068z" />
                <path d="M429.964,162.306c-5.708-5.614-12.655-8.422-20.841-8.422c-7.991,0-14.843,2.808-20.551,8.422
            c-5.711,5.616-8.568,12.517-8.568,20.699v122.772c0,8.179,2.857,15.126,8.568,20.837c5.708,5.712,12.56,8.562,20.551,8.562
            c8.186,0,15.133-2.851,20.841-8.562c5.715-5.711,8.568-12.658,8.568-20.837V183.005
            C438.532,174.822,435.679,167.921,429.964,162.306z" />
            </svg>`;
        continue;
      }
    }
  }
  return platformSelected;
}

// Cards release date
function dateRelease(date) {
  const actualDate = new Date(date.released).toString().split(" ");

  return `${actualDate[1]} ${actualDate[2]} ${actualDate[3]}`;
}

// Cards genres
function showGenres(cardGenres) {
  let genre = cardGenres.genres;
  let genreactual = "";
  for (let x = 0; x < genre.length; x++) {
    genreactual += genre[x].name;
    if (x != genre.length - 1) {
      genreactual += ",";
    }
  }
  return `${genreactual}`;
}

// Modal event in the cards
async function showModalEvent(id) {
  let modaltitle;
  let modalimg;
  let modalreleasedate;
  let modalgenres = "";
  let modalplatforms = [];
  let modaldescription;
  let rank;
  const modalinfo = await getInfoWithID(id);
  const ingamepics = await gamePicsFromTheApi(modalinfo.slug);

  let cardallinfo = document.querySelectorAll(".card-interact-button");
  for (let f = 0; f < cardallinfo.length; f++) {
    if (cardallinfo[f].getAttribute("onclick") === `showModalEvent(${id})`) {
      // Title
      modaltitle = cardallinfo[f].querySelector(".game-title").textContent;
      // backgound img
      modalimg = cardallinfo[f].querySelector(".image-card").currentSrc;
      //release date
      modalreleasedate = cardallinfo[f].querySelector(".date").textContent;
      //genres
      modalgenres = cardallinfo[f].querySelector("#genres").textContent;
      //platmfoms
      modalplatforms.push(
        cardallinfo[f].querySelector(".platforms-icons").innerHTML
      );
      modaldescription = await description(id);
      rank = cardallinfo[f].querySelector(".number-game").textContent;
    }
  }
  document
    .querySelector(".game-picture")
    .setAttribute("src", `${ingamepics[0]}`);
  document.querySelector("#picture-n1").setAttribute("src", `${ingamepics[1]}`);
  document.querySelector("#picture-n2").setAttribute("src", `${ingamepics[2]}`);
  document.querySelector("#picture-n3").setAttribute("src", `${ingamepics[3]}`);
  document.querySelector("#picture-n4").setAttribute("src", `${ingamepics[4]}`);
  document.querySelector(".modal-icons").innerHTML = modalplatforms;
  document.querySelector(".modal-img").setAttribute("src", `${modalimg}`);
  document.querySelector(".modal-title").textContent = modaltitle;
  document.querySelector("#modal-date").textContent = modalreleasedate;
  document.querySelector(".release-modal").textContent = modalreleasedate;
  document.querySelector("#modal-rank").textContent = `${rank}`;
  document.querySelector(".modal-description-text").innerHTML =
    modaldescription;

  const plataformGames = getPlatforms(modalinfo.parent_platforms);
  document.querySelector(".platformsModal").textContent = plataformGames;
  const age = getAgerating(modalinfo.esrb_rating);
  document.querySelector(".rating").textContent = age;
  const publisher = getPublisher(modalinfo.publishers[0]);
  document.querySelector(".publisher-modal").textContent = publisher;
  const web = getWebsite(modalinfo.website);
  document.querySelector(".website-modal").textContent = web;
  const developer = getDeveloper(modalinfo.developers[0]);
  document.querySelector(".dev-modal").textContent = developer;

  let modal = document.getElementById("modal-back-sadow");
  modal.style.display = "flex";
  let exit = document.querySelector(".exit");
  document.querySelector(".exit-click").addEventListener("click", closeModal);
  exit.addEventListener("click", closeModal);
}

function closeModal() {
  let modal = document.getElementById("modal-back-sadow");
  modal.style.display = "none";
}
// modal bottom info
// platforms in bottom
function getPlatforms(platformsApi) {
  if (platformsApi === null) {
    return "No platform";
  } else {
    let platformSelected;
    for (let e = 0; e < platformsApi.length; e++) {
      platformSelected += platformsApi[e].platform.name + ", ";
    }
    return platformSelected.substring(9, platformSelected.length - 2);
  }
}
// age rating
function getAgerating(ageApi) {
  if (ageApi === null) {
    return (ageApi = "Nor Rated");
  }
  return ageApi.name;
}
// Publisher
function getPublisher(publisherApi) {
  if (publisherApi == null) {
    return (publisherApi = "Not defined");
  }
  return publisherApi.name;
}
// Website
function getWebsite(webApi) {
  if (webApi == "") {
    return (webApi = "No website");
  }
  return webApi;
}
// Developer
function getDeveloper(devApi) {
  if (devApi == null) {
    return (devApi = "No website");
  }
  return devApi.name;
}
// Modal description
async function description(id) {
  const gameCompleteDescription = await getInfoWithID(id);
  return gameCompleteDescription.description;
}
// Modal get information
async function getInfoWithID(gameId) {
  const fetchdata = await fetch(
    `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`
  );
  let datadescription = await fetchdata.json();
  return datadescription;
}
// Modal screenshots
async function gamePicsFromTheApi(slug) {
  const fetchdata = await fetch(
    `https://api.rawg.io/api/games/${slug}/screenshots?key=${apiKey}`
  );
  let slugdata = await fetchdata.json();
  let gamepictures = [];
  for (let x = 0; x < slugdata.results.length; x++) {
    gamepictures.push(slugdata.results[x].image);
  }
  return gamepictures;
}

// Change cards to columns
function changeColumnsButton(cardsData) {
  const cardsNumbers = document.querySelectorAll(".cards-style");
  const buttonChangetoColumns = document.querySelector(".button-column");
  const buttonChangetoGrid = document.querySelector(".button-grid");

  buttonChangetoColumns.addEventListener("click", singleColumnFunction);
  buttonChangetoGrid.addEventListener("click", multipleColumnsFunction);
}

async function singleColumnFunction() {
  if (singleColumnGrid === false) {
    singleColumnGridOnclick = true;
    document.querySelector(".button-grid-style").classList.remove("selected-button-column");
    document.querySelector(".button-grid-style").classList.add("noselected-button-column");
    document.querySelector(".button-column-style").classList.add("selected-button-column");
    document.querySelector(".button-column-style").classList.remove("noselected-button-column");
    document
      .getElementById("card-grid-container")
      .classList.remove("grid-container");
    document
      .getElementById("card-grid-container")
      .classList.add("one-column-container");
    let cardStyle = document.querySelectorAll(".cards-style");
    let cardbuttonbox = document.querySelectorAll("#button");
    let imgcolumn = document.querySelectorAll(".image-card");
    let columninfo = document.querySelectorAll(".bottom-info-card");
    let titlecontainer = document.querySelectorAll(
      ".title-plataform-container"
    );
    let title = document.querySelectorAll("#title");
    let date = document.querySelectorAll(".date-container");
    let rank = document.querySelectorAll(".number-gif");
    let ranknumber = document.querySelectorAll(".number-game");
    for (let i = 0; i < idGlobal.length; i++) {
      cardStyle[i].classList.add("cards-style-new");
      cardbuttonbox[i].classList.add("card-interact-button-new");
      imgcolumn[i].classList.add("image-card-new");
      columninfo[i].classList.add("bottom-info-card-new");
      titlecontainer[i].classList.add("title-plataform-container-new");
      title[i].classList.add("game-title-new");
      date[i].classList.add("date-container-new");
      rank[i].classList.add("number-gif-new");
      ranknumber[i].classList.add("number-game-new");
      document
        .querySelectorAll(".description-column")
        [i].classList.add("show-content");
    }
  }
  singleColumnGrid = true;
}
function multipleColumnsFunction() {
  if (singleColumnGrid === true) {
    singleColumnGridOnclick = false;
    document.querySelector(".button-column-style").classList.remove("selected-button-column");
    document.querySelector(".button-column-style").classList.add("noselected-button-column");
    document.querySelector(".button-grid-style").classList.add("selected-button-column");
    document.querySelector(".button-grid-style").classList.remove("noselected-button-column");
    document
      .getElementById("card-grid-container")
      .classList.remove("one-column-container");
    document
      .getElementById("card-grid-container")
      .classList.add("grid-container");
    let cardStyle = document.querySelectorAll(".cards-style");
    let cardbuttonbox = document.querySelectorAll("#button");
    let imgcolumn = document.querySelectorAll(".image-card");
    let columninfo = document.querySelectorAll(".bottom-info-card");
    let titlecontainer = document.querySelectorAll(
      ".title-plataform-container"
    );
    let title = document.querySelectorAll("#title");
    let date = document.querySelectorAll(".date-container");
    let rank = document.querySelectorAll(".number-gif");
    let ranknumber = document.querySelectorAll(".number-game");
    let cardDescription = document.querySelectorAll(".description-column");
    for (let i = 0; i < idGlobal.length; i++) {
      cardStyle[i].classList.remove("cards-style-new");
      cardbuttonbox[i].classList.remove("card-interact-button-new");
      imgcolumn[i].classList.remove("image-card-new");
      columninfo[i].classList.remove("bottom-info-card-new");
      titlecontainer[i].classList.remove("title-plataform-container-new");
      title[i].classList.remove("game-title-new");
      date[i].classList.remove("date-container-new");
      rank[i].classList.remove("number-gif-new");
      ranknumber[i].classList.remove("number-game-new");
      document
        .querySelectorAll(".description-column")
        [i].classList.remove("show-content");
    }
  }
  singleColumnGrid = false;
}

// searching interaction
function searchGame() {
  let searchinputText = document.getElementById("search-input").value;
  applySearchresults(searchinputText);
  multipleColumnsFunction()
}

async function applySearchresults(searchInput) {
  idGlobal = [];
  document.querySelector(".loader-cards").style.display = "block";
  const fetchSearchApi = await fetch(`${urlKey}&search=${searchInput}`);
  const dataSearched = await fetchSearchApi.json();
  page = dataSearched.next;
  loadpage = true;
  document.getElementById("new-trend").innerHTML = "Search Result";
  document.querySelector(
    ".subtitle-card-grid"
  ).innerHTML = `"${searchInput}" Results`;
  document.querySelector(".grid-container").innerHTML = "";
  for (let e = 0; e < dataSearched.results.length; e++) {
    let dataResults = dataSearched.results[e];
    let createcard = ``;
    createcard = `<li class='cards-style'>
        <button class='card-interact-button' id='button' onclick=showModalEvent(${
          dataResults.id
        })>
            <img class='image-card' src='${
              dataResults.background_image
            }' alt='games'>
            <div class="bottom-info-card">
                                    <div class="title-plataform-container">
                                        <p class="game-title" id="title">${
                                          dataResults.name
                                        }</p>
                                        <div class="platforms-icons">${platformSelector(
                                          dataResults
                                        )}</div>
                                    </div>
                                    <div class="date-gif">
                                        <div class="date-container">
                                            <div>
                                            <div class="text-container">
                                                <p class="release text-grid">Release date</p>
                                                <p class="date text-grid">${dateRelease(
                                                  dataResults
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                            <div>
                                            <div class="text-container">
                                                <p class="text-grid">Genres</p>
                                                <p class="text-grid" id="genres">${showGenres(
                                                  dataResults
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                        </div>
                                        <div class="number-gif">
                                            <p class="number-game">#${e + 1}</p>
                                            <div class="gif"><span class="plus">+</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3 1.11929 4.11929 0 5.5 0C6.88071 0 8 1.11929 8 2.5C8 1.11929 9.11929 0 10.5 0C11.8807 0 13 1.11929 13 2.5V2.506C13 2.576 13 2.776 12.962 3H15C15.5523 3 16 3.44772 16 4V5C16 5.55228 15.5523 6 15 6H1C0.447715 6 0 5.55228 0 5V4C0 3.44772 0.447715 3 1 3H3.038C3.01159 2.83668 2.99888 2.67144 3 2.506V2.5ZM4.068 3H7V2.5C7 1.9641 6.7141 1.46891 6.25 1.20096C5.7859 0.933013 5.2141 0.933013 4.75 1.20096C4.2859 1.46891 4 1.9641 4 2.5C4 2.585 4.002 2.774 4.045 2.93C4.05101 2.95385 4.05869 2.97724 4.068 3ZM11.932 3H9V2.5C9 1.67157 9.67157 1 10.5 1C11.3284 1 12 1.67157 12 2.5C12 2.585 11.998 2.774 11.955 2.93C11.9489 2.95381 11.9412 2.9772 11.932 3ZM15 7V14.5C15 15.3284 14.3284 16 13.5 16H9V7H15ZM1 14.5C1 15.3284 1.67157 16 2.5 16H7V7H1V14.5Z" fill="white"/>
                                                </svg>
                                                </div>
                                        </div>
                                    </div>
                        </div>
                        <div class="description-column"></div>
        </button>
        </li>`;
    document.querySelector("#card-grid-container").innerHTML += createcard;
  idGlobal.push(dataResults.id);
  }
  document.querySelector(".loader-cards").style.display = "none";
  descriptionText(idGlobal)
}

async function homeGame() {
  document.querySelector(".loader-cards").style.display = "block";
  const fetchHomeApi = await fetch(`${urlKey}`);
  const dataHome = await fetchHomeApi.json();
  idGlobal = [];
  page = dataHome.next;
  loadpage = false;
  document.getElementById("new-trend").innerHTML = "New and trending";
  document.querySelector(".subtitle-card-grid").innerHTML =
    "Based on player counts and realease date";
  document.querySelector(".grid-container").innerHTML = "";
  for (let e = 0; e < dataHome.results.length; e++) {
    let dataResults = dataHome.results[e];
    let createcard = ``;
    createcard = `<li class='cards-style'>
        <button class='card-interact-button' id='button' onclick=showModalEvent(${
          dataResults.id
        })>
            <img class='image-card' src='${
              dataResults.background_image
            }' alt='games'>
            <div class="bottom-info-card">
                                    <div class="title-plataform-container">
                                        <p class="game-title" id="title">${
                                          dataResults.name
                                        }</p>
                                        <div class="platforms-icons">${platformSelector(
                                          dataResults
                                        )}</div>
                                    </div>
                                    <div class="date-gif">
                                        <div class="date-container">
                                            <div>
                                            <div class="text-container">
                                                <p class="release text-grid">Release date</p>
                                                <p class="date text-grid">${dateRelease(
                                                  dataResults
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                            <div>
                                            <div class="text-container">
                                                <p class="text-grid">Genres</p>
                                                <p class="text-grid" id="genres">${showGenres(
                                                  dataResults
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                        </div>
                                        <div class="number-gif">
                                            <p class="number-game">#${e + 1}</p>
                                            <div class="gif"><span class="plus">+</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3 1.11929 4.11929 0 5.5 0C6.88071 0 8 1.11929 8 2.5C8 1.11929 9.11929 0 10.5 0C11.8807 0 13 1.11929 13 2.5V2.506C13 2.576 13 2.776 12.962 3H15C15.5523 3 16 3.44772 16 4V5C16 5.55228 15.5523 6 15 6H1C0.447715 6 0 5.55228 0 5V4C0 3.44772 0.447715 3 1 3H3.038C3.01159 2.83668 2.99888 2.67144 3 2.506V2.5ZM4.068 3H7V2.5C7 1.9641 6.7141 1.46891 6.25 1.20096C5.7859 0.933013 5.2141 0.933013 4.75 1.20096C4.2859 1.46891 4 1.9641 4 2.5C4 2.585 4.002 2.774 4.045 2.93C4.05101 2.95385 4.05869 2.97724 4.068 3ZM11.932 3H9V2.5C9 1.67157 9.67157 1 10.5 1C11.3284 1 12 1.67157 12 2.5C12 2.585 11.998 2.774 11.955 2.93C11.9489 2.95381 11.9412 2.9772 11.932 3ZM15 7V14.5C15 15.3284 14.3284 16 13.5 16H9V7H15ZM1 14.5C1 15.3284 1.67157 16 2.5 16H7V7H1V14.5Z" fill="white"/>
                                                </svg>
                                                </div>
                                        </div>
                                    </div>
                        </div>
                        <div class="description-column"></div>
        </button>
        </li>`;
    document.querySelector("#card-grid-container").innerHTML += createcard;
    idGlobal.push(dataResults.id);
  }
  document.querySelector(".loader-cards").style.display = "none";
  descriptionText(idGlobal)
}

async function thisWeek() {
  document.querySelector(".loader-cards").style.display = "block";
  let lastweekDate = lastweek();
  let todayDate = thisDay();
  loadpage = false;
  const fetchLastweek = await fetch(
    `${urlKey}&dates=${lastweekDate},${todayDate}`
  );
  const dataweek = await fetchLastweek.json();
  idGlobal = [];
  page = dataweek.next;
  document.getElementById("new-trend").innerHTML = "This Week";
  document.querySelector(
    ".subtitle-card-grid"
  ).innerHTML = `Games lunched in this week`;
  document.querySelector(".grid-container").innerHTML = "";
  for (let e = 0; e < dataweek.results.length; e++) {
    let dataResults = dataweek.results[e];
    let createcard = ``;
    createcard = `<li class='cards-style'>
    <button class='card-interact-button' id='button' onclick=showModalEvent(${
      dataResults.id
    })>
        <img class='image-card' src='${
          dataResults.background_image
        }' alt='games'>
        <div class="bottom-info-card">
                                <div class="title-plataform-container">
                                    <p class="game-title" id="title">${
                                      dataResults.name
                                    }</p>
                                    <div class="platforms-icons">${platformSelector(
                                      dataResults
                                    )}</div>
                                </div>
                                <div class="date-gif">
                                    <div class="date-container">
                                        <div>
                                        <div class="text-container">
                                            <p class="release text-grid">Release date</p>
                                            <p class="date text-grid">${dateRelease(
                                              dataResults
                                            )}</p>
                                        </div>
                                        <div class="line"></div>
                                        </div>
                                        <div>
                                        <div class="text-container">
                                            <p class="text-grid">Genres</p>
                                            <p class="text-grid" id="genres">${showGenres(
                                              dataResults
                                            )}</p>
                                        </div>
                                        <div class="line"></div>
                                        </div>
                                    </div>
                                    <div class="number-gif">
                                        <p class="number-game">#${e + 1}</p>
                                        <div class="gif"><span class="plus">+</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3 1.11929 4.11929 0 5.5 0C6.88071 0 8 1.11929 8 2.5C8 1.11929 9.11929 0 10.5 0C11.8807 0 13 1.11929 13 2.5V2.506C13 2.576 13 2.776 12.962 3H15C15.5523 3 16 3.44772 16 4V5C16 5.55228 15.5523 6 15 6H1C0.447715 6 0 5.55228 0 5V4C0 3.44772 0.447715 3 1 3H3.038C3.01159 2.83668 2.99888 2.67144 3 2.506V2.5ZM4.068 3H7V2.5C7 1.9641 6.7141 1.46891 6.25 1.20096C5.7859 0.933013 5.2141 0.933013 4.75 1.20096C4.2859 1.46891 4 1.9641 4 2.5C4 2.585 4.002 2.774 4.045 2.93C4.05101 2.95385 4.05869 2.97724 4.068 3ZM11.932 3H9V2.5C9 1.67157 9.67157 1 10.5 1C11.3284 1 12 1.67157 12 2.5C12 2.585 11.998 2.774 11.955 2.93C11.9489 2.95381 11.9412 2.9772 11.932 3ZM15 7V14.5C15 15.3284 14.3284 16 13.5 16H9V7H15ZM1 14.5C1 15.3284 1.67157 16 2.5 16H7V7H1V14.5Z" fill="white"/>
                                            </svg>
                                            </div>
                                    </div>
                                </div>
                    </div>
                    <div class="description-column"></div>
                    
    </button>
    </li>`;
    document.querySelector("#card-grid-container").innerHTML += createcard;
  idGlobal.push(dataResults.id);
  }
  document.querySelector(".loader-cards").style.display = "none";
  descriptionText(idGlobal)
}

async function thisMonth() {
  document.querySelector(".loader-cards").style.display = "block";
  let month = lastMonth();
  let todayDate = thisDay();
  const fetchLastmonth = await fetch(`${urlKey}&dates=${month},${todayDate}`);
  const datamonth = await fetchLastmonth.json();
  idGlobal = []
  page = datamonth.next;
  loadpage = false;
  document.getElementById("new-trend").innerHTML = "This Month";
  document.querySelector(
    ".subtitle-card-grid"
  ).innerHTML = `Games lunched in this month`;
  document.querySelector(".grid-container").innerHTML = "";
  for (let e = 0; e < datamonth.results.length; e++) {
    let dataResults = datamonth.results[e];
    let createcard = ``;
    createcard = `<li class='cards-style'>
    <button class='card-interact-button' id='button' onclick=showModalEvent(${
      dataResults.id
    })>
        <img class='image-card' src='${
          dataResults.background_image
        }' alt='games'>
        <div class="bottom-info-card">
                                <div class="title-plataform-container">
                                    <p class="game-title" id="title">${
                                      dataResults.name
                                    }</p>
                                    <div class="platforms-icons">${platformSelector(
                                      dataResults
                                    )}</div>
                                </div>
                                <div class="date-gif">
                                    <div class="date-container">
                                        <div>
                                        <div class="text-container">
                                            <p class="release text-grid">Release date</p>
                                            <p class="date text-grid">${dateRelease(
                                              dataResults
                                            )}</p>
                                        </div>
                                        <div class="line"></div>
                                        </div>
                                        <div>
                                        <div class="text-container">
                                            <p class="text-grid">Genres</p>
                                            <p class="text-grid" id="genres">${showGenres(
                                              dataResults
                                            )}</p>
                                        </div>
                                        <div class="line"></div>
                                        </div>
                                    </div>
                                    <div class="number-gif">
                                        <p class="number-game">#${e + 1}</p>
                                        <div class="gif"><span class="plus">+</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3 1.11929 4.11929 0 5.5 0C6.88071 0 8 1.11929 8 2.5C8 1.11929 9.11929 0 10.5 0C11.8807 0 13 1.11929 13 2.5V2.506C13 2.576 13 2.776 12.962 3H15C15.5523 3 16 3.44772 16 4V5C16 5.55228 15.5523 6 15 6H1C0.447715 6 0 5.55228 0 5V4C0 3.44772 0.447715 3 1 3H3.038C3.01159 2.83668 2.99888 2.67144 3 2.506V2.5ZM4.068 3H7V2.5C7 1.9641 6.7141 1.46891 6.25 1.20096C5.7859 0.933013 5.2141 0.933013 4.75 1.20096C4.2859 1.46891 4 1.9641 4 2.5C4 2.585 4.002 2.774 4.045 2.93C4.05101 2.95385 4.05869 2.97724 4.068 3ZM11.932 3H9V2.5C9 1.67157 9.67157 1 10.5 1C11.3284 1 12 1.67157 12 2.5C12 2.585 11.998 2.774 11.955 2.93C11.9489 2.95381 11.9412 2.9772 11.932 3ZM15 7V14.5C15 15.3284 14.3284 16 13.5 16H9V7H15ZM1 14.5C1 15.3284 1.67157 16 2.5 16H7V7H1V14.5Z" fill="white"/>
                                            </svg>
                                            </div>
                                    </div>
                                </div>
                    </div>
                    <div class="description-column"></div>
    </button>
    </li>`;
    document.querySelector("#card-grid-container").innerHTML += createcard;
  idGlobal.push(dataResults.id);
  }
  document.querySelector(".loader-cards").style.display = "none";
  descriptionText(idGlobal);
}
function lastweek() {
  var today = new Date();
  var lastweek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  var day = String(lastweek.getDate()).padStart(2, "0");
  var month = String(lastweek.getMonth() + 1).padStart(2, "0");
  var year = lastweek.getFullYear();
  let lastweekstring = year + "-" + month + "-" + day;
  return lastweekstring;
}
function thisDay() {
  var today = new Date();
  var day = String(today.getDate()).padStart(2, "0");
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var year = today.getFullYear();
  let todayString = year + "-" + month + "-" + day;
  return todayString;
}

function lastMonth() {
  var today = new Date();
  var lastmonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 30
  );
  var day = String(lastmonth.getDate()).padStart(2, "0");
  var month = String(lastmonth.getMonth() + 1).padStart(2, "0");
  var year = lastmonth.getFullYear();
  let lastmonthstring = year + "-" + month + "-" + day;
  return lastmonthstring;
}
// infinite Scrolling
function infiniteScroll() {
  window.addEventListener("scroll", () => {
    if (
      window.scrollY + 1 + window.innerHeight >=
        document.documentElement.scrollHeight &&
      loadpage === false
    ) {
      loadScroll(page);
    }
  });
}

async function loadScroll(pagescrollindg) {
  loadpage = true;
  let fetchpage = await fetch(pagescrollindg);
  let pageData = await fetchpage.json();
  for (let e = 0; e < pageData.results.length; e++) {
    let dataResults = pageData.results[e];
    let createcard = ``;
    if (singleColumnGridOnclick == false) {
      createcard = `<li class='cards-style'>
        <button class='card-interact-button' id='button' onclick=showModalEvent(${
          dataResults.id
        })>
            <img class='image-card' src='${
              dataResults.background_image
            }' alt='games'>
            <div class="bottom-info-card">
                                    <div class="title-plataform-container">
                                        <p class="game-title" id="title">${
                                          dataResults.name
                                        }</p>
                                        <div class="platforms-icons">${platformSelector(
                                          dataResults
                                        )}</div>
                                    </div>
                                    <div class="date-gif">
                                        <div class="date-container">
                                            <div>
                                            <div class="text-container">
                                                <p class="release text-grid">Release date</p>
                                                <p class="date text-grid">${dateRelease(
                                                  dataResults
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                            <div>
                                            <div class="text-container">
                                                <p class="text-grid">Genres</p>
                                                <p class="text-grid" id="genres">${showGenres(
                                                  dataResults
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                        </div>
                                        <div class="number-gif">
                                            <p class="number-game">#${e + 1}</p>
                                            <div class="gif"><span class="plus">+</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3 1.11929 4.11929 0 5.5 0C6.88071 0 8 1.11929 8 2.5C8 1.11929 9.11929 0 10.5 0C11.8807 0 13 1.11929 13 2.5V2.506C13 2.576 13 2.776 12.962 3H15C15.5523 3 16 3.44772 16 4V5C16 5.55228 15.5523 6 15 6H1C0.447715 6 0 5.55228 0 5V4C0 3.44772 0.447715 3 1 3H3.038C3.01159 2.83668 2.99888 2.67144 3 2.506V2.5ZM4.068 3H7V2.5C7 1.9641 6.7141 1.46891 6.25 1.20096C5.7859 0.933013 5.2141 0.933013 4.75 1.20096C4.2859 1.46891 4 1.9641 4 2.5C4 2.585 4.002 2.774 4.045 2.93C4.05101 2.95385 4.05869 2.97724 4.068 3ZM11.932 3H9V2.5C9 1.67157 9.67157 1 10.5 1C11.3284 1 12 1.67157 12 2.5C12 2.585 11.998 2.774 11.955 2.93C11.9489 2.95381 11.9412 2.9772 11.932 3ZM15 7V14.5C15 15.3284 14.3284 16 13.5 16H9V7H15ZM1 14.5C1 15.3284 1.67157 16 2.5 16H7V7H1V14.5Z" fill="white"/>
                                                </svg>
                                                </div>
                                        </div>
                                    </div>
                        </div>
                        <div class="description-column">${await description(
                          dataResults.id
                        )}</div>
        </button>
        </li>`;
    }
    if ( singleColumnGridOnclick == true) {
      createcard = `<li class='cards-style cards-style-new'>
        <button class='card-interact-button card-interact-button-new' id='button' onclick=showModalEvent(${
          dataResults.id
        })>
            <img class='image-card image-card-new' src='${
              dataResults.background_image
            }' alt='games'>
            <div class="bottom-info-card bottom-info-card-new">
                                    <div class="title-plataform-container title-plataform-container-new">
                                        <p class="game-title game-title-new" id="title">${
                                          dataResults.name
                                        }</p>
                                        <div class="platforms-icons">${platformSelector(
                                          dataResults
                                        )}</div>
                                    </div>
                                    <div class="date-gif">
                                        <div class="date-container date-container-new">
                                            <div>
                                            <div class="text-container">
                                                <p class="release text-grid">Release date</p>
                                                <p class="date text-grid">${dateRelease(
                                                  dataResults
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                            <div>
                                            <div class="text-container">
                                                <p class="text-grid">Genres</p>
                                                <p class="text-grid" id="genres">${showGenres(
                                                  dataResults
                                                )}</p>
                                            </div>
                                            <div class="line"></div>
                                            </div>
                                        </div>
                                        <div class="number-gif number-gif-new">
                                            <p class="number-game number-game-new">#${e + 1}</p>
                                            <div class="gif"><span class="plus">+</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3 1.11929 4.11929 0 5.5 0C6.88071 0 8 1.11929 8 2.5C8 1.11929 9.11929 0 10.5 0C11.8807 0 13 1.11929 13 2.5V2.506C13 2.576 13 2.776 12.962 3H15C15.5523 3 16 3.44772 16 4V5C16 5.55228 15.5523 6 15 6H1C0.447715 6 0 5.55228 0 5V4C0 3.44772 0.447715 3 1 3H3.038C3.01159 2.83668 2.99888 2.67144 3 2.506V2.5ZM4.068 3H7V2.5C7 1.9641 6.7141 1.46891 6.25 1.20096C5.7859 0.933013 5.2141 0.933013 4.75 1.20096C4.2859 1.46891 4 1.9641 4 2.5C4 2.585 4.002 2.774 4.045 2.93C4.05101 2.95385 4.05869 2.97724 4.068 3ZM11.932 3H9V2.5C9 1.67157 9.67157 1 10.5 1C11.3284 1 12 1.67157 12 2.5C12 2.585 11.998 2.774 11.955 2.93C11.9489 2.95381 11.9412 2.9772 11.932 3ZM15 7V14.5C15 15.3284 14.3284 16 13.5 16H9V7H15ZM1 14.5C1 15.3284 1.67157 16 2.5 16H7V7H1V14.5Z" fill="white"/>
                                                </svg>
                                                </div>
                                        </div>
                                    </div>
                        </div>
                        <div class="description-column show-content">${await description(
                          dataResults.id
                        )}</div>
        </button>
        </li>`;
    }
    document.querySelector("#card-grid-container").innerHTML += createcard;
    idGlobal.push(dataResults.id);
  }
  page = pageData.next;
  loadpage = false;
}
// logout function

document.querySelector(".logout").addEventListener("click", logout);
document.querySelector(".logout_icon").addEventListener("click", logout);

function logout() {
  window.location = "index.html";
}

function openNav() {
  document.querySelector(".nav-tablet-container").style.display = "flex";
}
function closeNav() {
  document.querySelector(".nav-tablet-container").style.display = "none";
}

// callback
/* callbackFirst( 2, function(firstResult, err) {
  if (!err) {
    console.log(`Callback result:${firstResult}`);
    callbackSecond (firstResult, function(secondResult, err ) {
      console.log(`Callback result:${secondResult}`);
      if(!err){
        callbackThird (secondResult, function(thirdResult, err ) {
          if(!err) {
            console.log(`Callback result:${thirdResult}`)
          }
        })
      }
    })
  }
})


function callbackFirst(value, callback) {
  callback(value +2, false);
}

function callbackSecond(value, callback) {
  callback(value +2, false);
}

function callbackThird(value, callback) {
  callback(value +2, false);
}

var promise = new Promise ( function( resolve, reject) {
  resolve(2);
})

promise.then(first).then(second).then(third)
.then( response => { console.log(`Promise result:${response}`)});

function first(value) {
  return(value +2);
}

function second(value) {
  return(value +2);
}

function third(value) {
  return(value +2);
} */


// change color buttons hover
