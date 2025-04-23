import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "../../assets/css/index.css";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { cards } from "../../utils/data";
import { useNavigate } from 'react-router-dom';

function Favourites() {
  const navigate = useNavigate();
  return (
    <>
    <div className="px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="bg-[#efecea] px-4 sm:px-10 md:px-[60px] py-10 sm:py-12 rounded-[10px]">
        <div className="my-6 sm:my-10">
          <h1 className="text-[#19232e] text-2xl sm:text-3xl md:text-[40px] font-semibold">
            Customer favourites
          </h1>
        </div>
  
        <div className="relative">
          <AliceCarousel
            autoPlay
            autoPlayStrategy="none"
            autoPlayInterval={4000}
            animationDuration={1000}
            animationType="fadeout"
            infinite
            touchTracking
            mouseTracking
            responsive={{
              0: { items: 1 },
              600: { items: 2 },
              1024: { items: 3 },
            }}
            renderPrevButton={() => (
              <button className="bg-white/80 absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 rounded-full size-10 md:size-12 ring-1 flex items-center justify-center z-10">
                <MdOutlineArrowBackIos size={18} />
              </button>
            )}
            renderNextButton={() => (
              <button className="bg-white/80 absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 rounded-full size-10 md:size-12 ring-1 flex items-center justify-center z-10">
                <MdOutlineArrowForwardIos size={18} />
              </button>
            )}
            items={cards
              .sort(() => Math.random() - 0.5)
              .map((item, index) => (
                <div
                  className="w-[280px] sm:w-[300px] md:w-[321px] rounded-lg cursor-pointer h-full"
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    sessionStorage.setItem("newPage", JSON.stringify(true));
                  }}
                >
                  <div className="w-full h-[280px] sm:h-[300px] md:h-[319px]">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="rounded-b-lg bg-white p-4 sm:p-5">
                    <div className="flex flex-col gap-y-1">
                      <h5 className="text-[#1A1919] font-semibold text-sm sm:text-base">
                        {item.title}
                      </h5>
                      <h3 className="text-[#19232e] text-xs sm:text-sm font-normal">
                        {item.description}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
          />
        </div>
      </div>
    </div>
  </>
  
  );
}

export default Favourites;
