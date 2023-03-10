import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import { ImLocation } from "react-icons/im";
import { VscCircleFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import userImage from "../assets/user demo.jpg";
import store from "../redux/store";
import "../Styles/RideBookDetails.css";
import { Loading } from "./Loading";

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

interface stop {
  id: number;
  stopNumber: number;
  stopName: string;
  rideid: number;
}

interface props {
  ride: ride;
  RemoveRide: (rideBooked: boolean) => void;
}

interface booking {
  userid: number;
  stopid?: number;
}

export const RideBookDetails = (props: props) => {
  const ride = props.ride;
  const [showStopDropDown, setshowStopDropDown] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [stop, setstop] = useState<stop | null>(null);
  const [stops, setstops] = useState<stop[]>([]);
  const [isStop, setisStop] = useState<boolean>(false);
  const [showError, setshowError] = useState<boolean>(false);
  const [user, setuser] = useState<user>();
  const stopsDropDownRef = useRef<HTMLDivElement>(null);
  const date = new Date(ride.date);
  const navigate = useNavigate();

  //Function to fetch the stops for a particular ride
  const GetRideStops = async (): Promise<void> => {
    setloading(true);
    await axios
      .get(`https://carpoolwebapi.azurewebsites.net/Stops`, {
        params: {
          rideId: ride.id,
        },
        withCredentials: true,
      })
      .then((response) => {
        setstops(response.data);
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

  //Function to create a booking of a specified ride
  const bookRide = (): void => {
    setloading(true);
    setshowError(false);
    if (stop == null) {
      setloading(false);
      setshowError(true);
      return;
    }
    if (stop == null && showStopDropDown) {
      return;
    }
    var bookingDetails: booking = {
      userid: user?.id!,
    };
    if (stop != null) {
      bookingDetails.stopid = stop?.id;
    }
    axios
      .post(
        `https://carpoolwebapi.azurewebsites.net/Bookings/Ride/?rideId=${Math.floor(
          ride.id
        )}`,
        bookingDetails,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        props.RemoveRide(true);
      })
      .catch((error: AxiosError) => {
        setloading(false);
        if (error.response) {
          const errorRes: httpError | undefined = error.response.data!;
          if (errorRes.errorCode) {
            window.alert(errorRes.message!);
            return;
          }
          if (errorRes.errorCode == 401) {
            navigate("/");
            setloading(false);
            return;
          }
        }
      });
  };

  //Fucntion to close the drop down when clicked outside
  const handleClickOutside = ({ target }: MouseEvent) => {
    if (
      stopsDropDownRef.current &&
      !stopsDropDownRef.current?.contains(target as Node)
    ) {
      setshowStopDropDown(false);
    }
  };

  useEffect(() => {
    if (stops?.length >= 1) {
      setisStop(true);
    }
  }, [stops]);

  useEffect(() => {
    setuser(store.getState().user);
    GetRideStops();
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div>
      {/* Loading component  */}
      {loading ? <Loading /> : <div></div>}
      <div className="horizantalFlexContainer rideBookDetailContainer">
        <div className="verticalFlexContainer">
          <div className="openSansFont greyText largeText bookRideHeadText">
            Book Ride
          </div>
          <div
            className="blackText openSansFont bold largeText"
            style={{ paddingBottom: "1vh", paddingLeft: "1.2vw" }}
          >
            {ride.userName}
          </div>
          <div className="horizantalFlexContainer">
            <div>
              <ul>
                <li className="openSansFont greyText bold mediumText">From</li>
                <li className="openSansFont blackText largeText">
                  {ride.fromCity}
                </li>
              </ul>
            </div>
            <div style={{ paddingTop: "4vh" }}>
              <BsCircleFill className="locationEndPoint" />
              <VscCircleFilled className="locationDot" />
              <VscCircleFilled className="locationDot" />
              <VscCircleFilled className="locationDot" />
              <VscCircleFilled className="locationDot" />
              <ImLocation className="locationEndPoint locationPointer" />
            </div>
          </div>
          <div>
            <ul>
              <li className="openSansFont greyText bold mediumText">date</li>
              <li className="openSansFont blackText largeText">
                {date.toLocaleDateString()}
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="openSansFont greyText bold mediumText">price</li>
              <li className="openSansFont blackText largeText">{ride.price}</li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="openSansFont greyText bold mediumText">
                Select Stop
              </li>
              {/* DropDown to select the droping stop  */}
              {isStop ? (
                <li className="openSansFont blackText largeText">
                  <input
                    id="form"
                    className="formInputFeild mediumText"
                    type="text"
                    value={stop?.stopName}
                    onClick={() => {
                      setshowStopDropDown(!showStopDropDown);
                      setshowError(false);
                    }}
                  />
                  {showStopDropDown ? (
                    <Dropdown.Menu
                      className="citiesDropDownMenu"
                      show
                      ref={stopsDropDownRef}
                    >
                      {stops?.map((stop) => {
                        return (
                          <Dropdown.Item
                            onClick={() => {
                              setstop(stop);
                              setshowStopDropDown(false);
                            }}
                            className="dropDownOption blackText openSansFont"
                            eventKey="1"
                          >
                            {stop.stopName}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  ) : (
                    <div></div>
                  )}
                </li>
              ) : (
                <li className="blackText openSansFont mediumText">
                  No stops before destination!
                </li>
              )}
            </ul>
          </div>
          {showError && (
            <div className="redText openSansFont smallText centerTextAlign">
              Select drop stop!
            </div>
          )}
        </div>
        <div className="verticalFlexContainer">
          <div className="closeBtnSectn">
            <AiOutlineClose
              className="closeBtn"
              onClick={() => {
                props.RemoveRide(false);
              }}
            />
          </div>
          <div style={{ textAlign: "right", paddingBottom: "1vh" }}>
            <img src={userImage} alt="user" className="userImage " />
          </div>
          <div>
            <ul>
              <li className="openSansFont greyText bold mediumText">To</li>
              <li className="openSansFont blackText largeText">
                {ride.toCity}
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="openSansFont greyText bold mediumText">Time</li>
              <li className="openSansFont blackText largeText">
                {date.toLocaleTimeString()}
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="openSansFont greyText bold mediumText">
                Seat Availabilty
              </li>
              <li className="openSansFont blackText largeText">{ride.seats}</li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="smallText greyText openSansFont">
                Confirm and book ride
              </li>
              <li className="confirmBookBtn">
                <button
                  disabled={ride.seats === 0}
                  onClick={() => {
                    bookRide();
                  }}
                  className={
                    "submitButton whiteText smallText violetBackground"
                  }
                >
                  Book
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
