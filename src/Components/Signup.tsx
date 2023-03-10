import React, { useEffect } from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import "../Styles/StartUpPage.css";
import "../index.css";
import { FloatingLabel, Form } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/all";
import axios, { AxiosError } from "axios";
import { Loading } from "./Loading";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AddUser } from "../redux/Actions";
import store from "../redux/store";

interface user {
  name: string;
  email: string;
  password: string;
}

interface httpError {
  errorCode?: string;
  message?: string;
}

export const Signup = () => {
  //Declerations of all the states and variables
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [userEmail, setuserEmail] = useState<string>("");
  const [userPassword, setuserPassword] = useState<string>("");
  const [confirmPassword, setconfirmPassword] = useState<string>("");
  const [userName, setuserName] = useState<string>("");
  const [errorMsg, seterrorMsg] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //To handle user authentication and change the path if user is already loggedin
  const GetAuthenticationState = (isStartUp: boolean) => {
    const user = store.getState();
    if (user.user != null && isStartUp) {
      navigate("/home");
    } else if (user.user != null) {
      navigate("/home");
    }
  };

  useEffect(() => {
    GetAuthenticationState(true);
    const unsubscribe = store.subscribe(() => GetAuthenticationState(false));
    return () => {
      unsubscribe();
    };
  }, []);

  //Function to validate form details entered by user
  const ValidateDetails = (): boolean => {
    seterrorMsg("");
    if (
      userEmail?.length == 0 ||
      userName?.length == 0 ||
      userPassword?.length == 0 ||
      confirmPassword?.length == 0
    ) {
      seterrorMsg("Please Fill all the fields!");
      return false;
    }
    if (userPassword != confirmPassword) {
      seterrorMsg("Password and Confirm Password doesn't match!");
      return false;
    }
    const emailValidRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const validEmail = emailValidRegex.test(userEmail!);
    if (!validEmail) {
      seterrorMsg("Enter a valid Email!");
      return false;
    }
    return true;
  };

  //Function to signup a user
  const RegisterUser = async (): Promise<void> => {
    setloading(true);
    const validDetails: boolean = ValidateDetails();
    if (!validDetails) {
      setloading(false);
      return;
    }
    const userData: user = {
      name: userName!,
      email: userEmail!,
      password: userPassword!,
    };

    await axios
      .post("https://carpoolwebapi.azurewebsites.net/Users/signup", userData, {
        withCredentials: true,
      })
      .then((response) => {
        ClearForm();
        localStorage.setItem("userDetails", JSON.stringify(response.data));
        dispatch(AddUser(response.data));
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const errorRes: httpError | undefined = error.response.data!;
          if (errorRes.errorCode) {
            seterrorMsg(errorRes.message!);
            return;
          }
        }
      });
    setloading(false);
  };

  //Function to clear the sign in  form
  const ClearForm = (): void => {
    setuserEmail("");
    setuserPassword("");
    setconfirmPassword("");
    setuserName("");
  };

  return (
    <>
      {/* Loading spinner */}
      {loading ? <Loading /> : <div></div>}
      <div className="horizantalFlexContainer startUpPage">
        {/* The content page in the UI of the homepage*/}
        <div className="contentSection">
          <div className="contentLogoSection">
            <img src={logo} className="startPageLogo" alt="logo" />
          </div>
          <div className="contentDescSection">
            <p className="largerText italic bold openSansFont">
              <span className="blackText">TURN</span>&nbsp;
              <span className="violetText">MILES </span>
              <span className="blackText">INTO</span>&nbsp;
              <span className="orangeText">MONEY</span>
            </p>
            <p className="largeText bold blackText revertFont">RIDES ON TAP</p>
          </div>
        </div>
        {/* The signup form of the homepage*/}
        <div className="formSection verticalFlexContainer orangeBackground">
          <div className="formHeaderText">
            <h2
              style={{ textAlign: "center", position: "relative", top: "6vh" }}
              className="largeText bold whiteText openSansFont"
            >
              Sign Up
            </h2>
          </div>
          <div className="signUpForm">
            <Form>
              <Form.Group className="formGroup">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Enter Name"
                  className="mb-3 formFloatingLabel"
                >
                  <Form.Control
                    type="email"
                    id="InputName"
                    placeholder="Enter Name"
                    className="formElement "
                    onChange={(event) => {
                      setuserName(event.target.value);
                    }}
                    value={userName}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="formGroup">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Enter Email Id"
                  className="mb-3 formFloatingLabel"
                >
                  <Form.Control
                    type="email"
                    id="InputEmail"
                    placeholder="Enter Email Id"
                    className="formElement"
                    onChange={(event) => {
                      setuserEmail(event.target.value);
                    }}
                    value={userEmail}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="formGroup">
                {showPassword ? (
                  <AiFillEyeInvisible
                    className="hidePassword"
                    onClick={() => {
                      setshowPassword(false);
                    }}
                  />
                ) : (
                  <AiFillEye
                    className="hidePassword"
                    onClick={() => {
                      setshowPassword(true);
                    }}
                  />
                )}
                <FloatingLabel
                  controlId="floatingInput"
                  label="Enter Password"
                  className="mb-3 formFloatingLabel"
                >
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    id="inputPassword"
                    placeholder="Enter Password"
                    onChange={(event) => {
                      setuserPassword(event.target.value);
                    }}
                    className="formElement"
                    value={userPassword}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="formGroup">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Confirm Password"
                  className="mb-3 formFloatingLabel"
                >
                  <Form.Control
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={(event) => {
                      setconfirmPassword(event.target.value);
                    }}
                    className="formElement"
                    value={confirmPassword}
                  />
                </FloatingLabel>
              </Form.Group>
              <div className="smallText openSansFont redText">{errorMsg}</div>
            </Form>
          </div>
          <div className="formButton">
            <button
              onClick={() => {
                RegisterUser();
              }}
              className="signUpButton violetBackground whiteText smallText"
            >
              Sign Up
            </button>
          </div>
          <div className="switchAuth">
            <h2 className="smallText whiteText openSansFont">
              Already a member ?
              <a
                href="/SignIn"
                className="smallMediumText openSansFont switchToSignIn"
                style={{ display: "inline" }}
              >
                LOG IN
              </a>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
