import React from "react";
import { FiGift } from "react-icons/fi";

function Header() {
  const Links = [
    { name: "Photobooks" },
    { name: "Framed Prints" },
    { name: "Calendars" },
    { name: "Kids" },
    { name: "Décor" },
    { name: "Gifts" },
    { name: "Card Stock Prints" },
    { name: "Photo Prints" },
    { name: "Bags and Pouches" },
    { name: "Stationery" },
    { name: "Accessories" },
    { name: "Chocolates" },
    { name: "Gift Finder" },
  ];
  return (
    <>
      <div className="mb-3">
        <div className="h-[30px] bg-[#2C4569] w-full"></div>
        <div className="border-b">
          <div className="w-[90%] mx-auto pt-4">
            <div className="flex justify-between items-center">
              <img
                src="/assets/ZOOMIN_primary_logotype.svg"
                alt=""
                className="w-[145px] hover:cursor-pointer"
              />
              <div className="flex gap-x-3">
                <span className="text-[13px] text-[#ff5a21] font-medium hover:cursor-pointer">
                  Register
                </span>
                <span className="text-[13px] text-[#19232e] font-medium">
                  or
                </span>
                <span className="text-[13px] text-[#ff5a21] font-medium hover:cursor-pointer">
                  Login
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3">
              {Links.map((link, index) => (
                <div
                  key={index}
                  className="pb-3 flex items-center relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-[#ff5a21] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name == "Gift Finder" && <FiGift className="mr-2 text-black" />}
                  <a href="#" className="text-[#10232E] text-[13px]">
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
