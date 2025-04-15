import { FaPinterestP } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { RiInstagramLine, RiTwitterXLine } from "react-icons/ri";
import { SiYoutube } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="bg-[#111827] text-white py-3 px-5 sm:px-10 md:px-20 mt-5">
            <div className="flex flex-wrap justify-between max-w-7xl mx-auto mt-10 gap-y-6">
                <div className="w-full md:w-2/5 text-center md:text-left">
                    <h2 className="text-2xl mb-3">Our Brands</h2>
                    <div className="flex flex-col gap-3 mt-8">
                        <p className="text-sm cursor-pointer">Om UV Print - Bring your memories to life</p>
                    </div>
                    <div className="mt-16">
                        <h1 className="text-[#fff] text-2xl" style={{ fontFamily: "Boldonse" }}>OM UV PRINT</h1>
                        <p className="text-[#EA097C]">Print on Any Surface</p>
                        {/* Lilita One, Boldonse, Anton, Russo One*/}
                    </div>
                </div>

                <div className="w-full md:w-1/6 text-center md:text-left">
                    <h2 className="text-2xl mb-3">About Us</h2>
                    <ul className="text-sm space-y-2 mt-7">
                        <li className="cursor-pointer text-base/7"><a href="/service-promise">Service Promise</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/careers">Careers</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/safe-shopping">Safe Shopping</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/site-map">Site Map</a></li>
                    </ul>
                </div>

                <div className="w-full md:w-1/6 text-center md:text-left">
                    <h2 className="text-2xl mb-3">Useful Links</h2>
                    <ul className="text-sm space-y-2 mt-7">
                        <li className="cursor-pointer text-base/7"><a href="/help-desk">Help Desk</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/blog">Blog</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/refer-a-friend">Refer a Friend</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/bulk-orders">Bulk Orders</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/rate-now">Rate Now</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/prices">Prices</a></li>
                    </ul>
                </div>

                <div className="w-full md:w-1/6 text-center md:text-left">
                    <h2 className="text-2xl mb-3">Best Online Shop For</h2>
                    <ul className="text-sm space-y-2 mt-7">
                        <li className="cursor-pointer text-base/7"><a href="/acrylic">Acrylic Photo</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/clear-acrylic">Clear Acrylic Photo</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/fridge-magnets">Fridge Magnets</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/acrylic-wall-clock">Acylic Wall Clock</a></li>
                        <li className="cursor-pointer text-base/7"><a href="/collage-acrylic-photo">Collage Acylic Photo</a></li>
                    </ul>
                </div>
            </div>

            <div className="text-white flex flex-col md:flex-row justify-between items-center mt-6 text-center text-sm gap-y-4">
                <div className="flex flex-col md:flex-row items-center space-x-6">
                    <p>Design & Develop by<a href="https://sughosh.dev/" className="font-bold text-[#FFC107]" target="_blank"> Sughosh Technolab.</a></p>
                    <div className="flex space-x-6 text-gray-600">
                        <a href="/privacy" className="cursor-pointer">Privacy</a>
                        <a href="/terms-of-use" className="cursor-pointer">Terms of use</a>
                    </div>
                </div>

                <div className="flex gap-6 sm:gap-8 justify-center md:justify-end">
                    <a href="https://instagram.com" target="_blank"><RiInstagramLine className="cursor-pointer text-xl" /></a>
                    <a href="https://facebook.com" target="_blank"><FaFacebookF className="cursor-pointer text-xl" /></a>
                    <a href="https://www.youtube.com/@OM_UV_PRINT_23610" target="_blank"><SiYoutube className="cursor-pointer text-xl" /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
