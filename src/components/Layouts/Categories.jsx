import React, { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { categories, mainDescription, products } from "../../utils/data";
import { useNavigate } from 'react-router-dom';

function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const navigate = useNavigate();
  return (
    <div className="w-[90%] mx-auto pt-16 sm:pt-24">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-[#19232e] text-2xl sm:text-3xl md:text-[40px] font-semibold">
          Product Categories
        </h1>
      </div>

      <div className="bg-[#000787] px-4 sm:px-8 md:px-16 py-3 sm:py-4 rounded-[10px] flex items-center gap-x-2 overflow-auto scrollbar-hide">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`whitespace-nowrap text-sm p-2 sm:p-3 rounded-md font-semibold hover:cursor-pointer transition-colors ${selectedCategory === index
                ? "bg-white text-[#048e1d]"
                : "text-white bg-transparent"
              }`}
            onClick={() => setSelectedCategory(index)}
          >
            {category.name}
          </div>
        ))}
      </div>

      <div className="py-10 flex flex-col lg:flex-row gap-6 lg:gap-3">
        {/* Left Text Column */}
        <div className="w-full lg:w-[30%] flex flex-col gap-y-4">
          <h3 className="text-[#19232e] font-semibold text-2xl sm:text-[28px] lg:text-[32px]">
            {categories[selectedCategory].name}
          </h3>
          <p className="text-[#888D92] text-sm sm:text-base">
            {mainDescription[categories[selectedCategory].name]}
          </p>

          <p className="text-[#000787] text-sm sm:text-base font-semibold uppercase flex items-center gap-x-2 hover:cursor-pointer">
            Explore All {categories[selectedCategory].name}
            <MdArrowOutward size={20} />
          </p>
        </div>

        {/* Products Grid */}
        <div className="w-full lg:w-[70%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {products[categories[selectedCategory].name].map((item, index) => (
            <div
              className="w-full rounded-lg hover:border hover:border-dashed cursor-pointer"
              onClick={() => {
                navigate(item.path);
                sessionStorage.setItem("newPage", JSON.stringify(true));
              }}
              key={index}
            >
              <div className="w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full rounded-lg border-b shadow-lg"
                />
              </div>
              <div className="rounded-b-lg bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-y-1">
                  <h3 className="text-[#19232e] text-base sm:text-[19px] font-bold line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#555]">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Divider */}
      <div className="flex items-center w-full gap-x-4 mt-4">
        <div className="flex-1">
          <hr className="border-gray-300" />
        </div>
        <p className="text-[#000787] text-sm sm:text-base font-semibold uppercase flex items-center gap-x-2 hover:cursor-pointer">
          View All Products
          <MdArrowOutward size={20} />
        </p>
        <div className="flex-1">
          <hr className="border-gray-300" />
        </div>
      </div>
    </div>

  );
}

export default Categories;
