import React, { useState, useEffect, useContext } from "react";
import { SequenceContext } from "../sequences/SequenceProvider";
import "./Matrix.css"

export const MatrixGenerator = ({ presetObj, setPreset, patternLength }) => {
  const { sequences, getSequences } = useContext(SequenceContext);
  const [RDSequence, setRDSequence] = useState({})
  const [HHSequence, setHHSequence] = useState({})
  const [SDSequence, setSDSequence] = useState({})
  const [BDSequence, setBDSequence] = useState({})

  useEffect(() => {
    const presetSequences = presetObj.sequences.filter(
      (sequence) => sequence.presetId === presetObj.id
    ) || { pattern: [] };
    setRDSequence(presetSequences.find(preset=>preset.inst === "rd"));
    setHHSequence(presetSequences.find(preset=>preset.inst === "hh"));
    setSDSequence(presetSequences.find(preset=>preset.inst === "sd"));
    setBDSequence(presetSequences.find(preset=>preset.inst === "bd"));
  }, [sequences]);

  useEffect(() => {
    getSequences();
  }, []);

  const togglePad = (event) => {
    if (event.target.id.startsWith("rd")) {
      const [,rdPad] = event.target.id.split("--")
      const RDSequenceCopy = {...RDSequence}
      const togglePad = RDSequenceCopy.pattern[rdPad] === 1 ? 0 : 1
      RDSequenceCopy.pattern.splice(parseInt(rdPad), 1, togglePad)
      setRDSequence(RDSequenceCopy)
      const presetObjCopy = {...presetObj}
      presetObjCopy.sequences[0] = RDSequenceCopy
      setPreset(presetObjCopy)   
    }
    if (event.target.id.startsWith("hh")) {
      const [,hhPad] = event.target.id.split("--")
      const HHSequenceCopy = {...HHSequence}
      const togglePad = HHSequenceCopy.pattern[hhPad] === 1 ? 0 : 1
      HHSequenceCopy.pattern.splice(parseInt(hhPad), 1, togglePad)
      setHHSequence(HHSequenceCopy)
      const presetObjCopy = {...presetObj}
      presetObjCopy.sequences[1] = HHSequenceCopy
      setPreset(presetObjCopy)
    }
    if (event.target.id.startsWith("sd")) {
      const [,sdPad] = event.target.id.split("--")
      const SDSequenceCopy = {...SDSequence}
      const togglePad = SDSequenceCopy.pattern[sdPad] === 1 ? 0 : 1
      SDSequenceCopy.pattern.splice(parseInt(sdPad), 1, togglePad)
      setSDSequence(SDSequenceCopy)
      const presetObjCopy = {...presetObj}
      presetObjCopy.sequences[2] = SDSequenceCopy
      setPreset(presetObjCopy)
    }
    if (event.target.id.startsWith("bd")) {
      const [,bdPad] = event.target.id.split("--")
      const BDSequenceCopy = {...BDSequence}
      const togglePad = BDSequenceCopy.pattern[bdPad] === 1 ? 0 : 1
      BDSequenceCopy.pattern.splice(parseInt(bdPad), 1, togglePad)
      setBDSequence(BDSequenceCopy)
      const presetObjCopy = {...presetObj}
      presetObjCopy.sequences[3] = BDSequenceCopy
      setPreset(presetObjCopy)   
    }
  }

  const Matrix = ({ selectedPreset }) => {
    const sequences = selectedPreset.sequences;

    let jsx = [];

    for (let i = 0; i < 16; i++) {
      let beat
      if (i > patternLength - 1) {
        beat = "inactive"
      } else if (i < 4){
        beat = 1
      } else if (3 < i && i < 8) {
        beat = 2
      } else if (7 < i && i < 12) {
        beat = 3
      } else if (11 < i) {
        beat = 4
      }
      jsx.push(
        <div className="pad-column" id={`column--${i}`}>
          {sequences.map((sequence) => {
            return (
              <div
                key={sequence.id}
                onClick={togglePad}
                id={`${sequence.inst}--${i}`}
                className={`${'pad-'}${beat} ${sequence.pattern[i] ? `active${beat}` : ""}`}
              ></div>
            );
          })}
        </div>
      );
    }
    return <div className="drums">{jsx}</div>
  };

  return (
    <>
        <Matrix key={presetObj.id} selectedPreset={presetObj} />    
    </>
  );
};
