"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {

  const hostName = story.getHostName();
  // if user logged in, star is rendered
  const showStar = Boolean(currentUser)

  const deleteButton = (
    `<span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>`)
  
  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? deleteButton: ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story)
  const starType = isFavorite ? "fas" : "far"
  return `
    <span class="star">
      <span class="${starType} favorite-star fa-star"></span>
    </span>`
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function deleteStory(evt) {
  
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id")

  await storyList.removeStory(currentUser, storyId)

  await putUserStoriesonPage()
}

$ownStories.on("click", ".trash-can", deleteStory)

async function submitNewStory(evt) {
  evt.preventDefault()

  const title = $("#create-title").val()
  const author = $("#create-author").val()
  const url = $("#create-url").val()
  const username = currentUser.username
  const storyData = {title, url, author, username }
  
  const story = await storyList.addStory(currentUser, storyData)

  const $story = generateStoryMarkup(story)
  $allStoriesList.prepend($story)

  $submitForm.slideUp("slow")
  $submitForm.trigger("reset")
}

$submitForm.on("submit", submitNewStory)

function putUserStoriesonPage() {
  $ownStories.empty()

  if(currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet</h5>")
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true)
      $ownStories.append($story)
    }
  }

  $ownStories.show()
}

function putFavoritesListOnPage() {
  $favoritedStories.empty()

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added</h5>")
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story)
      $favoritedStories.append($story)
    }
  }
  
  $favoritedStories.show()
}

async function toggleStoryFavorite(evt) {

  const $tgt = $(evt.target)
  const $closestLi = $tgt.closest("li")
  const storyId = $closestLi.attr("id")
  const story = storyList.stories.find(s => s.storyId === storyId)

  // already favorited (filled star)
  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story)
    $tgt.closest(".favorite-star").toggleClass("fas far")
  } else {
    // if not a favorite, add to favorites
    await currentUser.addFavorite(story)
    $tgt.closest(".favorite-star").toggleClass("fas far")
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite)

