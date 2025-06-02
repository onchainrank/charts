import React from "react";

export default function AdminComponent({ id }) {
  console.log(id);
  return <span className="badge bg-dark ms-2">Admin</span>;
}
