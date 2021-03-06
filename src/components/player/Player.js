import {useEffect } from "react";
// import kickUrl from "../../samples/bass_sample.mp3";
import kickUrl from "../../samples/kick-glowstix.wav";
// import snareUrl from "../../samples/clap_sample.mp3";
import snareUrl from "../../samples/snare-arena.wav";
// import hihatUrl from "../../samples/hh_sample.mp3";
import hihatUrl from "../../samples/closed-hh1.wav";

import rideUrl from "../../samples/ride-bro.wav";

var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false; 

if (AudioContext) {
    var audioContext = new AudioContext; 
} else {  
    alert("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
}


let futureTickTime = audioContext.currentTime;
let counter = 0;
let kick;
let snare;
let hihat;
let ride;

async function getFile(audioContext, filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

async function setupSample(sampleUrl) {
  const filePath = sampleUrl;
  const sample = await getFile(audioContext, filePath);
  return sample;
}

setupSample(kickUrl).then((sample) => {
  kick = sample;
});
setupSample(snareUrl).then((sample) => {
  snare = sample;
});
setupSample(hihatUrl).then((sample) => {
  hihat = sample;
});
setupSample(rideUrl).then((sample) => {
  ride = sample;
});

function playSample(audioContext, audioBuffer, time) {
  const sampleSource = audioContext.createBufferSource();
  sampleSource.buffer = audioBuffer;
  sampleSource.connect(audioContext.destination);
  sampleSource.start(time);
  return sampleSource;
}

export const Player = ({ presetObj, playing, counterTimeValue, patternLength}) => {

  const stepHead = (currentStep, seqLength) => {
    if (currentStep === 0) {
      if (
        document
          .getElementById(`column--${seqLength}`)
          .classList.contains("column-border")
      ) {
        document
          .getElementById(`column--${seqLength}`)
          .classList.remove("column-border");
      }
      document
        .getElementById(`column--${currentStep}`)
        .classList.add("column-border");
    } else if (currentStep > 0 && currentStep <= seqLength) {
      document
        .getElementById(`column--${currentStep - 1}`)
        .classList.remove("column-border");
      document
        .getElementById(`column--${currentStep}`)
        .classList.add("column-border");
    }
  };

  const Scheduler = (preset) => {
    const rd = preset.sequences[0].pattern;
    const hh = preset.sequences[1].pattern;
    const sd = preset.sequences[2].pattern;
    const bd = preset.sequences[3].pattern;
    if (futureTickTime < audioContext.currentTime + 0.1) {
      if (hh[counter]) {
        playSample(audioContext, hihat, futureTickTime);
      }
      if (sd[counter]) {
        playSample(audioContext, snare, futureTickTime);
      }
      if (bd[counter]) {
        playSample(audioContext, kick, futureTickTime);
      }
      if (rd[counter]) {
        playSample(audioContext, ride, futureTickTime);
      }
      stepHead(counter, patternLength - 1);
      futureTickTime += counterTimeValue;
      counter++;
      if (counter > patternLength - 1) {
        counter = 0;
      }
    }
  };

  useEffect(() => {
    let timer;
    if (playing) {
      audioContext.resume();
      timer = setInterval(() => {
        Scheduler(presetObj);
      }, 0);
    } else {
      audioContext.suspend();
      counter = 0;
    }
    return () => clearInterval(timer);
  }, [playing, presetObj, counterTimeValue, patternLength]);
  return "";
};
