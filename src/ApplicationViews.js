import React from "react";
import { Route } from "react-router-dom";
// import { Controls } from "./components/controls/Controls";
// import { MatrixGenerator } from "./components/matrix/MatrixGenerator";
import { Preset } from "./components/presets/Preset";
import { PresetProvider } from "./components/presets/PresetProvider";
// import { Sequence } from "./components/sequences/Sequence";
import { SequenceProvider } from "./components/sequences/SequenceProvider";
// import { Player } from "./components/player/Player";

export const ApplicationViews = () => {
  return (
    <>
      <SequenceProvider>
        <PresetProvider>
          <Route exact path="/">
            <Preset />
          </Route>
        </PresetProvider>
      </SequenceProvider>
    </>
  );
};
