import React, { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { categories, mainDescription, products } from "../../utils/data";
import { useNavigate } from 'react-router-dom';

function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const navigate=useNavigate();
  return (
    <div className="w-[90%] mx-auto pt-24">
      <div className="mb-10">
        <h1 className="text-[#19232e] text-[40px]">Product Categories</h1>
      </div>
      <div className="bg-[#000787] px-16 py-4 rounded-[10px] flex items-center justify-start overflow-auto">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`text-sm p-3 rounded-md font-semibold hover:cursor-pointer ${selectedCategory === index ? "bg-white text-[#048e1d]" : "text-white bg-transparent"
              }`}
            onClick={() => setSelectedCategory(index)}
          >
            {category.name}
          </div>
        ))}
      </div>

      <div className="py-10 flex gap-3">
        <div className="w-[30%] flex flex-col gap-y-4">
          <h3 className="text-[#19232e] font-semibold text-[32px]">
            {categories[selectedCategory].name}
          </h3>
          <p className="text-[#888D92] text-base">
            {mainDescription[categories[selectedCategory].name]}
          </p>

          <p className="text-[#000787] text-base font-semibold uppercase flex items-center gap-x-2 hover:cursor-pointer">
            Explore All {categories[selectedCategory].name}
            <MdArrowOutward size={20} />
          </p>
        </div>
        <div className="w-[75%] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {products[categories[selectedCategory].name].map((item, index) => (
            <div
              className="w-full rounded-lg hover:border hover:border-dashed cursor-pointer"
              onClick={() => {navigate(item.path),sessionStorage.setItem("newPage", JSON.stringify(true))}}
              key={index}
            >
              <div className="w-full h-[319px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-full object-cover rounded-lg border-b shadow-lg"
                />
              </div>
              <div className="rounded-b-lg bg-white p-5">
                <div className="flex flex-col gap-y-1">
                  <h3 className="text-[#19232e] text-[19px] font-bold line-clamp-2">
                    {item.title}
                  </h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="flex items-center w-full gap-x-4">
        <div className="flex-1">
          <hr className="border-gray-300" />
        </div>
        <p className="text-[#000787] text-base font-semibold uppercase flex items-center gap-x-2 hover:cursor-pointer">
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
