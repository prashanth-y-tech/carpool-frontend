import React from "react";
import "../Styles/Ride.css";
import userImage from "../assets/user demo.jpg";
import { ImLocation } from "react-icons/im";
import { BsCircleFill } from "react-icons/bs";
import { VscCircleFilled } from "react-icons/vsc";

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

export const Ride = (props: ride) => {
  //converting the string date data to the date object
  const date = new Date(props.date);

  return (
    <div className="horizantalFlexContainer rideContainer">
      <div className="verticalFlexContainer">
        <div
          className="blackText openSansFont bold mediumLargeText"
          style={{ paddingBottom: "1vh", paddingLeft: "1.2vw" }}
        >
          {props.userName}
        </div>
        <div className="horizantalFlexContainer">
          <div>
            <ul>
              <li className="openSansFont greyText bold smallText">From</li>
              <li className="openSansFont blackText mediumText">
                {props.fromCity}
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
            <li className="openSansFont greyText bold smallText">date</li>
            <li className="openSansFont blackText mediumText">
              {date.toLocaleDateString()}
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="openSansFont greyText bold smallText">price</li>
            <li className="openSansFont blackText mediumText">{props.price}</li>
          </ul>
        </div>
      </div>
      <div className="verticalFlexContainer">
        <div style={{ textAlign: "right", paddingBottom: "1vh" }}>
          <img src={userImage} alt="user" className="userImage " />
        </div>
        <div>
          <ul>
            <li className="openSansFont greyText bold smallText">To</li>
            <li className="openSansFont blackText mediumText">
              {props.toCity}
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="openSansFont greyText bold smallText">Time</li>
            <li className="openSansFont blackText mediumText">
              {date.toLocaleTimeString()}
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li className="openSansFont greyText bold smallText">
              Seat Availabilty
            </li>
            <li className="openSansFont blackText mediumText">{props.seats}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
