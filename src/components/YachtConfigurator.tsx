"use client";

import dynamic from "next/dynamic";
import { Camera, Info, Maximize2, PanelRightClose, PanelRightOpen, RotateCcw, Ship } from "lucide-react";
import { ControlPanel } from "./ControlPanel";
import { useConfigurator, type CameraView } from "@/store/configurator";

const YachtScene = dynamic(() => import("./YachtScene").then((module) => module.YachtScene), {
  ssr: false,
  loading: () => (
    <div className="scene-loading" role="status">
      <span className="loading-line" />
      <span>Preparing concept model…</span>
    </div>
  ),
});

const views: readonly { value: CameraView; label: string }[] = [
  { value: "perspective", label: "Perspective" },
  { value: "profile", label: "Profile" },
  { value: "top", label: "Top" },
  { value: "front", label: "Front" },
];

export function YachtConfigurator() {
  const configuration = useConfigurator((state) => state.configuration);
  const cameraView = useConfigurator((state) => state.cameraView);
  const setCameraView = useConfigurator((state) => state.setCameraView);
  const presenting = useConfigurator((state) => state.presenting);
  const setPresenting = useConfigurator((state) => state.setPresenting);
  const panelOpen = useConfigurator((state) => state.panelOpen);
  const setPanelOpen = useConfigurator((state) => state.setPanelOpen);
  const reset = useConfigurator((state) => state.reset);

  return (
    <main className={`app-shell${presenting ? " is-presenting" : ""}${panelOpen ? " has-panel" : ""}`}>
      <a className="skip-link" href="#configuration-panel">Skip to configuration</a>

      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true"><Ship size={21} /></span>
          <div>
            <h1>Yacht Concept Studio</h1>
            <span className="concept-status"><span aria-hidden="true" />Conceptual design</span>
          </div>
        </div>

        <div className="topbar-actions">
          {!presenting && (
            <button className="icon-action" type="button" onClick={() => setPanelOpen(!panelOpen)} aria-label={panelOpen ? "Hide configuration panel" : "Show configuration panel"}>
              {panelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </button>
          )}
          <button className="primary-action" type="button" onClick={() => setPresenting(!presenting)}>
            <Maximize2 size={18} aria-hidden="true" />
            {presenting ? "Exit presentation" : "Present"}
          </button>
        </div>
      </header>

      <section className="workspace" aria-label="Yacht concept workspace">
        <div className="viewport-wrap">
          <YachtScene />

          <div className="viewport-caption">
            <span className="caption-title">Placeholder platform / YC-01</span>
            <span className="technical-value">LOA {configuration.length.toFixed(1)} m · Beam {configuration.beam.toFixed(1)} m</span>
          </div>

          <nav className="view-rail" aria-label="Camera views">
            <span className="view-rail-title"><Camera size={16} aria-hidden="true" />View</span>
            {views.map((view) => (
              <button key={view.value} type="button" aria-pressed={cameraView === view.value} onClick={() => setCameraView(view.value)}>
                {view.label}
              </button>
            ))}
          </nav>

          <div className="canvas-toolbar" aria-label="Canvas actions">
            <span className="canvas-hint">Drag to orbit · Scroll to zoom</span>
            <button type="button" onClick={reset}><RotateCcw size={17} aria-hidden="true" />Reset concept</button>
          </div>
        </div>

        {panelOpen && !presenting && <div id="configuration-panel"><ControlPanel /></div>}
      </section>

      <div className="sr-only" aria-live="polite">
        Yacht concept updated: {configuration.length} metre length, {configuration.beam} metre beam, {configuration.bowProfile} bow.
      </div>

      <footer className="mobile-concept-note">
        <Info size={16} aria-hidden="true" /> Concept model only—not engineering or build documentation.
      </footer>
    </main>
  );
}
