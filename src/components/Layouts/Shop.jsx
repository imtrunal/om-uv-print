import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { shop } from "../../utils/data";

function Shop() {
  const [Select, setSelect] = useState(0);

  return (
    <>
      <div>
        <div className="w-[90%] mx-auto pt-10">
          <div>
            <h2 className="text-[#19232e] text-[40px]">Shop by</h2>
          </div>
          <div className="bg-[#000787] px-16 py-4 my-10 rounded-[10px] flex items-center gap-x-2 overflow-auto">
            {["OCCASION", "RECIPIENT", "DESIGNS"].map((cat, index) => {
              return (
                <div
                  key={index}
                  className={`text-sm p-3 rounded-md font-semibold hover:cursor-pointer ${Select == index
                    ? "bg-white text-[#048e1d]"
                    : "bg-transparent text-white "
                    }`}
                  onClick={() => setSelect(index)}
                >
                  {cat}
                </div>
              );
            })}
          </div>
          <div className="flex">
            {shop.map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-[340px] p-3 border border-transparent hover:border-dashed hover:border-gray-400/40 rounded-lg transition-all duration-200"
                >
                  <div className="w-full overflow-hidden hover:cursor-pointer">
                    <img
                      src={item.image}
                      alt="#"
                      className="object-cover "
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 mt-3">
                    <h4 className="text-[#19232e] text-lg font-semibold">
                      {item.name}
                    </h4>
                    <p className="text-[#19232e] text-base font-normal">
                      {item.des}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="py-16 flex items-center">
            <div className="flex-1">
              <hr />
            </div>
            <div className="mx-3">
              <p className="text-[#000787] text-base font-semibold uppercase flex items-center gap-x-2 hover:cursor-pointer">
                See more
                <MdArrowOutward size={20} />
              </p>
            </div>
            <div className="flex-1">
              <hr />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
