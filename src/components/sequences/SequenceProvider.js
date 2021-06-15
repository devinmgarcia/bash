import React, { useState, createContext } from "react";

const api = "http://localhost:8088";

export const SequenceContext = createContext();

export const SequenceProvider = (props) => {
  const [sequences, setSequences] = useState([]);
  // const [sequence, setSequence] = useState({});

  const getSequences = () => {
    return fetch(`${api}/sequences?_expand=preset`)
      .then((res) => res.json())
      .then(setSequences);
  };

  const addSequence = (sequenceObj) => {
    return fetch(`${api}/sequences`, {
      method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sequenceObj)
    }).then(getSequences) // do i need this?
  }

  const editSequence = (sequenceObj) => {
    return fetch(`${api}/sequences/${sequenceObj.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sequenceObj),
      }).then(getSequences)
  };

  return (
    <SequenceContext.Provider
      value={{
        sequences,
        setSequences,
        getSequences,
        addSequence,
        editSequence
      }}
    >
      {props.children}
    </SequenceContext.Provider>
  );
};
