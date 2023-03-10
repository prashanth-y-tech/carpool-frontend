import React from "react";
import { Spinner } from "react-bootstrap";

export const Loading = () => {
  return (
    <div>
      {/* The loading component  */}
      <Spinner
        className="loadingSpinner"
        animation="border"
        variant="warning"
      />
    </div>
  );
};
