import { image } from "@heroui/react";
import React from "react";
import AliceCarousel from "react-alice-carousel";
import {
  MdArrowOutward,
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { trendPhoto } from "../../utils/data"
function Trending() {

  return (
    <>
      <div className="px-5">
        <div className="py-[50px] px-[60px] bg-[#EFECEA] rounded-[10px]">
          <div>
            <h2 className="text-[#19232e] text-[40px]">What’s Trending!</h2>
          </div>
          <div className="flex flex-wrap gap-x-4"></div>
          <div className="py-10">
            <AliceCarousel
              autoPlay
              autoPlayStrategy="none"
              autoPlayInterval={2000}
              animationDuration={1000}
              animationType="fadeout"
              infinite
              touchTracking={false}
              disableDotsControls
              responsive={{
                0: { items: 1, slidesToSlide: 1 },
                600: { items: 2, slidesToSlide: 2 },
                1024: { items: 4, slidesToSlide: 4 },
              }}
              autoWidth={false}
              mouseTracking
              renderPrevButton={() => (
                <button className="bg-white/80 absolute -left-6 top-36 rounded-full p-0 size-12 ring-1 flex items-center justify-center">
                  <MdOutlineArrowBackIos size={20} />
                </button>
              )}
              renderNextButton={() => (
                <button className="bg-white/80 absolute -right-6 top-36 rounded-full p-0 size-12 ring-1 flex items-center justify-center">
                  <MdOutlineArrowForwardIos size={20} />
                </button>
              )}
              items={trendPhoto.map((item, index) => (
                <div
                  key={index}
                  className="size-[325px] rounded-lg relative group"
                >
                  <div className="size-full overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt="#"
                      className="size-full object-cover rounded-lg overflow-hidden group-hover:scale-105 group-hover:cursor-pointer transition-all duration-200 ease-in-out"
                    />
                  </div>
                  <div
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0) 59%, rgba(0, 0, 0, 0.65) 100%)",
                    }}
                    className="w-full h-[200px] absolute bottom-0 opacity-0 group-hover:opacity-100 group-hover:cursor-pointer transition-all ease-in duration-200"
                  ></div>
                  <div className="absolute top-4 right-4">
                    <img src={item.tag} alt="" />
                  </div>
                </div>
              ))}
            />
          </div>
          <div className="flex justify-center">
            <p className="text-[#000787] text-base font-semibold uppercase flex items-center gap-x-2 hover:cursor-pointer">
              Follow us on instagram
              <MdArrowOutward size={20} />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Trending;
