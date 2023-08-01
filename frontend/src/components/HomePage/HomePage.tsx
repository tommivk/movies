import { useState, useEffect, useCallback } from "react";
import Button from "../Button/Button";
import useCardAnimation from "../../hooks/useCardAnimation";
import useModalContext from "../../context/useModalContext";

import "./homePage.scss";

const Cards = () => {
  const [card1, card2, card3] = useCardAnimation();
  return (
    <>
      <img className="home__card home__card1" src={card1}></img>
      <img className="home__card home__card2" src={card2}></img>
      <img className="home__card home__card3" src={card3}></img>
    </>
  );
};

const HomePage = () => {
  const { openSignUpModal } = useModalContext();
  const [play, setPlay] = useState(false);

  const checkVisibility = useCallback(() => {
    if (!play && document.visibilityState === "visible") {
      setPlay(true);
    }
  }, [play]);

  useEffect(() => {
    document.addEventListener("visibilitychange", checkVisibility);
    checkVisibility();
    return () => {
      document.removeEventListener("visibilitychange", checkVisibility);
    };
  }, [checkVisibility]);

  return (
    <div className="home">
      <div className="home__topSection">
        <div className="home__left">
          <h1>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae aut
            nemo pariatur expedita dolorem maiores
          </h1>
          <Button
            size={"lg"}
            hoverEffect="zoom"
            onClick={openSignUpModal}
            data-cy="openSignup"
          >
            Sign Up
          </Button>
        </div>
        <div className="home__cards">{play && <Cards />}</div>
      </div>
    </div>
  );
};

export default HomePage;
