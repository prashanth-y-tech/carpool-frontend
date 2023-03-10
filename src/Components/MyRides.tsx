import React, { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import "../Styles/MyRides.css";
import { Ride } from "./Ride";
import axios, { AxiosError } from "axios";
import { Loading } from "./Loading";
import { useNavigate } from "react-router-dom";
import store from "../redux/store";

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
interface user {
  id: number;
  name: string;
  email: string;
}
interface httpError {
  errorCode?: number;
  message?: string;
}

export const MyRides = () => {
  //Declarations of all the states and variables
  const [loading, setloading] = useState(false);
  const [offeredRides, setofferedRides] = useState<ride[]>([]);
  const [bookedRides, setbookedRides] = useState<ride[]>([]);
  const [user, setuser] = useState<user>();
  const navigate = useNavigate();

  //To handle user authentication and change the path if user is already loggedin
  const GetAuthenticationState = () => {
    const user = store.getState();
    if (user.user == null) {
      navigate("/");
      window.alert("Please SignIn/SignUp!");
    }
    setuser(user.user);
  };

  useEffect(() => {
    if (user != undefined) {
      GetOfferedRides();
      GetBookedRides();
    }
  }, [user]);

  useEffect(() => {
    GetAuthenticationState();
    const unsubscribe = store.subscribe(() => GetAuthenticationState());
    return () => {
      unsubscribe();
    };
  }, []);

  //Function to get the offered rides
  const GetOfferedRides = async (): Promise<void> => {
    setloading(true);
    await axios
      .get("https://carpoolwebapi.azurewebsites.net/Rides/User", {
        params: {
          userId: user?.id,
        },
        withCredentials: true,
      })
      .then((response) => {
        setofferedRides(response.data);
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

  //Function to get the booked rides
  const GetBookedRides = async (): Promise<void> => {
    setloading(true);
    await axios
      .get(`https://carpoolwebapi.azurewebsites.net/Bookings/User/`, {
        params: {
          userId: user?.id,
        },
        withCredentials: true,
      })
      .then((response) => {
        setbookedRides(response.data);
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

  return (
    <div style={{ width: "98vw" }} className="MyRides">
      {/* The nav bar section in the component  */}
      <NavBar />
      {/* The loading component  */}
      {loading ? <Loading /> : <div></div>}
      {/* The main components hosting booked and offered rides  */}
      <div className="horizantalFlexContainer myRidesSection">
        {/* The booked rides section  */}
        <div className="rideSection">
          <div className="rideHead violetBackground openSansFont whiteText mediumText">
            BookedRides
          </div>
          <div className="flexContainer flexWrap">
            {bookedRides.length == 0 ? (
              <div className="mediumText greyText openSansFont noBookedRideMsg">
                No Rides!😞
              </div>
            ) : (
              bookedRides.map((ride) => {
                return <Ride key={ride.id} {...ride} />;
              })
            )}
          </div>
        </div>
        {/* The offered rides section  */}
        <div className="rideSection">
          <div className="rideHead orangeBackground openSansFont whiteText mediumText">
            OfferedRides
          </div>
          <div className="flexContainer flexWrap">
            {offeredRides.length == 0 ? (
              <div className="mediumText greyText openSansFont noOfferRideMsg">
                No Rides!😞
              </div>
            ) : (
              offeredRides.map((ride) => {
                return <Ride key={ride.id} {...ride} />;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
