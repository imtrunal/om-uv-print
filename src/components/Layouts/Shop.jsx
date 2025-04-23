import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { shop } from "../../utils/data";

function Shop() {
  const [Select, setSelect] = useState(0);

  return (
    <>
      <div className="w-[90%] mx-auto pt-10 sm:pt-16">
        {/* Title */}
        <div>
          <h2 className="text-[#19232e] text-2xl sm:text-3xl md:text-[40px] font-semibold">
            Shop by
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="bg-[#000787] px-4 sm:px-10 md:px-16 py-3 sm:py-4 my-6 sm:my-10 rounded-[10px] flex items-center gap-x-2 overflow-auto scrollbar-hide">
          {["OCCASION", "RECIPIENT", "DESIGNS"].map((cat, index) => (
            <div
              key={index}
              className={`whitespace-nowrap text-sm p-2 sm:p-3 rounded-md font-semibold hover:cursor-pointer transition-colors ${Select === index
                  ? "bg-white text-[#048e1d]"
                  : "bg-transparent text-white"
                }`}
              onClick={() => setSelect(index)}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Shop Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {shop.map((item, index) => (
            <div
              key={index}
              className="w-full p-3 border border-transparent hover:border-dashed hover:border-gray-400/40 rounded-lg transition-all duration-200"
            >
              <div className="w-full overflow-hidden hover:cursor-pointer">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col gap-y-2 mt-3">
                <h4 className="text-[#19232e] text-lg font-semibold">
                  {item.name}
                </h4>
                <p className="text-[#19232e] text-sm sm:text-base font-normal">
                  {item.des}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider CTA */}
        <div className="py-12 sm:py-16 flex items-center">
          <div className="flex-1">
            <hr />
          </div>
          <div className="mx-3">
            <p className="text-[#000787] text-sm sm:text-base font-semibold uppercase flex items-center gap-x-2 hover:cursor-pointer">
              See more
              <MdArrowOutward size={20} />
            </p>
          </div>
          <div className="flex-1">
            <hr />
          </div>
        </div>
      </div>
    </>

  );
}

export default Shop;
