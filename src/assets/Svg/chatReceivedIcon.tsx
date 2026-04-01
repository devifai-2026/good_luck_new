import * as React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";

const ChatReceivedIcon = () => (
  <Svg width={20} height={20} fill="none">
    {/* Background Circle */}
    <Circle
      cx={10}
      cy={10}
      r={9}
      fill="#00E300" // Green background
      stroke="#fff"
      strokeWidth={2}
    />
    <G fill="#fff">
      {/* Chat Bubble */}
      <Path d="M5.5 7.5c0-1.933 1.567-3.5 3.5-3.5h2c1.933 0 3.5 1.567 3.5 3.5v2c0 1.933-1.567 3.5-3.5 3.5H9.5c-.326 0-.64.13-.87.36l-1.56 1.56a.5.5 0 0 1-.85-.35v-1.57c-.847-.204-1.62-.582-2.22-1.18C5.13 10.64 5 10.326 5 10V7.5ZM9 6H7c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1h4c.552 0 1-.448 1-1V7c0-.552-.448-1-1-1H9Z" />
      {/* Check Mark */}
      <Path d="M7.8 8.8l.8.8 2-2a.5.5 0 0 1 .707.707l-2.354 2.353a.5.5 0 0 1-.707 0l-1.146-1.147a.5.5 0 1 1 .707-.707Z" />
    </G>
  </Svg>
);

export default ChatReceivedIcon;
