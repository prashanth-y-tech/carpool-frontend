import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dropdown, Form } from "react-bootstrap";
import { BsCircleFill, BsPlusLg } from "react-icons/bs";
import { ImLocation } from "react-icons/im";
import { RxDoubleArrowRight } from "react-icons/rx";
import { VscCircleFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import store from "../redux/store";
import "../Styles/OfferRide.css";
import { Loading } from "./Loading";
import { NavBar } from "./NavBar";

interface stop {
  stopNumber: number;
  stopValue: string;
  showButton: boolean;
}

interface ride {
  id?: number;
  date: string;
  seats: number;
  price: number;
  userId: number;
  fromCity: string;
  toCity: string;
}

interface stopData {
  stopNumber: number;
  stopName: string;
  rideId: number;
}

interface stopRequest {
  stops: stopData[];
}

interface httpError {
  errorCode?: number;
  message?: string;
}

interface cities {
  id: number;
  name: string;
}

interface user {
  id: number;
  name: string;
  email: string;
}

export const OfferRide = () => {
  //Declaration of all the states and variables used
  const [stopCount, setstopCount] = useState<number>(2);
  const [loading, setloading] = useState<boolean>(false);
  const [alertmsg, setalertmsg] = useState<boolean>();
  const [cities, setcities] = useState<cities[]>([]);
  const [toCity, settoCity] = useState<string>("");
  const [fromCity, setfromCity] = useState<string>("");
  const [date, setdate] = useState<string>("");
  const [time, settime] = useState<string>("");
  const [price, setprice] = useState<number>(0);
  const [seats, setseats] = useState(0);
  const [user, setuser] = useState<user>();
  const [errorMsg, seterrorMsg] = useState<string>("");
  const [showFromCityDropDown, setshowFromCityDropDown] =
    useState<boolean>(false);
  const [showToCityDropDown, setshowToCityDropDown] = useState<boolean>(false);
  const [stops, setstops] = useState<stop[] | []>([
    { stopNumber: 1, stopValue: "", showButton: true },
  ]);
  const [showNextFrom, setshowNextFrom] = useState<boolean>(false);
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

  //Function to set the stop value to the state variable
  function SetStopValue(stopNo: number, stopName: string): void {
    var stopIndex: number = stops.findIndex(
      (stop) => stop.stopNumber == stopNo
    )!;
    if (stopIndex != null) {
      stops[stopIndex].stopValue = stopName;
    }
    setstops([...stops]);
  }

  //Function to validate the ride form
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
    if (seats === 0) {
      seterrorMsg("Please select no of seats");
      return false;
    }
    if (price === 0) {
      seterrorMsg("Please select price");
      return false;
    }
    return true;
  };

  //Function to fetch all the serving cities from the server
  const GetAllServingCities = async (): Promise<void> => {
    setloading(true);
    await axios
      .get("https://carpoolwebapi.azurewebsites.net/Cities", {
        withCredentials: true,
      })
      .then((response) => {
        setcities(response.data);
        setloading(false);
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

  //Function to add a new stop field to the form
  function AddNewStopFeild(): void {
    setstopCount(stopCount + 1);
    setstops([
      ...stops,
      { stopNumber: stopCount, stopValue: "", showButton: true },
    ]);
  }

  //Function to add a ride to db
  const AddRide = async (): Promise<void> => {
    seterrorMsg("");
    setloading(true);
    const validForm: boolean = ValidateForm();
    if (!validForm) {
      setloading(false);
      return;
    }
    var rideId: number;
    const dateTime: string = date! + time!;
    const rideRequest: ride = {
      userId: user?.id!,
      seats: seats,
      price: price!,
      toCity: toCity!,
      fromCity: fromCity!,
      date: dateTime,
    };
    await axios
      .post("https://carpoolwebapi.azurewebsites.net/Rides", rideRequest, {
        withCredentials: true,
      })
      .then((response) => {
        const { id } = response.data;
        rideId = id;
        setloading(false);
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
    const stopsData: stopData[] = stops.map((stop) => {
      return {
        stopNumber: stop.stopNumber,
        stopName: stop.stopValue,
        rideId: rideId,
      };
    });

    const stopRequest: stopRequest = {
      stops: stopsData,
    };
    setloading(true);
    await axios
      .post("https://carpoolwebapi.azurewebsites.net/Stops", stopRequest, {
        withCredentials: true,
      })
      .then(() => {
        ResetForm();
        setloading(false);
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

  //Function to reset the form data
  const ResetForm = () => {
    setshowNextFrom(false);
    settoCity("");
    setdate("");
    settime("");
    setfromCity("");
    setprice(0);
    setseats(0);
    setalertmsg(true);
    setTimeout(() => {
      setalertmsg(false);
    }, 2000);
  };

  //Function to close the dropdown when clicked outside of the dropdown
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
    <div className="offerRidePage">
      {/* Alert message to indicate succesfull ride creation  */}
      {alertmsg && (
        <Alert variant="success" className="alertMessage">
          Ride Created!
        </Alert>
      )}
      {/* Nav bar in the component  */}
      <NavBar />
      {/* The loading component  */}
      {loading ? <Loading /> : <div></div>}
      {/* Offer ride component section  */}
      <div className="horizantalFlexContainer offerRideFormSection">
        {/* First form in the offer ride section  */}
        <div className="horizantalFlexContainer rideFillForm">
          <div className="verticalFlexContainer ">
            <div className="formHeadingSection">
              <ul style={{ listStyle: "none" }}>
                <li className="largeText bold blackText openSansFont">
                  Offer a Ride
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
                    className="formInputFeild"
                    type="text"
                    value={fromCity}
                    onClick={() => {
                      setshowFromCityDropDown(!showFromCityDropDown);
                    }}
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
                    className="formInputFeild"
                    type="text"
                    value={toCity}
                    onClick={() => setshowToCityDropDown(!showToCityDropDown)}
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
                    className="formInputFeild"
                    type="date"
                    value={date}
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
                      value="T05:00:00"
                      checked={time === "T05:00:00"}
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
                      value="T09:00:00"
                      checked={time === "T09:00:00"}
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
                      value="T12:00:00"
                      checked={time === "T12:00:00"}
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
                      name="T03:00:00"
                      value="Android Development"
                      checked={time === "T03:00:00"}
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
                      checked={time === "T06:00:00"}
                      value="T06:00:00"
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
            <div className="submitButtonSection" style={{ textAlign: "right" }}>
              <button
                className="nextButton bold smallMediumText "
                onClick={() => setshowNextFrom(true)}
              >
                Next <RxDoubleArrowRight />
              </button>
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
                <div className="locationAnimationContainer">
                  <VscCircleFilled className="locationDot" />
                </div>
                <div className="locationAnimationContainer">
                  <VscCircleFilled className="locationDot" />
                </div>
                <div className="locationAnimationContainer">
                  <VscCircleFilled className="locationDot" />
                </div>
                <div>
                  <ImLocation className="locationEndPoint locationPointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Second form in the offer ride section */}
        {showNextFrom ? (
          <div className="horizantalFlexContainer rideFillForm">
            <div className="verticalFlexContainer ">
              <div className="formHeadingSection">
                <ul style={{ listStyle: "none" }}>
                  <li className="largeText bold blackText openSansFont">
                    Offer a Ride
                  </li>
                  <li className="smallText bold greyText openSansFont">
                    we get you the matches asap!
                  </li>
                </ul>
              </div>
              {stops.map((stop) => {
                return (
                  <div key={stop.stopNumber}>
                    <ul>
                      <li>
                        <label
                          htmlFor="form"
                          className="smallText greyText openSansFont"
                        >
                          {`Stop ${stop.stopNumber}`}
                        </label>
                      </li>
                      <li>
                        <input
                          id="form"
                          className="formInputFeild"
                          type="text"
                          onChange={(event) => {
                            SetStopValue(stop.stopNumber, event.target.value);
                          }}
                        />
                        {stop.showButton ? (
                          <BsPlusLg
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              stop.showButton = false;
                              AddNewStopFeild();
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </li>
                    </ul>
                  </div>
                );
              })}
              <div className="horizantalFlexContainer">
                <div className="verticalFlexContainer inputFeildSubSection">
                  <div className="openSansFont greyText smallText paddingInline-1">
                    Select Seats
                  </div>
                  <div className="seatCount bold revertFont blackText largeText">
                    {seats}
                  </div>
                  <div>
                    <Form.Range
                      className="inputRange"
                      defaultValue={0}
                      onChange={(event) => {
                        var seatSelected: number = Math.floor(
                          parseInt(event.target.value) / 14
                        );
                        setseats(seatSelected);
                      }}
                    />
                  </div>
                </div>
                <div className="inputFeildSubSection">
                  <ul>
                    <li className="openSansFont greyText smallText paddingInline-1">
                      Select Price
                    </li>
                    <li>
                      <div className="horizantalFlexContainer priceSelector">
                        <div className="largeText blackText revertFont">₹</div>
                        <div>
                          <input
                            type="number"
                            className="formInputFeild priceInputFeild"
                            onChange={(event) => {
                              setprice(parseInt(event.target.value));
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="submitButtonSection centerTextAlign">
                <button
                  className="submitButton whiteText smallText orangeBackground "
                  onClick={() => {
                    AddRide();
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
                  {stops.map((stop) => {
                    if (stop.stopNumber == 1) {
                      return;
                    }
                    if (stop.stopNumber % 2 == 0) {
                      return (
                        <>
                          <div
                            className="locationAnimationContainer"
                            key={stop.stopNumber}
                          >
                            <VscCircleFilled className="locationDot" />
                          </div>
                          <div
                            className="locationAnimationContainer"
                            key={stop.stopNumber}
                          >
                            <VscCircleFilled className="locationDot" />
                          </div>
                        </>
                      );
                    }

                    return (
                      <>
                        <div
                          className="locationAnimationContainer"
                          key={stop.stopNumber}
                        >
                          <VscCircleFilled className="locationDot" />
                        </div>
                        <div
                          className="locationAnimationContainer"
                          key={stop.stopNumber}
                        >
                          <VscCircleFilled className="locationDot" />
                        </div>
                        <div
                          className="locationAnimationContainer"
                          key={stop.stopNumber}
                        >
                          <VscCircleFilled className="locationDot" />
                        </div>
                      </>
                    );
                  })}
                  <div>
                    <ImLocation className="locationEndPoint locationPointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
