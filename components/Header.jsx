import React from "react";
import { useState, useEffect } from "react";
import Wrapper from "./Wrapper";
import Link from "next/link";
import Menu from "./Menu";
import MenuMobile from "./MenuMobile";


import { IoMdHeartEmpty } from 'react-icons/io'
import { BsCart } from 'react-icons/bs'
import { BiMenuAltRight } from 'react-icons/bi'
import { VscChromeClose } from 'react-icons/vsc'
import { fetchDataFromApi } from "@/utils/api";
import { useSelector } from "react-redux";







const Header = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [showCatMenu, setShowCatMenu] = useState(false);
    const [show, setShow] = useState("translate-y-0");
    const [lastScrolly, setLastScrolly] = useState(0);

    const [categories, setCategories] = useState(null)

    const {cartItems}=useSelector((state)=>state.cart)

    const controlNavBar = () => {

        if (window.scrollY > 200) {
            if (window.scrollY > lastScrolly && !mobileMenu) {

                setShow("-translate-y-[80px]")

            } else {

                setShow("shadow-sm")

            }
            

        } else {
            setShow("translate-y-0")
        }
        setLastScrolly(window.scrollY);

    }


    useEffect(() => {
        window.addEventListener("scroll", controlNavBar);
        return () => {
            window.removeEventListener("scroll", controlNavBar);
        }
    }, [lastScrolly])


    useEffect(()=>{ fetchCategories()},[])

    const fetchCategories=async () => {
        const {data}= await fetchDataFromApi('/api/categories?populate=*')
        setCategories(data);
    }



    return <header className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show}`}>
        <Wrapper className="h-[60px] flex justify-between items-center">
            <Link href="/">
                <img src="/logo.svg" className="w-[40px] md:w-[60px]" alt="" />
            </Link>
            <Menu showCatMenu={showCatMenu} setShowCatMenu={setShowCatMenu} categories={categories}/>
            {mobileMenu && <MenuMobile showCatMenu={showCatMenu} setShowCatMenu={setShowCatMenu} setMobileMenu={setMobileMenu} categories={categories}/>}
            <div className="flex items-center gap-2 text-black">
                {/* Icon Start */}
                <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
                    <IoMdHeartEmpty className="text-[19px] md:text-[24px]" />
                    <div className="h-[14px] md:[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7
                    text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">52</div>
                </div>
                {/* Icon End */}

                {/* Icon Start */}
                <Link href="/cart">
                <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
                    <BsCart className="text-[15px] md:text-[20px]" />
                    {cartItems.length>0 && <div className="h-[14px] md:[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7
                    text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
                        {cartItems.length}
                    </div>}
                </div>
                </Link>
                {/* Icon End */}

                {/* MoBile Icon Start */}

                <div className=" -mr-2 w-8 md:w-12 h-8 md:h-12 rounded-full flex md:hidden justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
                    {mobileMenu ? (
                        <VscChromeClose className='text-[16px] '
                            onClick={() => setMobileMenu(false)}
                        />
                    ) : (<BiMenuAltRight className='text-[20px] '
                        onClick={() => setMobileMenu(true)}
                    />)}
                </div>
                {/* MoBile Icon End */}
            </div>
        </Wrapper>
    </header>;
};

export default Header;
