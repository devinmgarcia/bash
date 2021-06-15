import React, { useState, useEffect, useContext } from "react";
import kickUrl from "../../samples/bass_sample.mp3"
import snareUrl from "../../samples/clap_sample.mp3"
import hihatUrl from "../../samples/hh_sample.mp3"

let audioContext = new AudioContext();
let futureTickTime = audioContext.currentTime;
let counter = 0;
let tempo = 120;
let secondsPerBeat = 60 / tempo;
let counterTimeValue = secondsPerBeat / 4;
let kick;
let snare;
let hihat;

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

  function playSample(audioContext, audioBuffer, time) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination);
    sampleSource.start(time);
    return sampleSource;
  }

export const Player = ({presetObj, playing}) => {

    const Scheduler = (presetObj) => {

    const hh = presetObj.sequences[0].pattern;
    const sd = presetObj.sequences[1].pattern;
    const bd = presetObj.sequences[2].pattern;
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

      //   stepHead(counter, 15);
      futureTickTime += counterTimeValue;
      counter++;
      if (counter > 15) {
        counter = 0;
      }
    }
  };
  useEffect(() => {
    let timer;
    if (playing) {
      audioContext.resume()
      timer = setInterval(() => {
        Scheduler(presetObj)
      }, futureTickTime);
    } else{
      audioContext.suspend()
    }
    return () => clearInterval(timer);
  }, [playing]);
  return "";
};
