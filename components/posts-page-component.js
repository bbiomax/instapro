import { ADD_POSTS_PAGE, AUTH_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { formatDate } from "./formatDate.js"

let likeCount = '';

export function renderPostsPageComponent({ appEl }, {token}) {
  // TODO: реализовать рендер постов из api
  if (posts.length === 0) {
    if (!token) {
      goToPage(AUTH_PAGE);
      return;
    } else {
      goToPage(ADD_POSTS_PAGE);
      return;
    }
  }

  const appHtml = posts.map((post) => {
    let likeLength = post.likes.length;
    const first = post.likes[0];
    let likesText = '';
    let likesCount = likeLength - 1;
    let postDate = formatDate(new Date(post.postDate));
    if (first) {
      likesText = first.name;
    }
    
    return `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        <li class="post">
          <div class="post-header" data-user-id="${post.userId}">
              <img src="${post.userUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.userName}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.postUrl}">
          </div>
          <div class="post-likes" data-post-conten-id="${post.postId}">
            <button data-post-id="${post.postId}" class="like-button like-${post.isLiked}">
              <img src="./assets/images/${(post.isLiked === true) ? 'like-active.svg' : 'like-not-active.svg'}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${(!first) ? likeLength : (likeLength === 1) ? likesText : likesText + " и еще " + likesCount}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.userName}</span>
            ${post.description}
          </p>
          <p class="post-date">
          ${postDate}
          </p>
        </li>
        <li class="post">
      </ul>
    </div>`;
  })

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  likeBtnListener();
}

function likeBtnListener() {
  for (let likeBtn of document.querySelectorAll('.like-button')) {
    likeBtn.addEventListener('click', () => {
      likeCount = likeBtn.parentNode;
      if (likeBtn.classList.contains('like-true')) {
        dislikePost(likeBtn.dataset.postId, { token: getToken() });
      }else {
        likePost(likeBtn.dataset.postId, { token: getToken() });
      }
      return likeCount;
    })
  }
}

export function reRenderLikes(post) {
  let isLiked = post.get('isLiked');
  let likes = post.get('likes');
  let likeLength = likes.length;
  let first = likes[0];
  let likesCount = likeLength - 1;
  let likesText = '';
  if (first) {
    likesText = first.name;
  }

  likeCount.innerHTML = `
  <button data-post-id="${post.get("id")}" class="like-button like-${isLiked}">
  <img src="./assets/images/${(isLiked == true) ? 'like-active.svg' : 'like-not-active.svg'}">
  </button>
  <p class="post-likes-text">
  Нравится: <strong>${(!first) ? likeLength : (likeLength === 1) ? likesText : likesText + " и еще " + likesCount}</strong>
  </p>`;

  likeBtnListener();
}