import { create } from "zustand";

interface EditModeStates {
  isEditMode: boolean;
}

interface EditModeActions {
  setEditMode: (isEditMode: boolean) => void;
}

type EditModeStoreType = EditModeStates & EditModeActions;

export const useEditModeStore = create<EditModeStoreType>((set) => ({
  isEditMode: false,
  setEditMode: (isEditMode) => set({ isEditMode }),
}));
