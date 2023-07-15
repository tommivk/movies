import { useState, useEffect, useRef, useCallback } from "react";

import "./homePage.scss";

const useCardAnimation = () => {
  const [card1Index, setCard1Index] = useState(2);
  const [card2Index, setCard2Index] = useState(4);
  const [card3Index, setCard3Index] = useState(0);

  const cardPaths = [
    "/card1.png",
    "/card2.png",
    "/card3.png",
    "/card4.png",
    "/card5.png",
    "/card6.png",
  ];

  const maxIndex = cardPaths.length - 1;

  const firstRenderRef = useRef<number>();
  const requestRef = useRef<number>();
  const previousRef = useRef<number>();
  const card1UpdateRef = useRef<number>(-6);
  const card2UpdateRef = useRef<number>(-3);
  const card3UpdateRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      if (firstRenderRef.current == undefined) {
        firstRenderRef.current = Math.ceil(time / 1000);
      }
      if (previousRef.current != undefined) {
        const second = Math.ceil(time / 1000) - firstRenderRef.current;

        const timeSinceCard1Update = second - card1UpdateRef.current;
        if (timeSinceCard1Update >= 10 && timeSinceCard1Update % 10 == 0) {
          card1UpdateRef.current = second;
          card1Index < maxIndex
            ? setCard1Index((index) => index + 1)
            : setCard1Index(0);
        }

        const timeSinceCard2Update = second - card2UpdateRef.current;
        if (timeSinceCard2Update >= 10 && timeSinceCard2Update % 10 == 0) {
          card2UpdateRef.current = second;
          card2Index < maxIndex
            ? setCard2Index((index) => index + 1)
            : setCard2Index(0);
        }

        const timeSinceCard3Update = second - card3UpdateRef.current;
        if (timeSinceCard3Update >= 10 && timeSinceCard3Update % 10 == 0) {
          card3UpdateRef.current = second;
          card3Index < maxIndex
            ? setCard3Index((index) => index + 1)
            : setCard3Index(0);
        }
      }

      previousRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [card1Index, card2Index, card3Index, maxIndex]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  return [cardPaths[card1Index], cardPaths[card2Index], cardPaths[card3Index]];
};

const HomePage = () => {
  const [card1, card2, card3] = useCardAnimation();

  return (
    <div className="home">
      <div className="home__topSection">
        <div className="home__projector">
          <img src="/projector.png"></img>

          <div className="home__lightWrapper">
            <div className="home__light" />
          </div>
        </div>

        <div className="home__cards">
          <img className="home__card home__card1" src={card1}></img>
          <img className="home__card home__card2" src={card2}></img>
          <img className="home__card home__card3" src={card3}></img>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
