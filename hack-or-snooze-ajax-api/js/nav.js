"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

// Navbar for submitting story and revealing form to submit
function navSubmitStory(evt) {
  hidePageComponents()
  $allStoriesList.show()
  $submitForm.show()
}

$navSubmitStory.on("click", navSubmitStory);

function navFavoritesClick(evt) {
  hidePageComponents()
  putFavoritesListOnPage()
}

$body.on("click", "#nav-favorites", navFavoritesClick)

function navMyStories(evt) {
  hidePageComponents()
  putUserStoriesonPage()
  $ownStories.show()
}

$body.on("click", "#nav-my-stories", navMyStories)

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
