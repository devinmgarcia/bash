import React, { useEffect, useContext, useState } from "react";
import leftArrow from "../../images/arrow-left.svg";
import rightArrow from "../../images/arrow-right.svg";
import play from "../../images/play.svg";
import pause from "../../images/pause.svg";
import save from "../../images/save.svg";
import edit from "../../images/edit.svg";
import trash from "../../images/trash.svg";
import "./Controls.css";
import { PresetContext } from "../presets/PresetProvider";
import { SequenceContext } from "../sequences/SequenceProvider";

export const Controls = ({ presetObj, setPreset, preset, setPlaying, setTempo, tempo, setNamePreset }) => {
  const { presets, getPresets, addPreset, deletePreset, globalPresets, getGlobalPresets } = useContext(PresetContext);
  const { addSequence, editSequence, deleteSequence } = useContext(SequenceContext);
  const [endOfPresets, setEndOfPresets] = useState()

  useEffect(()=>{
    getGlobalPresets()
  },[addSequence])

  useEffect(() => {
    getPresets();
  }, []);

  const TogglePreset = (increment) => {
    //find the next presets index postion based off of the increment value
    const presetIndex = presets.findIndex((preset) => preset.id === presetObj.id) + increment;
      // check if that preset index exists in the presets array
    if (presets[presetIndex]) {
      // if the next preset is the "user preset" in the database, and there is a preset after it, we skip over the "user preset"
      if(presets[presetIndex].name === "User Preset" && presets[presetIndex].userId === 0 && presets[presetIndex+1]){
        if (increment > 0){
          setPreset(presets[presetIndex+1]);
        }else {
          setPreset(presets[presetIndex-1]);
        }
      } else {
        if (!endOfPresets || increment < 1) {
          if (endOfPresets){
            setEndOfPresets(false)
            setPreset(presets[presets.length -1])
          } else {
            setPreset(presets[presetIndex]);
          }
        }
      }
    } else if (!presets[presetIndex] && increment > 0 && preset.userId !== 0) {
      setEndOfPresets(true)
      setPreset(presets[3]);
    }
  };

  const SavePreset = () => {
    setEndOfPresets(false)
    if (preset.userEditable && preset.userId === 0) {
      const newPreset = {
        name: preset.name,
        userEditable: true,
        userId: parseInt(localStorage.getItem("bash_user")),
      };
     
      const HHSequenceObj = {
        inst: "hh",
        pattern: preset.sequences[0].pattern,
        presetId: [...globalPresets].pop().id + 1,
      };
   
      const SDSequenceObj = {
        inst: "sd",
        pattern: preset.sequences[1].pattern,
        presetId: [...globalPresets].pop().id + 1,
      };
  
      const BDSequenceObj = {
        inst: "bd",
        pattern: preset.sequences[2].pattern,
        presetId: [...globalPresets].pop().id + 1,
      };

      addPreset(newPreset, HHSequenceObj,SDSequenceObj, BDSequenceObj);
      
    } else if (preset.userEditable) {
      const HHSequenceObj = {
        id: preset.sequences[0].id,
        inst: "hh",
        pattern: preset.sequences[0].pattern,
        presetId: preset.sequences[0].presetId,
      };
      editSequence(HHSequenceObj);

      const SDSequenceObj = {
        id: preset.sequences[1].id,
        inst: "sd",
        pattern: preset.sequences[1].pattern,
        presetId: preset.sequences[1].presetId,
      };
      editSequence(SDSequenceObj);

      const BDSequenceObj = {
        id: preset.sequences[2].id,
        inst: "bd",
        pattern: preset.sequences[2].pattern,
        presetId: preset.sequences[2].presetId,
      };
      editSequence(BDSequenceObj);
    }
  };

  const EditPreset = () => {
    setNamePreset(true)
  };

  const DeletePreset = (event) => {
    event.preventDefault()
    if(preset.userEditable && preset.userId !== 0) {
      const sequencesToBeDeleted = []
      for (const sequence of preset.sequences) {
        const deletedSequence = deleteSequence(sequence)
        sequencesToBeDeleted.push(deletedSequence)
      }
      Promise.all(sequencesToBeDeleted).then(()=>{deletePreset(preset)})
    } 
  };

  const Play = () => {
    setPlaying(true)
  }

  const Pause = () => {
    setPlaying(false)
  }

  const TempoSlider = (event) => {
    event.preventDefault()
    setTempo(event.target.value)
  }

  return (
    <div className={"controls-wrapper"}>
      <div className={"drum-logo"}>BASH</div>
      <div className={"preset-menu"}>
        <img alt=""
          onClick={(event) => {
            event.preventDefault();
            TogglePreset(-1);
          }}
          className={"controls"}
          src={leftArrow}
          id={"arrow-left"}
        />
        <div className={"menu-screen"} id={`preset--${presetObj.id}`}>
          {presetObj.name} {tempo}
        </div>
        <img alt=""
          onClick={(event) => {
            event.preventDefault();
            TogglePreset(1);
          }}
          className={"controls"}
          src={rightArrow}
          id={"arrow-right"}
        />
        <img alt=""
          onClick={SavePreset}
          className={"controls saveButton"}
          id={"save"}
          src={save}
        />
        <img alt=""
          onClick={EditPreset}
          className={"controls editButton"}
          id={"edit"}
          src={edit}
        />
        <img alt=""
          onClick={DeletePreset}
          className={"controls deleteButton"}
          id={"delete"}
          src={trash}
        />
      </div>
      <div className={"slidecontainer right-side-controls"}>
        <input
          type={"range"}
          min={"30"}
          max={"300"}
          defaultValue={"120"}
          class={"slider"}
          id={"myRange"}
          onChange={TempoSlider}
        />
      </div>
      <div class={"transport"}>
        <img onClick={Play} className={"controls playButton"} id={"play"} alt="" src={play} />
        <img onClick={Pause} className={"controls pauseButton"} id={"pause"} alt="" src={pause} />
      </div>
    </div>
  );
};
