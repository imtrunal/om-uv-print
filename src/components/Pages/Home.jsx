import React from "react";
import Header from "../Commons/Header";
import HeroSection from "../Layouts/HeroSection";
import Favourites from "../Layouts/Favourites";
import Categories from "../Layouts/Categories";
import Shop from "../Layouts/Shop";
import Trending from "../Layouts/Trending";
import Reviews from "../Layouts/Reviews";
import "../../assets/css/tailwind.css"

function Home() {
  return (
    <>
      <HeroSection />
      <Favourites />
      <Categories />
      <Shop />
      <Trending />
      <Reviews />
    </>
  );
}

export default Home;
