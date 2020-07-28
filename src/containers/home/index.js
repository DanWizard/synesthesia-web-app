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

let f_max;
const freqBinLen = 4096;
const radialGCC = 12;
let bucketBounds = new Int32Array(radialGCC);

const Home = () => {
  const [start, setStart] = useState(null);
  const [clicked, setC] = useState(null);
  const [freq, setFreq] = useState(null);
  const [timeFunc, setFunc] = useState(null);

  const period = .00001;



  const clickButton = () => {
    if (timeFunc) {
      stop();
    }
    setC(true);
  };

  const listen = async () => {
    const s = await Sound.input();
    const activeSound = s.analyze(freqBinLen);
    f_max = activeSound._ctx.sampleRate/2;
    setBounds();
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
    let max = 0;
    let index = null;
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
        if (start) {
          const f = fillBuckets();
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

  const setBounds = () => {
    const f_min = 16
    const delta = f_max/freqBinLen;

    const minf_log = Math.log(f_min);
    const maxf_log = Math.log(f_max);
    const delta_log = (maxf_log - minf_log)/radialGCC;

    bucketBounds[0] = 0;

    for(let i = 0; i < radialGCC;i++){
      const idealBound = Math.exp((delta_log * (i+1)) + minf_log);
      console.log(idealBound);
      const actualBound = Math.floor(idealBound/delta);
      bucketBounds[i+1] = actualBound;

    }

  }

  const fillBuckets = () => {

    if (start) {
      let arr = start.freqDomain();
      let i = 0;

      const buckets = {};
      console.log(arr);
      while(i < radialGCC){
        const vals = getMax(arr.slice(bucketBounds[i], bucketBounds[i+1]-1));
        const IndexOfMaxY = vals.index;
        buckets[i] = vals.max;
        console.log(vals);

        // const delta =
        //   0.5 *
        //   ((arr[IndexOfMaxY - 1] - arr[IndexOfMaxY + 1]) /
        //     (arr[IndexOfMaxY - 1] -
        //       2.0 * arr[IndexOfMaxY] +
        //       arr[IndexOfMaxY + 1]));
        // const interpolatedX =
        //   ((IndexOfMaxY + delta) * f_sample) / (freqBinLen - 1);
        // if (IndexOfMaxY == Math.floor(freqBinLen / 2)) {
        //   //To improve calculation on edge values
        //   interpolatedX = ((IndexOfMaxY + delta) * f_sample) / freqBinLen;
        // }
        i += 1;
      }

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
