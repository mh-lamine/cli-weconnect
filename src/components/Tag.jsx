import React from "react";

export default function Tag({ name }) {
  return (
    <span className="text-sm p-1 border border-primary-300 bg-primary-50 rounded text-primary-800">
      {name}
    </span>
  );
}
