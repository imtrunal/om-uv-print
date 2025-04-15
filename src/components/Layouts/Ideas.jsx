import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { ideas } from "../../utils/data";

function Ideas() {
  const [Select, setSelect] = useState(0);
  
  return (
    <>
      <div>
        <div className="w-[90%] mx-auto pt-24">
          <div>
            <h2 className="text-[#19232e] text-[40px]">Ideas and Inspiration</h2>
          </div>
          <div className="flex flex-wrap mt-10">
            {ideas.map((item, index) => {
              return (
                <div key={index} className="w-full md:w-1/2 lg:w-1/4 p-2.5">
                  <div className="bg-[#EFECEA]4 rounded-md shadow-md h-full overflow-hidden">
                    <img
                      className="w-full h-1/2 object-cover"
                      src={item.image} alt="Card Image" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#19232e]">{item.name}</h3>
                      <p className="text-[#888d92] text-sm mt-2">{item.des}</p>
                      <p href="#" className="text-[#048e1d] font-semibold mt-4 inline-block cursor-pointer mb-16">READ MORE →</p>
                    </div>
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
                VIEW ALL ARTICLES
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

export default Ideas;
