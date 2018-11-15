export enum ActionTypes {
  locationChanged = "@@router/LOCATION_CHANGE",

  getPollsRequest = "GET_POLLS_REQUEST",
  getPollsSuccess = "GET_POLLS_SUCCESS",
  getPollsError = "GET_POLLS_ERROR",

  postPollsRequest = "POST_POLLS_REQUEST",
  postPollsSuccess = "POST_POLLS_SUCCESS",
  postPollsError = "POST_POLLS_ERROR",

  helloSaga = "HELLO_SAGA",

  changeFormData = "CHANGE_FORM_DATA",
  discardFormData = "DISCARD_FORM_DATA",

  toggleChangingName = "TOGGLE_CHANGING_NAME",
  changeUserFormData = "CHANGE_USER_FORM_DATA",
  saveUserFormData = "SAVE_USER_FORM_DATA",
  discardUserFormData = "DISCARD_USER_FORM_DATA",

  voteOptionLoading = "VOTE_OPTION_LOADING",
  voteOptionSuccess = "VOTE_OPTION_SUCCESS",
  voteOptionError = "VOTE_OPTION_ERROR",

  removeVoteOptionLoading = "REMOVE_VOTE_OPTION_LOADING",
  removeVoteOptionSuccess = "REMOVE_VOTE_OPTION_SUCCESS",
  removeVoteOptionError = "REMOVE_VOTE_OPTION_ERROR",

  toggleShowResultsLoading = "TOGGLE_SHOW_RESULTS_LOADING",
  toggleShowResultsSuccess = "TOGGLE_SHOW_RESULTS_SUCCESS",
  toggleShowResultsError = "TOGGLE_SHOW_RESULTS_ERROR",

  addPollFormOption = "ADD_POLL_FORM_OPTION",
  removePollFormOption = "REMOVE_POLL_FORM_OPTION",

  deletePollLoading = "DELETE_POLL_LOADING",
  deletePollSuccess = "DELETE_POLL_SUCCESS",
  deletePollError = "DELETE_POLL_ERROR",

  showUpdatePollForm = "SHOW_UPDATE_POLL_FORM",
  discardUpdatePollForm = "DISCARD_UPDATE_POLL_FORM",

  updatePollLoading = "UPDATE_POLL_LOADING",
  updatePollSuccess = "UPDATE_POLL_SUCCESS",
  updatePollError = "UPDATE_POLL_ERROR",

  getUserDataLoading = "GET_USER_DATA_LOADING",
  getUserDataSuccess = "GET_USER_DATA_SUCCESS",
  getUserDataError = "GET_USER_DATA_ERROR",
  getUserData = "GET_USER_DATA_NOT_LOGGED_IN",

  openPollLoading = "OPEN_POLL_LOADING",
  openPollSuccess = "OPEN_POLL_SUCCESS",
  openPollError = "OPEN_POLL_ERROR",

  closePollLoading = "CLOSE_POLL_LOADING",
  closePollSuccess = "CLOSE_POLL_SUCCESS",
  closePollError = "CLOSE_POLL_ERROR",

  closedWarning = "CLOSED_WARNING"
}
