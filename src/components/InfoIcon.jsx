// InfoIcon.jsx
import React, { useEffect, useRef } from "react";
import { Popover } from "bootstrap";

export default function InfoIcon({ text, placement = "top" }) {
  const iconRef = useRef(null);

  useEffect(() => {
    const popover = new Popover(iconRef.current, {
      content: text,
      trigger: "focus",
      placement,
      html: false,
    });

    return () => popover.dispose();
  }, [text, placement]);

  return (
    <button
      type="button"
      ref={iconRef}
      className="btn btn-link p-0"
      tabIndex="0"
     aria-label={text}
     style={{
       color: "lightgray",       // ← makes the SVG fill use light gray
       lineHeight: 0,
       marginLeft: 4,
     }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-info-circle-fill"
        viewBox="0 0 16 16"
      >
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412
                 -1 4.705c-.07.34.029.533.304.533.194 0 
                 .487-.07.686-.246l-.088.416c-.287.346
                 -.92.598-1.465.598-.703 0-1.002-.422
                 -.808-1.319l.738-3.468c.064-.293
                 .006-.399-.287-.47l-.451-.081.082
                 -.381 2.29-.287zM8 5.5a1 1 0 1
                 1 0-2 1 1 0 0 1 0 2"/>
      </svg>
    </button>
  );
}
