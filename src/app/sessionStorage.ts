export const loadState = () => {
  try {
    const serialisedState = sessionStorage.getItem("state");
    if (serialisedState === null) {
      return undefined;
    }
    return JSON.parse(serialisedState);
  } catch (error) {
    return undefined;
  }
};
export const saveState = (state: any) => {
  try {
    const serialisedState = JSON.stringify(state);
    // console.log(serialisedState);
    sessionStorage.setItem("state", serialisedState);
  } catch (error) {
    // console.log(error);
  }
};
