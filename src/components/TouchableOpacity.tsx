import React, { type CSSProperties, type ReactNode, type MouseEventHandler, useState } from "react";

interface TouchableOpacityProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  activeOpacity?: number; // opacity when pressed
  style?: CSSProperties;
  className?: string;
}

const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  children,
  onClick,
  activeOpacity = 0.5,
  style = {},
  className,
  ...props
}) => {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      style={{
        opacity: pressed ? activeOpacity : 1,
        cursor: "pointer",
        transition: "opacity 0.2s",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default TouchableOpacity;