import { create } from "zustand";

export type BowProfile = "fine" | "balanced" | "bold";
export type HullColour = "white" | "silver" | "graphite" | "teal";
export type DeckFinish = "natural" | "smoked" | "graphite";
export type Environment = "studio" | "daylight" | "dusk";
export type CameraView = "perspective" | "profile" | "top" | "front";
export type Mode = "guided" | "advanced";

export interface YachtConfiguration {
  length: number;
  beam: number;
  bowProfile: BowProfile;
  superstructure: number;
  upperDeck: number;
  glazing: number;
  hullColour: HullColour;
  deckFinish: DeckFinish;
  environment: Environment;
}

const initialConfiguration: YachtConfiguration = {
  length: 42,
  beam: 8.4,
  bowProfile: "balanced",
  superstructure: 1,
  upperDeck: 0.82,
  glazing: 68,
  hullColour: "white",
  deckFinish: "natural",
  environment: "studio",
};

interface ConfiguratorState {
  configuration: YachtConfiguration;
  mode: Mode;
  cameraView: CameraView;
  presenting: boolean;
  panelOpen: boolean;
  setConfiguration: <Key extends keyof YachtConfiguration>(key: Key, value: YachtConfiguration[Key]) => void;
  setMode: (mode: Mode) => void;
  setCameraView: (view: CameraView) => void;
  setPresenting: (presenting: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  reset: () => void;
}

export const useConfigurator = create<ConfiguratorState>((set) => ({
  configuration: initialConfiguration,
  mode: "guided",
  cameraView: "perspective",
  presenting: false,
  panelOpen: true,
  setConfiguration: (key, value) =>
    set((state) => ({ configuration: { ...state.configuration, [key]: value } })),
  setMode: (mode) => set({ mode }),
  setCameraView: (cameraView) => set({ cameraView }),
  setPresenting: (presenting) => set({ presenting, panelOpen: !presenting }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  reset: () => set({ configuration: initialConfiguration, cameraView: "perspective", mode: "guided" }),
}));
