import "./homePage.scss";

const HomePage = () => {
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
          <img className="home__card home__card1" src="/card1.png"></img>
          <img className="home__card home__card2" src="/card2.png"></img>
          <img className="home__card home__card3" src="/card3.png"></img>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
