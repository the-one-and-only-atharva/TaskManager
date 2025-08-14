import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/layout/Home";
import Canvas from "./components/orbital/Canvas";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/canvas" element={<Canvas />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
