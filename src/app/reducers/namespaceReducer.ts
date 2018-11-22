import { Reducer } from "redux";
import { ActionTypes } from "../actions/action-types";
import { FieldId, NamespaceActions } from "../actions/actions";

export type NameSpaceFormState = { [key in FieldId]: string };
export interface NamespaceState {
  formData: NameSpaceFormState;
  namespace: string;
  isEditing: boolean;
}

function getInitNamespaceState(): NamespaceState {
  return {
    formData: { namespace: "public" },
    namespace: "public",
    isEditing: false
  };
}

const initState = getInitNamespaceState();

const namespaceReducer: Reducer<NamespaceState, NamespaceActions> = (
  currentState = initState,
  action
) => {
  switch (action.type) {
    case ActionTypes.changeNamespaceForm: {
      const newData = { ...currentState.formData };
      newData[action.payload.fieldId] = action.payload.value;

      return {
        ...currentState,
        formData: newData
      };
    }
    case ActionTypes.discardNamespaceForm: {
      return {
        ...currentState,
        formData: {
          ...currentState.formData,
          namespace: action.payload.namespace
        },
        isEditing: false
      };
    }
    case ActionTypes.updateNamespace: {
      return {
        ...currentState,
        namespace: action.payload.namespace,
        isEditing: false
      };
    }
    case ActionTypes.changeNamespaceFormShowing: {
      return {
        ...currentState,
        isEditing: action.payload.showOrHide === "show" ? true : false
      };
    }
    default: {
      return currentState;
    }
  }
};

export default namespaceReducer;
