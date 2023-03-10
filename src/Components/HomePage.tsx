import React, { useEffect, useState } from "react";
import "../Styles/HomePage.css";
import { NavBar } from "./NavBar";
import { useNavigate } from "react-router-dom";
import store from "../redux/store";

interface user {
  id: number;
  name: string;
  email: string;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [user, setuser] = useState<user | null>(null);

  //To handle user authentication and change the path if user is already loggedin
  const GetAuthenticationState = () => {
    const user = store.getState();
    if (user.user == null) {
      navigate("/");
    }
    setuser(user.user);
  };

  useEffect(() => {
    GetAuthenticationState();
    const unsubscribe = store.subscribe(() => GetAuthenticationState());
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="homePage">
      {/* nav bar for the component here */}
      <NavBar />
      <div className="greetUser revertFont largeText bold">
        Hello {user?.name}!
      </div>
      {/* Button section which contains the book and offer buttons  */}
      <div className="horizantalFlexContainer buttonContainer">
        <a href="/bookRide" style={{ textDecoration: "none" }}>
          <div className="homeButton violetBackground whiteText mediumText openSansFont">
            Book a Ride
          </div>
        </a>
        <a href="/offerRide" style={{ textDecoration: "none" }}>
          <div className="homeButton orangeBackground whiteText mediumText openSansFont">
            Offer a Ride
          </div>
        </a>
      </div>
    </div>
  );
};
