import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import DestinationPage from "./pages/DestinationPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import TripPage from "./pages/TripPage";
import "./trip-planner.css";

function App() {
  const [currentPlan, setCurrentPlan] = useState(null);

  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage currentPlan={currentPlan} />} />
        <Route path="/destination/:id" element={<DestinationPage />} />
        <Route path="/trip/:id" element={<TripPage currentPlan={currentPlan} onSavePlan={setCurrentPlan} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="site-footer"><span>plan your trip</span><span>Go at your own pace.</span></footer>
    </div>
  );
}

export default App;
