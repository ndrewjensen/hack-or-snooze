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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let favoriteStar = `<i class="bi bi-star"></i>`;
  for (let favorite of currentUser.favorites) {
    if (favorite.storyId === story.storyId) {
      favoriteStar = `<i class="bi bi-star-fill"></i>`;
    }
  }

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${favoriteStar}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** pass in list of stories
 * generates their HTML,
 * and puts on page. */

function putStoriesOnPage(currentList = storyList.stories) {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentList) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

/** Takes in new story{author, title, url}
 * on click calls .addStory with form values
 * updates DOM
 */

async function getDataFromForm(event) {
  console.debug("getDataFromForm");
  event.preventDefault();

  const currentStory = {
    author: $("#author").val(),
    title: $("#title").val(),
    url: $("#url").val(),
  };

  const story = await storyList.addStory(currentUser, currentStory);
  const currentStoryMarkUp = generateStoryMarkup(story);

  $allStoriesList.prepend(currentStoryMarkUp);
}

$("#new-story-submit").on("click", getDataFromForm);

/**toggle the click/target star between filled/unfilled on the DOM
 * returns undefined
 */

function toggleStar($star) {
  console.debug("toggleStar");
  $star.toggleClass("bi-star bi-star-fill"); //should be able to toggle multiple classes at once
  //Margaret - the line above replaces these following three lines
  // $star.attr("class") === "bi bi-star"
  //   ? $star.attr("class", "bi bi-star-fill")
  //   : $star.attr("class", "bi bi-star");
}

/**Takes in an event (star div)
 * calls API
 * invokes addFavorite or removeFavorite
 * invokes toggleStar
 * returns undefined
 */
async function favoriteHandler(evt) {
  console.debug("favoriteHandler");
  const $star = $(evt.target);
  let currentStoryId = $star.closest("li").attr("id");

  const story = await Story.getStoryById(currentStoryId);
  if ($star.attr("class") === "bi bi-star") {
    await currentUser.addFavorite(story);
  } else {
    await currentUser.removeFavorite(story.storyId);
  }

  toggleStar($star);
}

$("#all-stories-list").on("click", ".bi", favoriteHandler);
