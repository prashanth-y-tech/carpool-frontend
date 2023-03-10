import { useEffect, useState } from "react";
import "./App.css";
import { Signup } from "./Components/Signup";
import { SignIn } from "./Components/SignIn";
import "bootstrap/dist/css/bootstrap.min.css";
import { HomePage } from "./Components/HomePage";
import { BookingPage } from "./Components/BookingPage";
import { MyRides } from "./Components/MyRides";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OfferRide } from "./Components/OfferRide";
import { RideBookDetails } from "./Components/RideBookDetails";
import { useNavigate, redirect } from "react-router-dom";
import store from "./redux/store";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/bookRide" element={<BookingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/myRides" element={<MyRides />} />
          <Route path="/offerRide" element={<OfferRide />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
