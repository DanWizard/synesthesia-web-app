import styled from "styled-components";

export const DashBoardContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

// const colors = {
//   // black:
// }

const colorPicker = (obj) => {
  let str = "";
  Object.entries(obj).forEach(([key, value]) => {
    if (parseInt(key) === Object.entries(obj).length - 1) {
      str = `rgba(0,0,${value}) ` + str;
    } else {
      str += `, rgba(0,0,${value})`;
    }
  });
  return str;
};

export const Portrait = styled.div`
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ fObj }) => {
      return fObj ? colorPicker(fObj) : "black, black";
    }}
  );
`;
