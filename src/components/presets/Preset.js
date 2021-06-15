import React, { useContext, useEffect, useState } from "react";
import { Controls } from "../controls/Controls";
import { MatrixGenerator } from "../matrix/MatrixGenerator";
import { PresetContext } from "./PresetProvider";
import { Player } from "../player/Player";

export const Preset = () => {
  const { presets, getPresets, setPresets } = useContext(PresetContext);
  const [preset, setPreset] = useState({ name: "", sequences: [] });
  const [playing, setPlaying] = useState("")
  let [tempo, setTempo] = useState(120)
  let [counterTimeValue, setCounterTimeValue] = useState()

  useEffect(() => {
    getPresets();
  }, []);

  useEffect(() => {
    const initialPreset = presets[0] || { name: "", sequences: [] };
    setPreset(initialPreset);
  }, [presets]);

  useEffect(()=>{
    let secondsPerBeat = 60 / tempo;
    counterTimeValue = secondsPerBeat / 4;
    setCounterTimeValue(counterTimeValue)
  },[tempo])

  return (
    <>
      <div className="drum-wrapper">
        <Controls presetObj={preset} setPreset={setPreset} preset={preset} setPlaying={setPlaying} setTempo={setTempo} tempo={tempo} />
        <MatrixGenerator
          key={preset.id}
          presetObj={preset}
          setPreset={setPreset}
        />
        <Player presetObj={preset} playing={playing} counterTimeValue={counterTimeValue}/>
      </div>
    </>
  );
};
