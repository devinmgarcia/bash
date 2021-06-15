import React, { useContext, useEffect, useState } from "react";
import { Controls } from "../controls/Controls";
import { MatrixGenerator } from "../matrix/MatrixGenerator";
import { PresetContext } from "./PresetProvider";
import { Player } from "../player/Player";

export const Preset = () => {
  const { presets, getPresets, setPresets } = useContext(PresetContext);
  const [preset, setPreset] = useState({ name: "", sequences: [] });
  const [playing, setPlaying] = useState("")

  useEffect(() => {
    getPresets();
  }, []);

  useEffect(() => {
    const initialPreset = presets[0] || { name: "", sequences: [] };
    setPreset(initialPreset);
    console.log("set initial preset");
  }, [presets]);

  return (
    <>
      <div className="drum-wrapper">
        <Controls presetObj={preset} setPreset={setPreset} preset={preset} setPlaying={setPlaying} />
        <MatrixGenerator
          key={preset.id}
          presetObj={preset}
          setPreset={setPreset}
        />
        <Player presetObj={preset} playing={playing} />
      </div>
    </>
  );
};
