import React, { useState, createContext, useContext } from "react";
import { SequenceContext } from "../sequences/SequenceProvider";

const api = "http://localhost:8088";

export const PresetContext = createContext();

export const PresetProvider = (props) => {
  const { addSequence } = useContext(SequenceContext);
  const [presets, setPresets] = useState([]);
  const [preset, setPreset] = useState({});
  const [globalPresets, setGlobalPresets] = useState({});

  const getPresets = () => {
    return fetch(
      `${api}/presets?userId=0&userId=${localStorage.getItem(
        "bash_user"
      )}&_embed=sequences`
    )
      .then((res) => res.json())
      .then(setPresets);
  };

  const getGlobalPresets = () => {
    return fetch(`${api}/presets`)
      .then((res) => res.json())
      .then(setGlobalPresets);
  };

  const addPreset = (
    presetObj,
    HHSequenceObj,
    SDSequenceObj,
    BDSequenceObj
  ) => {
    return fetch(`${api}/presets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(presetObj),
    })
      .then(() => {
        addSequence(HHSequenceObj);
      })
      .then(() => {
        addSequence(SDSequenceObj);
      })
      .then(() => {
        addSequence(BDSequenceObj);
      })
      .then(getPresets);
  };

  const editPreset = (presetObj) => {
    return fetch(`${api}/presets/${presetObj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(presetObj),
    }).then(getPresets);
  };

  const deletePreset = (presetObj) => {
    return fetch(`${api}/presets/${presetObj.id}`, {
      method: "DELETE",
    }).then(getPresets);
  };

  return (
    <PresetContext.Provider
      value={{
        preset,
        setPreset,
        presets,
        setPresets,
        getPresets,
        addPreset,
        editPreset,
        deletePreset,
        globalPresets,
        getGlobalPresets,
      }}
    >
      {props.children}
    </PresetContext.Provider>
  );
};
