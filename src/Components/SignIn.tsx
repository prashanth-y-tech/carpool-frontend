import React, { useEffect } from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import "../Styles/StartUpPage.css";
import "../index.css";
import axios, { AxiosError } from "axios";
import { FloatingLabel, Form } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/all";
import { Loading } from "./Loading";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AddUser } from "../redux/Actions";
import store from "../redux/store";

interface userRequest {
  Email: string;
  Password: string;
}

interface httpError {
  errorCode?: string;
  message?: string;
}

export const SignIn = () => {
  const [showPassword, setshowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
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
    if (email?.length == 0 || password?.length == 0) {
      seterrorMsg("Please Fill all the fields!");
      return false;
    }
    const emailValidRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const validEmail = emailValidRegex.test(email!);
    if (!validEmail) {
      seterrorMsg("Enter a valid Email!");
      return false;
    }
    return true;
  };

  //Function to login a user
  const UserLogin = async (): Promise<void> => {
    setloading(true);
    const validDetails: boolean = ValidateDetails();
    if (!validDetails) {
      setloading(false);
      return;
    }
    const userData: userRequest = {
      Email: email!,
      Password: password!,
    };
    await axios
      .post("https://carpoolwebapi.azurewebsites.net/Users/signin", userData, {
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
            setloading(false);
            return;
          }
        }
      });
    setloading(false);
  };

  //Function to clear the sign in  form
  const ClearForm = (): void => {
    setemail("");
    setpassword("");
  };

  return (
    <>
      {/* Loading componet  */}
      {loading ? <Loading /> : <div></div>}
      <div className="horizantalFlexContainer startUpPage">
        {/* The content page in the UI of the StartUpPage*/}
        <div className="contentSection">
          {/* Logo of the componet  */}
          <div>
            <img src={logo} className="startPageLogo" alt="logo" />
          </div>
          {/* The content section of the signin page  */}
          <div className="contentDescSection">
            <p className="largerText italic bold openSansFont">
              <span className="blackText">TURN</span>&nbsp;
              <span className="violetText">MILES </span>
              <span className="blackText">INTO</span>&nbsp;
              <span className="orangeText">MONEY</span>
            </p>
            <p className="largeText bold blackText revertFont ">RIDES ON TAP</p>
          </div>
        </div>
        {/* The signup form of the StartUpPage*/}
        <div className="formSection verticalFlexContainer violetBackground">
          <div className="formHeaderText">
            <h2
              style={{ textAlign: "center", position: "relative", top: "12vh" }}
              className="largeText bold whiteText openSansFont"
            >
              Sign In
            </h2>
          </div>
          <div className="signUpForm">
            <Form>
              <Form.Group className="formGroup">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Enter Email Id"
                  className="mb-3 formFloatingLabel"
                >
                  <Form.Control
                    type="email"
                    onChange={(event) => {
                      setemail(event.target.value);
                    }}
                    value={email}
                    id="InputEmail"
                    placeholder="Enter Email Id"
                    className="formElement"
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
                    onChange={(event) => {
                      setpassword(event.target.value);
                    }}
                    value={password}
                    placeholder="Enter Password"
                    className="formElement"
                  />
                </FloatingLabel>
              </Form.Group>
              <div className="smallText openSansFont redText">{errorMsg}</div>
            </Form>
          </div>
          <div className="formButton">
            <button
              className="signInButton whiteText smallText orangeBackground"
              onClick={() => UserLogin()}
            >
              Sign In
            </button>
          </div>
          <div className="switchAuth">
            <h2 className="smallText whiteText openSansFont">
              Not a member yet ?
              <a
                href="/"
                className="smallMediumText openSansFont switchToSignUp"
                style={{ display: "inline" }}
              >
                SIGN UP
              </a>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
