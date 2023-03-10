import React, { useEffect, useRef, useState } from "react";
import "../Styles/NavBar.css";
import logo from "../assets/logo.png";
import userImage from "../assets/user demo.jpg";
import Dropdown from "react-bootstrap/esm/Dropdown";
import store from "../redux/store";
import { useDispatch } from "react-redux";
import { DeleteUser } from "../redux/Actions";
import { useNavigate } from "react-router-dom";

interface user {
  id: number;
  name: string;
  email: string;
}

export const NavBar = () => {
  const [showDropDown, setshowDropDown] = useState(false);
  const [user, setuser] = useState<user>();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  //To handle user authentication and change the path if user is already loggedin
  const GetAuthenticationState = () => {
    const user = store.getState();
    if (user.user == null) {
      navigate("/");
    }
    setuser(user.user);
  };

  const handleClickOutside = ({ target }: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current?.contains(target as Node)) {
      setshowDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    GetAuthenticationState();
    const unsubscribe = store.subscribe(() => GetAuthenticationState());
    return () => {
      unsubscribe();
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  //user logout handler
  const dispatch = useDispatch();
  const UserLogoutHandler = () => {
    localStorage.removeItem("userDetails");
    dispatch(DeleteUser());
  };

  return (
    <div className="horizantalFlexContainer">
      {/* Logo section of the nav Bar  */}
      <div>
        <a href="/home">
          <img src={logo} className="navBarLogo" alt="logo" />
        </a>
      </div>
      <div className="navEmptySpace"></div>
      {/* User Profile section of the NaBar  */}
      <div
        className="userProfile horizantalFlexContainer"
        onClick={() => {
          setshowDropDown(!showDropDown);
        }}
      >
        {/* User name section  */}
        <div className="">
          <p className="mediumText revertFont bold userName">{user?.name}</p>
        </div>
        {/* Dummy user Image Section which */}
        <div className="">
          <img src={userImage} alt="user" className="userImage" />
        </div>
        {/* NAvBar dropDown section  */}
        <div
          className={`${showDropDown ? "dropDownContainer" : "displayHidden"}`}
          ref={dropdownRef}
        >
          <Dropdown.Menu className="userDropDownMenu" show>
            <Dropdown.Item
              className="dropDownOption blackText openSansFont"
              eventKey="1"
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Item
              href="/myRides"
              className="dropDownOption blackText openSansFont"
              eventKey="2"
            >
              My Rides
            </Dropdown.Item>
            <Dropdown.Item
              className="dropDownOption blackText openSansFont"
              eventKey="3"
              onClick={() => UserLogoutHandler()}
            >
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </div>
      </div>
    </div>
  );
};
