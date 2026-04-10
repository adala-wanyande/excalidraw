import {
  clearAppStateForLocalStorage,
  getDefaultAppState,
} from "@excalidraw/excalidraw/appState";

import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AppState } from "@excalidraw/excalidraw/types";

import { STORAGE_KEYS } from "../app_constants";

import { importSceneFromIndexedDB } from "./LocalData";

export const saveUsernameToLocalStorage = (username: string) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.LOCAL_STORAGE_COLLAB,
      JSON.stringify({ username }),
    );
  } catch (error: any) {
    // Unable to access window.localStorage
    console.error(error);
  }
};

export const importUsernameFromLocalStorage = (): string | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_COLLAB);
    if (data) {
      return JSON.parse(data).username;
    }
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }

  return null;
};

export const importFromLocalStorage = async () => {
  const { elements: rawElements, appState: rawAppState } =
    await importSceneFromIndexedDB();

  let elements: ExcalidrawElement[] = [];
  try {
    elements = rawElements ?? [];
  } catch (error: any) {
    console.error(error);
  }

  let appState = null;
  if (rawAppState) {
    try {
      appState = {
        ...getDefaultAppState(),
        ...clearAppStateForLocalStorage(rawAppState as Partial<AppState>),
      };
    } catch (error: any) {
      console.error(error);
    }
  }
  return { elements, appState };
};

export const getElementsStorageSize = () => {
  return 0;
};

export const getTotalStorageSize = () => {
  try {
    const collab = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_COLLAB);
    return collab?.length || 0;
  } catch (error: any) {
    console.error(error);
    return 0;
  }
};
