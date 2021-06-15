import React, { useState, createContext } from "react";

const api = "http://localhost:8088";

export const PresetContext = createContext();

export const PresetProvider = (props) => {
  const [presets, setPresets] = useState([]);
  const [preset, setPreset] = useState({});

  const getPresets = () => {
    return fetch(`${api}/presets?userId=0&userId=${localStorage.getItem("bash_user")}&_embed=sequences`)
      .then((res) => res.json())
      .then(setPresets);
  };

  const addPreset = (presetObj) => {
    return fetch(`${api}/presets`, {
      method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(presetObj)
    }).then(getPresets)  // do i need this?
  }

  const editPreset = (presetObj) => {
    return fetch(`${api}/presets/${presetObj.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(presetObj),
      }).then(getPresets)
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
        editPreset
      }}
    >
      {props.children}
    </PresetContext.Provider>
  );
};
