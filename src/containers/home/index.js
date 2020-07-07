import React, { useEffect, useState } from "react";
import { DashBoardContainer, Portrait } from "./styles";
import { Pt, Sound } from "pts";

const Home = () => {
  const [start, setStart] = useState(null);
  const [clicked, setC] = useState(null);
  const [color, setCo] = useState(0);
  const [rgb, setRGB] = useState(null);
  const [timeFunc, setFunc] = useState(null);

  const clickButton = () => {
    if (timeFunc) {
      //   console.log("stopped");
      stop();
    }
    setC(true);
  };

  const listen = async () => {
    const so = Sound;
    console.log(Pt);
    console.log(Sound);
    const s = await Sound.input();
    console.log(s);
    const activeSound = s.analyze(128);
    console.log(activeSound);
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
  }, [start, color, clicked]);

  const getMean = (arr) => {
    let sum = 0;
    arr.forEach((a) => {
      sum += a;
    });
    return sum / arr.length;
  };

  const pChange = (o, n) => {
    const dif = Math.abs(o - n);
    return (dif / o) * 100;
  };

  const change = () => {
    if (!timeFunc) {
      console.log("entered");
      let green = g();
      let blue = b();
      let mean = 0;
      let set = [mean];
      let percentChange;
      const func = setInterval(() => {
        if (start) {
          const f = filterFreq();
          set.push(f);
          mean = getMean(set);
          percentChange = pChange(mean, f);
          //   console.log("mean:", mean);
          console.log("change:", percentChange);
          if (green < 255 && blue < 55) {
            let increase = f / 1000;

            if (percentChange > 400) {
              increase = f * 0.1;
            }
            green += increase;
          }
          if (green >= 255 && blue < 255) {
            blue += f / 1000;
          }
          if (blue >= 254 && green > 0) {
            green -= f / 1000;
          }
          if (green <= 1 && blue >= 1) {
            blue -= f / 1000;
          }
          setRGB({
            0: f,
            1: green,
            2: blue,
          });
        }
      }, 0.001);
      setFunc(func);
    }
  };

  const stop = () => {
    clearInterval(timeFunc);
  };

  const filterFreq = () => {
    if (start) {
      let arr = start.freqDomain();
      //   arr = arr.slice(0, 9);
      return arr[10];
    } else {
      return 0;
    }
  };

  const g = () => {
    return rgb ? (rgb[1] > 254 ? 0 : rgb[1] + 1) : 50;
  };

  const b = () => {
    return rgb ? (rgb[2] > 254 ? 0 : rgb[2] + 1) : 50;
  };

  return (
    <DashBoardContainer>
      <Portrait onClick={clickButton} rgb={rgb || [0, 50, 50]}></Portrait>
    </DashBoardContainer>
  );
};

export default Home;
