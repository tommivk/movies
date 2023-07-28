import { Swiper as ReactSwiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import classNames from "classnames";

import "./swiper.scss";
import "swiper/css/bundle";

type Props = {
  slides: React.ReactNode[];
  size?: "sm";
};

const Swiper = ({ slides, size = "sm" }: Props) => {
  return (
    <div className={classNames("swiperContainer", { [size]: size })}>
      <ReactSwiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".swiper-btn-next",
          prevEl: ".swiper-btn-prev",
        }}
        spaceBetween={50}
        slidesPerView={"auto"}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>{slide}</SwiperSlide>
        ))}
      </ReactSwiper>

      <div className="swiper-btn-prev"></div>
      <div className="swiper-btn-next"></div>
    </div>
  );
};

export default Swiper;
