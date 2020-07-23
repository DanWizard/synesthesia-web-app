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
  const [clicked, setC] = useState(null);
  const [freq, setFreq] = useState(null);
  const [timeFunc, setFunc] = useState(null);
  const freqBinLen = 256;
  const f_sample = hertz["B8"] * 2;
  const period = (1 / f_sample) * 1000;
  const radialGCC = 12;

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
    // const si = Sound
    // const sp = await si.input()
    debugger
    const s = await Sound.input();
    const activeSound = s.analyze(freqBinLen);
    setStart(activeSound);
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
  }, [start, clicked]);

  const getMean = (arr) => {
    let sum = 0;
    arr.forEach((a) => {
      sum += a;
    });
    return sum / arr.length;
  };

  const getMax = (arr) => {
    return Math.max(...arr);
  };

  const change = () => {
    if (!timeFunc) {
      const func = setInterval(() => {
        if (start) {
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
    if (start) {
      let arr = start.freqDomain();
      // arr = arr.slice(0, 250);
      let iter = 0;
      let count = 0;
      const fSet = Math.floor(arr.length / radialGCC);
      const remainder = arr.length % radialGCC;
      let testFobj = {};
      const fObj = {};
      console.log(arr);
      do {
        let add = 0;
        if (iter === 0) {
          add = remainder;
        }
        testFobj[iter] = arr.slice(count, count + fSet + add);
        fObj[iter] = getMax(arr.slice(count, count + fSet + add));
        count = count + fSet + add;
        iter += 1;
      } while (iter < radialGCC);
      console.log(testFobj);
      // console.log(fObj);
      return fObj;
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
