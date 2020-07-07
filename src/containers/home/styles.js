import styled from "styled-components";

export const DashBoardContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Portrait = styled.div`
  width: 600px;
  height: 600px;
  background-color: rgba(
    ${({ rgb }) => {
      //   console.log("r: ", rgb[0]);
      return rgb[0];
    }},
    ${({ rgb }) => {
      console.log("g: ", rgb[1]);
      return rgb[1];
    }},
    ${({ rgb }) => {
      //   console.log("b: ", rgb[2]);
      return rgb[2];
    }},
    1
  );

  //   transition: background-color 0.001s;
`;
