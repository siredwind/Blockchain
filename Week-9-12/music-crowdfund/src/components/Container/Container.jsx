import React from "react";

const Container = ({ children, ...props }) => {
  return <div className="max-w-[1240px] mx-auto max-xl:mx-3" {...props}>{children}</div>;
}

export default Container;
