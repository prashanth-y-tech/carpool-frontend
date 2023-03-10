import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dropdown, Form } from "react-bootstrap";
import { BsCircleFill } from "react-icons/bs";
import { ImLocation } from "react-icons/im";
import { VscCircleFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import store from "../redux/store";
import "../Styles/BookingPage.css";
import { Loading } from "./Loading";
import { NavBar } from "./NavBar";
import { Ride } from "./Ride";
import { RideBookDetails } from "./RideBookDetails";

interface ride {
  id: number;
  userName: string;
  date: Date;
  seats: number;
  price: number;
  userId: number;
  createdOn: Date;
  fromCity: string;
  toCity: string;
}

interface httpError {
  errorCode?: number;
  message?: string;
}

interface user {
  id: number;
  name: string;
  email: string;
}

interface cities {
  id: number;
  name: string;
}

export const BookingPage = () => {
  const [loading, setloading] = useState<boolean>(false);
  const [alertmsg, setalertmsg] = useState<boolean>(false);
  const [rides, setrides] = useState<ride[]>([]);
  const [cities, setcities] = useState<cities[]>([]);
  const [user, setuser] = useState<user>();
  const [ride, setride] = useState<ride | null>(null);
  const [toCity, settoCity] = useState<string>("");
  const [fromCity, setfromCity] = useState<string>("");
  const [date, setdate] = useState<string>("");
  const [time, settime] = useState<string>("");
  const [errorMsg, seterrorMsg] = useState<string>("");
  const [showFromCityDropDown, setshowFromCityDropDown] =
    useState<boolean>(false);
  const [showToCityDropDown, setshowToCityDropDown] = useState<boolean>(false);
  const fromDropDownRef = useRef<HTMLDivElement>(null);
  const toDropDownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  //To validate the booking form details
  const ValidateForm = (): boolean => {
    if (fromCity.length === 0) {
      seterrorMsg("Please select FromCity");
      return false;
    }
    if (toCity.length === 0) {
      seterrorMsg("Please select ToCity");
      return false;
    }
    if (date.length === 0) {
      seterrorMsg("Please select a date");
      return false;
    }
    if (time.length === 0) {
      seterrorMsg("Please select a time");
      return false;
    }
    return true;
  };

  //To fetch all the supported cities from the server
  const GetAllServingCities = async (): Promise<void> => {
    setloading(true);
    await axios
      .get("https://carpoolwebapi.azurewebsites.net/Cities", {
        withCredentials: true,
      })
      .then((response) => {
        setcities(response.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const errorRes: httpError | undefined = error.response.data!;
          if (errorRes.errorCode) {
            window.alert(errorRes.message!);
            setloading(false);
            return;
          }
          if (errorRes.errorCode == 401) {
            navigate("/");
            setloading(false);
            return;
          }
        }
      });
    setloading(false);
  };

  //To get all the matched rides data from the server
  const GetMatchedRides = async (): Promise<void> => {
    setloading(true);
    const validForm: boolean = ValidateForm();
    if (!validForm) {
      setloading(false);
      return;
    }

    const dateTime: string = date! + time!;
    axios
      .get(`https://carpoolwebapi.azurewebsites.net/Rides`, {
        params: {
          fromCityName: fromCity,
          toCityName: toCity,
          date: dateTime,
        },
        withCredentials: true,
      })
      .then((response) => {
        setrides(response.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const errorRes: httpError | undefined = error.response.data!;
          if (errorRes.errorCode) {
            window.alert(errorRes.message!);
            setloading(false);
            return;
          }
        }
      });
    setloading(false);
  };

  //to reset the booking form
  const ResetForm = () => {
    setdate("");
    setfromCity("");
    settime("");
    settoCity("");
    setrides([]);
  };
  //function to update the state of the show ride book details
  const RemoveRide = (rideBooked: boolean) => {
    setride(null);
    if (rideBooked) {
      ResetForm();
      setalertmsg(true);
      setTimeout(() => {
        setalertmsg(false);
      }, 2000);
    }
  };

  //To close the dropdown menu when clicked outside the dropdown
  const handleClickOutside = ({ target }: MouseEvent) => {
    if (
      fromDropDownRef.current &&
      !fromDropDownRef.current?.contains(target as Node)
    ) {
      setshowFromCityDropDown(false);
    }
    if (
      toDropDownRef.current &&
      !toDropDownRef.current?.contains(target as Node)
    ) {
      setshowToCityDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    GetAllServingCities();
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="bookingSection">
      {/* NavBar section of the booking page */}
      <NavBar />
      {loading ? <Loading /> : <div></div>}
      {/* To show alert messages for succesfull booking  */}
      {alertmsg && (
        <Alert variant="success" className="alertMessage">
          Ride booked succesfully!
        </Alert>
      )}
      {/* The main page for booking component */}
      <div className="horizantalFlexContainer bookingMainPage">
        {/* The booking form component section  */}
        <div className="horizantalFlexContainer rideFillForm">
          <div className="verticalFlexContainer ">
            <div className="formHeadingSection">
              <ul style={{ listStyle: "none" }}>
                <li className="largeText bold blackText openSansFont">
                  Book a Ride
                </li>
                <li className="smallText bold greyText openSansFont">
                  we get you the matches asap!
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <label
                    htmlFor="form"
                    className="smallText greyText openSansFont"
                  >
                    From
                  </label>
                </li>
                <li>
                  <input
                    id="form"
                    value={fromCity}
                    className="formInputFeild"
                    type="text"
                    onClick={() =>
                      setshowFromCityDropDown(!showFromCityDropDown)
                    }
                  />
                  {showFromCityDropDown ? (
                    <Dropdown.Menu
                      className="citiesDropDownMenu"
                      show
                      ref={fromDropDownRef}
                    >
                      {cities.map((city) => {
                        return (
                          <Dropdown.Item
                            onClick={() => {
                              setfromCity(city.name);
                              setshowFromCityDropDown(false);
                            }}
                            className="dropDownOption blackText openSansFont"
                            eventKey="1"
                          >
                            {city.name}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  ) : (
                    <div></div>
                  )}
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <label
                    htmlFor="form"
                    className="smallText greyText openSansFont"
                  >
                    To
                  </label>
                </li>
                <li>
                  <input
                    id="form"
                    value={toCity}
                    className="formInputFeild"
                    type="text"
                    onClick={() => {
                      setshowToCityDropDown(!showToCityDropDown);
                    }}
                  />
                  {showToCityDropDown ? (
                    <Dropdown.Menu
                      className="citiesDropDownMenu"
                      show
                      ref={toDropDownRef}
                    >
                      {cities.map((city) => {
                        if (city.name === fromCity) {
                          return <div></div>;
                        }
                        return (
                          <Dropdown.Item
                            onClick={() => {
                              settoCity(city.name);
                              setshowToCityDropDown(false);
                            }}
                            className="dropDownOption blackText openSansFont"
                            eventKey="1"
                          >
                            {city.name}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  ) : (
                    <div></div>
                  )}
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <label
                    htmlFor="form"
                    className="smallText greyText openSansFont"
                  >
                    Date
                  </label>
                </li>
                <li>
                  <input
                    id="form"
                    value={date}
                    className="formInputFeild"
                    type="date"
                    onChange={(event) => setdate(event.target.value)}
                  />
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li className="smallText greyText openSansFont">Time</li>
                <li>
                  <div className="flexContainer flexWrap timeTagSection">
                    <input
                      type="radio"
                      id="tag1"
                      name="timeTags"
                      checked={time === "T05:00:00"}
                      value="T05:00:00"
                    />
                    <label
                      className="smallText blackText openSansFont"
                      htmlFor="tag1"
                      onClick={() => {
                        settime("T05:00:00");
                      }}
                    >
                      5am-9am
                    </label>
                    <input
                      type="radio"
                      id="tag2"
                      name="timeTags"
                      checked={time === "T09:00:00"}
                      value="T09:00:00"
                    />
                    <label
                      className="smallText blackText openSansFont"
                      htmlFor="tag2"
                      onClick={() => {
                        settime("T09:00:00");
                      }}
                    >
                      9am-12pm
                    </label>
                    <input
                      type="radio"
                      id="tag3"
                      name="timeTags"
                      checked={time === "T12:00:00"}
                      value="T12:00:00"
                    />
                    <label
                      className="smallText blackText openSansFont"
                      htmlFor="tag3"
                      onClick={() => {
                        settime("T12:00:00");
                      }}
                    >
                      12pm-3pm
                    </label>
                    <input
                      type="radio"
                      id="tag4"
                      name="timeTags"
                      checked={time === "T03:00:00"}
                      value="T03:00:00"
                    />
                    <label
                      className="smallText blackText openSansFont"
                      htmlFor="tag4"
                      onClick={() => {
                        settime("T03:00:00");
                      }}
                    >
                      3pm-6pm
                    </label>
                    <input
                      type="radio"
                      id="tag5"
                      name="timeTags"
                      value="T06:00:00"
                      checked={time === "T06:00:00"}
                    />
                    <label
                      className="smallText blackText openSansFont"
                      htmlFor="tag5"
                      onClick={() => {
                        settime("T06:00:00");
                      }}
                    >
                      6pm-9pm
                    </label>
                  </div>
                </li>
              </ul>
            </div>
            <div className="submitButtonSection centerTextAlign">
              <button
                className="submitButton whiteText smallText orangeBackground"
                onClick={async () => {
                  await GetMatchedRides();
                }}
              >
                Submit
              </button>
              {errorMsg != "" && (
                <div className="redText openSansFont smallText ">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
          <div className="verticalFlexContainer">
            <div>
              <Form.Check
                className="formSwitch"
                type="switch"
                id="custom-switch"
              />
            </div>
            <div>
              <div className="navigationAnimation verticalFlexContainer">
                <div>
                  <BsCircleFill className="locationEndPoint" />
                </div>
                <div>
                  <VscCircleFilled className="locationDot" />
                </div>
                <div>
                  <VscCircleFilled className="locationDot" />
                </div>
                <div>
                  <VscCircleFilled className="locationDot" />
                </div>
                <div>
                  <ImLocation className="locationEndPoint locationPointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* The matched rides result section  */}
        <div>
          <p className="openSansFont violetText bold rideHeadSection largeText">
            Your Matches
          </p>
          {/* Displays all the rides here  */}
          <div className="flexContainer flexWrap rideDisplaySection">
            {rides.length == 0 ? (
              <div className="mediumText greyText openSansFont noRideMsg">
                No Rides!😞
              </div>
            ) : (
              rides.map((ride) => {
                return (
                  <div
                    className="ridesToBook"
                    onClick={() => {
                      setride(ride);
                    }}
                  >
                    <Ride key={ride.id} {...ride} />
                  </div>
                );
              })
            )}
            {ride != null ? (
              <RideBookDetails ride={ride!} RemoveRide={RemoveRide} />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
