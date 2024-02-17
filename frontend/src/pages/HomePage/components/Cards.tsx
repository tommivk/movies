import useCardAnimation from "../hooks/useCardAnimation";

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

export default Cards;
