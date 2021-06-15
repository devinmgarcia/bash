import React, { useEffect, useContext } from "react";
import leftArrow from "../../images/arrow-left.svg";
import rightArrow from "../../images/arrow-right.svg";
import play from "../../images/play.svg";
import pause from "../../images/pause.svg";
import save from "../../images/save.svg";
import edit from "../../images/edit.svg";
import "./Controls.css";
import { PresetContext } from "../presets/PresetProvider";
import { SequenceContext } from "../sequences/SequenceProvider";
// import {Player} from "../player/Player"



export const Controls = ({ presetObj, setPreset, preset, setPlaying }) => {
  const { presets, getPresets, addPreset } = useContext(PresetContext);
  const { addSequence, editSequence } = useContext(SequenceContext);

  useEffect(() => {
    getPresets();
  }, []);

  const TogglePreset = (increment) => {
    //find the next presets index postion based off of the increment value
    const presetIndex =
      presets.findIndex((preset) => preset.id === presetObj.id) + increment;
      // check if that preset index exists in the presets array
    if (presets[presetIndex]) {
      // if the next preset is the "user preset" in the database, and there is a preset after it, we skip over the "user preset"
      if(presets[presetIndex].id === 4 && presets[presetIndex+1]){
        if (increment > 0){
          setPreset(presets[presetIndex+1]);
        }else {
          setPreset(presets[presetIndex-1]);
        }
      }
      else {
        setPreset(presets[presetIndex]);
      }
    } else if (!presets[presetIndex] && increment > 0 && preset.id !== presets[3].id) {
      setPreset(presets[3]);
    }
  };

  const SavePreset = () => {
    if (preset.userEditable && preset.userId === 0) {
      const newPreset = {
        name: preset.name,
        userEditable: true,
        userId: parseInt(localStorage.getItem("bash_user")),
      };
      addPreset(newPreset);

      const HHSequenceObj = {
        inst: "hh",
        pattern: preset.sequences[0].pattern,
        presetId: [...presets].pop().id + 1,
      };
      addSequence(HHSequenceObj);

      const SDSequenceObj = {
        inst: "sd",
        pattern: preset.sequences[1].pattern,
        presetId: [...presets].pop().id + 1,
      };
      addSequence(SDSequenceObj);

      const BDSequenceObj = {
        inst: "bd",
        pattern: preset.sequences[2].pattern,
        presetId: [...presets].pop().id + 1,
      };
      addSequence(BDSequenceObj);
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

  const EditPreset = () => {};

  const Play = () => {
    setPlaying(true)
  }

  const Pause = () => {
    setPlaying(false)
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
          {presetObj.name}
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
      </div>
      <div className={"slidecontainer right-side-controls"}>
        <input
          type={"range"}
          min={"30"}
          max={"300"}
          value={"120"}
          class={"slider"}
          id={"myRange"}
        />
      </div>
      <div class={"transport"}>
        <img onClick={Play} className={"controls playButton"} id={"play"} alt="" src={play} />
        <img onClick={Pause} className={"controls pauseButton"} id={"pause"} alt="" src={pause} />
      </div>
    </div>
  );
};
