import React, { useContext, useEffect, useState } from "react";
import { Controls } from "../controls/Controls";
import { MatrixGenerator } from "../matrix/MatrixGenerator";
import { PresetContext } from "./PresetProvider";
import { Player } from "../player/Player";

export const Preset = () => {
  const { presets, getPresets, setPresets } = useContext(PresetContext);
  const [preset, setPreset] = useState({ name: "", sequences: [] });
  const [playing, setPlaying] = useState("");
  let [tempo, setTempo] = useState(120);
  let [counterTimeValue, setCounterTimeValue] = useState();
  const [namePreset, setNamePreset] = useState();
  let [patternLength, setPatternLength] = useState(16);
  let [timeSignature, setTimeSignature] = useState(16);
  let [initialRun, setInitialRun] = useState(true)
  const [tempTempo, setTempTempo] = useState(16)

  useEffect(() => {
    getPresets();
  }, []);

  useEffect(() => {
    if (initialRun){
      console.log("initial run")
      const initialPreset = presets[0] || { name: "", sequences: [] };
      setPreset(initialPreset);
    } else {
      const newPresetIndex = [...presets].length - 1
      setPreset(presets[newPresetIndex])
    }
  }, [presets]);

  useEffect(() => {
    let secondsPerBeat = 60 / tempo;
    counterTimeValue = secondsPerBeat / 4;
    setCounterTimeValue(counterTimeValue);
  }, [tempo]);

  useEffect(() => { 
    if (preset.sequences.length > 0) {
      setPatternLength(preset.sequences[0].pattern.length);
    }
  }, [preset]);

  useEffect(() => {
    const presetCopy = { ...preset };
    for (const sequence of presetCopy.sequences) {
      if (patternLength < timeSignature){
        sequence.pattern.push(0)
      } else if (patternLength > timeSignature) {
        sequence.pattern.pop()
      }
    }
    setPreset(presetCopy)
  }, [timeSignature]);

  useEffect(()=>{
    if (patternLength !== timeSignature) {
      setTimeSignature(patternLength)
    }
  }, [patternLength])

  return (
    <>
      <section className="drum-section">
        <div className="drum-wrapper">
          <Controls
            presetObj={preset}
            setPreset={setPreset}
            preset={preset}
            setPlaying={setPlaying}
            setTempo={setTempo}
            tempo={tempo}
            namePreset={namePreset}
            setNamePreset={setNamePreset}
            timeSignature={timeSignature}
            setTimeSignature={setTimeSignature}
            setInitialRun={setInitialRun}    
          />
          <MatrixGenerator
            key={preset.id}
            presetObj={preset}
            setPreset={setPreset}
            patternLength={patternLength}
          />
          <Player
            patternLength={patternLength}
            presetObj={preset}
            playing={playing}
            counterTimeValue={counterTimeValue}
          />
        </div>
      </section>
    </>
  );
};
