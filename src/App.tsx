import { Route, Routes } from "react-router-dom";
import TestOne from "./TestOne";
import TestTwo from "./TestTwo";
import "./index.css";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TestOne />} />
      <Route path="/app" element={<TestTwo />} />
    </Routes>
  );
}
