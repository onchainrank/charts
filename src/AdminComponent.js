import React from "react";

export default function AdminComponent() {
  // Grab “token” from localStorage (adjust if you’re using sessionStorage instead)
  const token = localStorage.getItem("token");

  return (
    <button className="btn btn-primary" onClick={() => console.log(token)}>
      GML
    </button>
  );
}
