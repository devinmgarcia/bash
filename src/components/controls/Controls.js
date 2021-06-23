import React, { useEffect, useContext, useState } from "react";
import leftArrow from "../../images/arrow-left.svg";
import rightArrow from "../../images/arrow-right.svg";
import play from "../../images/play.svg";
import stop from "../../images/stop.svg";
import save from "../../images/save.svg";
import edit from "../../images/edit.svg";
import trash from "../../images/trash.svg";
import plus from "../../images/plus.svg";
import minus from "../../images/minus.svg";
import "./Controls.css";
import { PresetContext } from "../presets/PresetProvider";
import { SequenceContext } from "../sequences/SequenceProvider";

export const Controls = ({
  presetObj,
  setPreset,
  preset,
  setPlaying,
  setTempo,
  tempo,
  namePreset,
  setNamePreset,
  timeSignature,
  setTimeSignature,
  setInitialRun,
}) => {
  const {
    presets,
    getPresets,
    addPreset,
    deletePreset,
    globalPresets,
    getGlobalPresets,
  } = useContext(PresetContext);
  const { addSequence, editSequence, deleteSequence } =
    useContext(SequenceContext);
  const [endOfPresets, setEndOfPresets] = useState();
  let [userInput, setUserInput] = useState("");

  useEffect(() => {
    getGlobalPresets();
  }, [addSequence]);

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
      if (
        presets[presetIndex].name === "User Preset" &&
        presets[presetIndex].userId === 0 &&
        presets[presetIndex + 1]
      ) {
        if (increment > 0) {
          setPreset(presets[presetIndex + 1]);
        } else {
          setPreset(presets[presetIndex - 1]);
        }
      } else {
        if (!endOfPresets || increment < 1) {
          if (endOfPresets) {
            setEndOfPresets(false);
            setPreset(presets[presets.length - 1]);
          } else {
            setPreset(presets[presetIndex]);
          }
        }
      }
    } else if (!presets[presetIndex] && increment > 0 && preset.userId !== 0) {
      setEndOfPresets(true);
      setPreset(presets[3]);
    }
  };

  const RenderSaveForm = () => {
    setNamePreset(true);
  };

  const SavePreset = () => {
    setEndOfPresets(false);
    setInitialRun(false);
    setNamePreset(false);
    if (preset.userEditable && preset.userId === 0) {
      const newPreset = {
        name: userInput,
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

      addPreset(newPreset, HHSequenceObj, SDSequenceObj, BDSequenceObj);
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
    setNamePreset(true);
  };

  const ChangeTimeSignature = (increment) => {
    if (timeSignature + increment > 0 && timeSignature + increment < 17) {
      setTimeSignature(timeSignature + increment);
    }
  };

  const DeletePreset = (event) => {
    event.preventDefault();
    const presetIndex =
      presets.findIndex((preset) => preset.id === presetObj.id) - 1;
    if (preset.userEditable && preset.userId !== 0) {
      const sequencesToBeDeleted = [];
      for (const sequence of preset.sequences) {
        const deletedSequence = deleteSequence(sequence);
        sequencesToBeDeleted.push(deletedSequence);
      }
      Promise.all(sequencesToBeDeleted).then(() => {
        deletePreset(preset);
      });
      setPreset(presets[presetIndex]);
    }
  };

  const Play = () => {
    setPlaying(true);
  };

  const Stop = () => {
    setPlaying(false);
  };

  const TempoSlider = (event) => {
    event.preventDefault();
    setTempo(event.target.value);
  };

  const HandleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const cancelNamePreset = () => {
    setNamePreset(false);
  };

  const NamePreset = () => {
    return (
      <div className="screen-blur center">
        <div className="popup-wrapper center">
          <div className="flex-child title">Preset Name:</div>
          <div className="flex-child">
            <input
              className="edit-input"
              maxLength={21}
              onChange={HandleUserInput}
              type="text"
            ></input>
            <div className="buttons-wrapper">
              <button
                className="button"
                onClick={SavePreset}
                defaultValue="Preset Name"
              >
                Save
              </button>
              <button className="button" onClick={cancelNamePreset}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={"controls-wrapper"}>
        <div className={"drum-logo"}>BASH</div>
        <div className={"preset-menu"}>
          <img
            alt=""
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
          <img
            alt=""
            onClick={(event) => {
              event.preventDefault();
              TogglePreset(1);
            }}
            className={"controls"}
            src={rightArrow}
            id={"arrow-right"}
          />
          <div className={"timesig-controls-wrapper"}>
            <img
              alt=""
              onClick={(event) => {
                event.preventDefault();
                ChangeTimeSignature(1);
              }}
              className={"timesig-control plusButton"}
              id={"plus"}
              src={plus}
            />
            <img
              alt=""
              onClick={(event) => {
                event.preventDefault();
                ChangeTimeSignature(-1);
              }}
              className={"timesig-control minusButton"}
              id={"minus"}
              src={minus}
            />
          </div>
          <img
            alt=""
            onClick={RenderSaveForm}
            className={"controls saveButton"}
            id={"save"}
            src={save}
          />
          <img
            alt=""
            onClick={EditPreset}
            className={"controls editButton"}
            id={"edit"}
            src={edit}
          />
          <img
            alt=""
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
          <img
            onClick={Play}
            className={"controls playButton"}
            id={"play"}
            alt=""
            src={play}
          />
          <img
            onClick={Stop}
            className={"controls stopButton"}
            id={"stop"}
            alt=""
            src={stop}
          />
        </div>
      </div>
      <div>{namePreset ? NamePreset() : ""}</div>
    </>
  );
};
