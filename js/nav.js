"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */
/** Show main list of all stories when click site name */


/** Shows form when submit button is clicked
 * returns undefined
*/
function navShowNewStoryForm(evt) {
  //create click event
  console.debug("navShowNewStoryForm", evt);
  evt.preventDefault();
  $("#new-story-form").toggle();
}
//click event for #submit
$("#nav-submit").on("click", navShowNewStoryForm);

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/**takes in click and determines which list of stories to display,
 * either currentUser's favorites or ownStories
 * invokes putStoriesOnPage, passing in list
 */

function switchDisplayedList(evt) {
  console.debug('switchDisplayedList');
  let currentList = null;
  if ($(evt.target).attr("id") === "favorites") {
    //console.log("favorite list being selected");
    currentList = currentUser.favorites;
  } else if ($(evt.target).attr("id") === "my-stories") {
    //console.log("my stories list being selected");
    currentList = currentUser.ownStories;
  }
  putStoriesOnPage(currentList);
}

//TODO:why did we need to use an arrow function to call putStoriesOnPage
$('#favorites').on("click", (evt) => switchDisplayedList(evt));
$('#my-stories').on("click", (evt) => switchDisplayedList(evt));