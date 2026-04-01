import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const MessageReceivedIcon = (props) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Circle
      cx={10}
      cy={10}
      r={9}
      fill="#00E300"
      stroke="#fff"
      strokeWidth={2}
    />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="m9.584 12.36-1.621 1.555a.257.257 0 0 1-.449-.171V12.36h-.856A.661.661 0 0 1 6 11.702V6.658A.663.663 0 0 1 6.658 6h6.617a.662.662 0 0 1 .657.658v5.044a.662.662 0 0 1-.657.658h-3.69ZM7.792 8.384a.257.257 0 0 1 0-.513h4.348a.256.256 0 1 1 0 .513H7.792Zm0 1.663a.256.256 0 0 1 0-.512h3.547a.257.257 0 0 1 0 .512H7.792Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default MessageReceivedIcon;
