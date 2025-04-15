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
      <div className="px-5">
        <div className="bg-[#efecea] px-[60px] py-12 rounded-[10px]">
          <div className="my-[40px]">
            <h1 className="text-[#19232e] text-[40px]">Customer favourites</h1>
          </div>
          <div>
            <AliceCarousel
              autoPlay
              autoPlayStrategy="none"
              autoPlayInterval={4000}
              animationDuration={1000}
              animationType="fadeout"
              infinite
              touchTracking={false}
              responsive={{
                0: { items: 1 },
                600: { items: 2 },
                1024: { items: 3 },
              }}
              autoWidth={true}
              mouseTracking
              renderPrevButton={() => (
                <button className="bg-white/80 absolute -left-6  top-48 rounded-full p-0 size-12 ring-1 flex items-center justify-center">
                  <MdOutlineArrowBackIos size={20} />
                </button>
              )}
              renderNextButton={() => (
                <button className="bg-white/80 absolute -right-6 top-48  rounded-full p-0 size-12 ring-1 flex items-center justify-center">
                  <MdOutlineArrowForwardIos size={20} />
                </button>
              )}
              items={cards.sort(() => Math.random() - 0.5).map((item, index) => {
                return (
                  <div className="w-[321px] rounded-lg cursor-pointer h-full" key={index} onClick={() => { navigate(item.path), sessionStorage.setItem("newPage", JSON.stringify(true)) }}>
                    <div className="w-full h-[319px]">
                      <img
                        src={item.image}
                        alt=""
                        className="size-full object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="rounded-b-lg bg-white p-5" >
                      <div className="flex flex-col gap-y-1">
                        <h5 className="text-[#1A1919] font-semibold text-sm">
                          {item.title}
                        </h5>
                        <h3 className="text-[#19232e] text-[15px] font-normal">
                          {item.description}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Favourites;
