"use client";

import { ChevronDown, Layers3, Palette, SlidersHorizontal, Sun } from "lucide-react";
import {
  useConfigurator,
  type BowProfile,
  type DeckFinish,
  type Environment,
  type HullColour,
} from "@/store/configurator";

function RangeControl({ id, label, value, min, max, step, unit, onChange }: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="range-control">
      <div className="control-label-row">
        <label htmlFor={id}>{label}</label>
        <output className="technical-value" htmlFor={id}>
          {step < 1 ? value.toFixed(2) : value.toFixed(1)}{unit ? ` ${unit}` : ""}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="range-bounds technical-value" aria-hidden="true">
        <span>{min}{unit ? ` ${unit}` : ""}</span>
        <span>{max}{unit ? ` ${unit}` : ""}</span>
      </div>
    </div>
  );
}

function OptionGroup<Option extends string>({ label, value, options, onChange }: {
  label: string;
  value: Option;
  options: readonly { value: Option; label: string }[];
  onChange: (value: Option) => void;
}) {
  return (
    <fieldset className="option-fieldset">
      <legend>{label}</legend>
      <div className="option-group">
        {options.map((option) => (
          <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const hullSwatches: readonly { value: HullColour; label: string; colour: string }[] = [
  { value: "white", label: "White", colour: "#f4f5f3" },
  { value: "silver", label: "Silver", colour: "#bdc3c3" },
  { value: "graphite", label: "Graphite", colour: "#343b3c" },
  { value: "teal", label: "Deep teal", colour: "#174f56" },
];

const deckSwatches: readonly { value: DeckFinish; label: string; colour: string }[] = [
  { value: "natural", label: "Natural", colour: "#b28a61" },
  { value: "smoked", label: "Smoked", colour: "#756252" },
  { value: "graphite", label: "Graphite", colour: "#373a38" },
];

function Swatches<Option extends string>({ label, value, options, onChange }: {
  label: string;
  value: Option;
  options: readonly { value: Option; label: string; colour: string }[];
  onChange: (value: Option) => void;
}) {
  return (
    <fieldset className="swatch-fieldset">
      <legend>{label}</legend>
      <div className="swatch-list">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-label={`${label}: ${option.label}`}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            <span className="swatch" style={{ backgroundColor: option.colour }} />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function PanelSection({ title, icon, children, open = true }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="panel-section" open={open}>
      <summary>
        <span className="section-title">{icon}{title}</span>
        <ChevronDown size={17} aria-hidden="true" />
      </summary>
      <div className="section-content">{children}</div>
    </details>
  );
}

export function ControlPanel() {
  const configuration = useConfigurator((state) => state.configuration);
  const mode = useConfigurator((state) => state.mode);
  const setMode = useConfigurator((state) => state.setMode);
  const setConfiguration = useConfigurator((state) => state.setConfiguration);

  return (
    <aside className="control-panel" aria-label="Yacht configuration controls">
      <div className="mode-switch" aria-label="Configuration detail">
        {(["guided", "advanced"] as const).map((item) => (
          <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      <PanelSection title="Proportions" icon={<SlidersHorizontal size={18} aria-hidden="true" />}>
        <RangeControl id="length" label="Length overall" value={configuration.length} min={30} max={70} step={1} unit="m" onChange={(value) => setConfiguration("length", value)} />
        <RangeControl id="beam" label="Beam" value={configuration.beam} min={6} max={12} step={0.2} unit="m" onChange={(value) => setConfiguration("beam", value)} />
      </PanelSection>

      <PanelSection title="Architecture" icon={<Layers3 size={18} aria-hidden="true" />}>
        <OptionGroup<BowProfile>
          label="Bow profile"
          value={configuration.bowProfile}
          options={[
            { value: "fine", label: "Fine" },
            { value: "balanced", label: "Balanced" },
            { value: "bold", label: "Bold" },
          ]}
          onChange={(value) => setConfiguration("bowProfile", value)}
        />
        <RangeControl id="superstructure" label="Superstructure height" value={configuration.superstructure} min={0.78} max={1.28} step={0.02} onChange={(value) => setConfiguration("superstructure", value)} />
        {mode === "advanced" && (
          <div className="advanced-controls">
            <div className="advanced-note">Advanced geometry</div>
            <RangeControl id="upper-deck" label="Upper deck length" value={configuration.upperDeck} min={0.58} max={1} step={0.02} onChange={(value) => setConfiguration("upperDeck", value)} />
            <RangeControl id="glazing" label="Glazing extent" value={configuration.glazing} min={35} max={95} step={1} unit="%" onChange={(value) => setConfiguration("glazing", value)} />
          </div>
        )}
      </PanelSection>

      <PanelSection title="Materials" icon={<Palette size={18} aria-hidden="true" />}>
        <Swatches<HullColour> label="Hull colour" value={configuration.hullColour} options={hullSwatches} onChange={(value) => setConfiguration("hullColour", value)} />
        <Swatches<DeckFinish> label="Deck finish" value={configuration.deckFinish} options={deckSwatches} onChange={(value) => setConfiguration("deckFinish", value)} />
      </PanelSection>

      <PanelSection title="Environment" icon={<Sun size={18} aria-hidden="true" />} open={false}>
        <OptionGroup<Environment>
          label="Lighting"
          value={configuration.environment}
          options={[
            { value: "studio", label: "Studio" },
            { value: "daylight", label: "Daylight" },
            { value: "dusk", label: "Dusk" },
          ]}
          onChange={(value) => setConfiguration("environment", value)}
        />
      </PanelSection>

      <p className="concept-note">This model supports early-stage ideation. Dimensions and forms are conceptual, not construction documentation.</p>
    </aside>
  );
}
