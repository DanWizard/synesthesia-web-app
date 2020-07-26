import React, { useEffect, useState } from "react";
import { DashBoardContainer, Portrait } from "./styles";
import { Pt, Sound } from "pts";
import { hertz } from "./notes";

// WHEN FREQ BINS ARE A GIVEN
// **
// time = 1/((desired max hertz) * 2)
// max hertz = (desired time) / 2
// rate = 1 / time
// **

const Home = () => {
  const [start, setStart] = useState(null);
  const [startAnalyzer, setStartAnalyzer] = useState(null);
  const [swi, setSwitch] = useState(null);
  const [clicked, setC] = useState(null);
  const [freq, setFreq] = useState(null);
  const [timeFunc, setFunc] = useState(null);
  const freqBinLen = 256;
  const f_sample = hertz["B6"] * 2;
  const period = (1 / f_sample) * 1000;
  const radialGCC = 12;
  // console.log(period);
  // console.log(f_sample);
  // console.log(f_sample);
  // console.log(f_sample);
  // console.log(f_sample);
  // console.log(f_sample);
  // console.log(f_sample);
  // const cutOffs = []

  // console.log(rate);
  // console.log(time);
  // console.log(hertz["B8"]);

  const clickButton = () => {
    if (timeFunc) {
      stop();
    }
    setC(true);
  };

  const listen = async () => {
    // const si = Sound;
    // const sp = await si.input();
    // debugger;
    const s = await Sound.input();
    const activeSound = s.analyze(freqBinLen, -65);
    // const activeSound = new window.AudioContext({ sampleRate: f_sample });
    // const analyzer = activeSound.createAnalyser();
    // analyzer.minDecibals = -100;
    // analyzer.maxDecibals = -30;
    // analyzer.smoothingTimeConstant = 0.8;
    // analyzer.fftSize = 256;
    // const bufferLength = analyzer.frequencyBinCount;
    // const dataArray = new Uint8Array(bufferLength);
    // console.log(analyzer.getByteFrequencyData(dataArray));
    // console.log(activeSound);
    // console.log(analyzer);

    // if (activeSound) debugger;
    setStart(activeSound);
    // setStartAnalyzer(analyzer);
    change();
  };

  useEffect(() => {
    if (clicked) {
      if (!start) {
        listen();
      } else {
        change();
      }
    }
  }, [start, clicked, startAnalyzer, swi]);

  const getMean = (arr) => {
    let sum = 0;
    arr.forEach((a) => {
      sum += a;
    });
    return sum / arr.length;
  };

  const getMax = (arr) => {
    //need to return max magnitude AND index of frequency bin
    let max = 0;
    let index = null;
    // [1,2,3,4]
    arr.forEach((element, i) => {
      if (element > max) {
        max = element;
        index = i;
      }
    });
    return { max, index };
  };

  const change = () => {
    if (!timeFunc) {
      const func = setInterval(() => {
        console.log("does not exist");
        // debugger;
        if (start || startAnalyzer) {
          console.log("does exist");
          // debugger;
          const f = filterFreq();
          // console.log(f);
          setFreq(f);
        }
      }, period);
      setFunc(func);
    }
  };

  const stop = () => {
    clearInterval(timeFunc);
  };

  const filterFreq = () => {
    console.log("does not exist");
    // debugger;
    if (start) {
      console.log("does exist");
      // debugger;
      let arr = start.freqDomain();
      let iter = 0;
      let count = 0;
      const fSet = Math.floor(arr.length / radialGCC);
      const remainder = arr.length % radialGCC;
      const buckets = {};
      console.log(arr);
      do {
        let add = 0;
        if (iter === 0) {
          add = remainder;
        }

        const vals = getMax(arr.slice(count, count + fSet + add));
        const IndexOfMaxY = vals.index;
        buckets[iter] = vals.max;
        count = count + fSet + add;

        const delta =
          0.5 *
          ((arr[IndexOfMaxY - 1] - arr[IndexOfMaxY + 1]) /
            (arr[IndexOfMaxY - 1] -
              2.0 * arr[IndexOfMaxY] +
              arr[IndexOfMaxY + 1]));
        const interpolatedX =
          ((IndexOfMaxY + delta) * f_sample) / (freqBinLen - 1);
        if (IndexOfMaxY == Math.floor(freqBinLen / 2)) {
          //To improve calculation on edge values
          interpolatedX = ((IndexOfMaxY + delta) * f_sample) / freqBinLen;
        }
        iter += 1;
      } while (iter < radialGCC);
      // console.log(testFobj);
      // console.log(fObj);
      return buckets;
    } else {
      return 0;
    }
  };

  // const g = () => {
  //   return rgb ? (rgb[1] > 254 ? 0 : rgb[1] + 1) : 50;
  // };

  // const b = () => {
  //   return rgb ? (rgb[2] > 254 ? 0 : rgb[2] + 1) : 50;
  // };

  return (
    <DashBoardContainer>
      <Portrait onClick={clickButton} fObj={freq}></Portrait>
    </DashBoardContainer>
  );
};

export default Home;
