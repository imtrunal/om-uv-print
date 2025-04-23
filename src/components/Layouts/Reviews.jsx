import { Button } from "@heroui/react";
import { Rating } from "@mui/material";
import React from "react";
import AliceCarousel from "react-alice-carousel";
import {
  MdArrowOutward,
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { reviews } from "../../utils/data"
function Reviews() {

  return (
    <>
      <div>
        <div className="w-[90%] mx-auto py-20">
          <div>
            <h2 className="text-[#19232e] text-2xl sm:text-3xl md:text-[40px]">
              What our customers are saying
            </h2>
          </div>
          <div className="flex items-center gap-x-2 mt-6">
            <span className="text-[#212529] text-base font-semibold">
              {(reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)}
            </span>
            <p className="text-[#212529] text-base">
              rating out of {reviews.length}
            </p>
          </div>
          <div>
            <AliceCarousel
              autoPlay
              autoPlayStrategy="none"
              autoPlayInterval={2000}
              animationDuration={1000}
              animationType="fadeout"
              infinite
              touchTracking={false}
              responsive={{
                0: { items: 1, slidesToSlide: 1 },
                600: { items: 2, slidesToSlide: 2 },
                1024: { items: 3, slidesToSlide: 3 },
                1280: { items: 5, slidesToSlide: 5 },
              }}
              autoWidth={false}
              mouseTracking
              renderPrevButton={() => (
                <button className="absolute -left-6 top-48 rounded-full p-0 size-12 ring-1 flex items-center justify-center">
                  <MdOutlineArrowBackIos size={20} />
                </button>
              )}
              renderNextButton={() => (
                <button className="absolute -right-6 top-48 rounded-full p-0 size-12 ring-1 flex items-center justify-center">
                  <MdOutlineArrowForwardIos size={20} />
                </button>
              )}
              items={reviews.map((review, index) => (
                <div key={index} className="w-[259px] h-[271px] bg-[#EFECEA] rounded-lg px-5 relative overflow-visible">
                  <div className="mt-20 flex">
                    <div className={`size-20 rounded-full flex items-center justify-center text-white font-semibold text-4xl capitalize absolute top-0 -translate-y-1/2 ${index % 2 == 0 ? "bg-[#048e1d]" : "bg-[#000787]"}`}>
                      {review.name.charAt(0)}
                    </div>
                  </div>
                  <div className="pt-12 pb-8 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-[#5D6064] text-lg font-semibold capitalize">
                        {review.name}
                      </h3>
                      <Rating
                        defaultValue={review.rating}
                        readOnly
                        sx={{ color: "#e46d4e", fontSize: "19px" }}
                      />
                      <p className="text-[#888D92] text-base">
                        {review.review}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            />
          </div>
          <div className="flex justify-center mt-3">
            <a href="https://g.co/kgs/mKR29QA" target="_blank" className="text-[#048e1d] text-base font-semibold uppercase flex items-center gap-x-2 hover:cursor-pointer">
              View all reviews
              <MdArrowOutward size={20} />
            </a>
          </div>
        </div>
      </div>


      <div className="bg-[#111827] -mb-5 border-b">
        <div className="w-[90%] mx-auto py-10 md:py-20">
          <div className="flex flex-col lg:flex-row gap-y-10 lg:gap-y-0">
            <div className="w-full lg:w-[60%] h-[300px] sm:h-[400px] lg:h-[446px]">
              <iframe
                src="https://www.youtube.com/embed/x4MYLy_9_zg?rel=0&autoplay=1&mute=1"
                frameBorder="0"
                className="w-full h-full rounded-lg"
                allowFullScreen
              ></iframe>
            </div>
            <div className="w-full lg:w-[40%] lg:pl-20 pt-5 lg:pt-10 flex flex-col gap-y-5">
              <h2 className="text-white text-2xl sm:text-3xl lg:text-[32px] font-semibold">
                Print, Preserve & Cherish
              </h2>
              <p className="text-sm text-white leading-5 font-semibold">
                Explore specially curated personalized Gifts, tasteful Décor and
                meaningful keepsakes with us. Let our range of specially curated
                personalized goodies tell your life’s story and elevate your art
                of <br className="hidden sm:block" /> gifting. Now capture life’s fondest memories & make
                them live forever. Experience the Zoomin promise today!
              </p>
              <Button
                onClick={() => window.scrollTo({ top: 10, behavior: 'smooth' })}
                className="bg-[#048e1d] text-white font-semibold rounded-md px-6 py-4 w-fit text-sm sm:text-base"
              >
                Shop Now
                <MdArrowOutward size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Reviews;
