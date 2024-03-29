import ProductDetailsCarousel from '@/components/ProductDetailsCarousel'
import RelatedProduct from '@/components/RelatedProduct'
import Wrapper from '@/components/Wrapper'
import { addToCart } from '@/store/cartSlice'
import { fetchDataFromApi } from '@/utils/api'
import { getDiscountedPercentage } from '@/utils/helper'
import React, { useState } from 'react'
import { IoMdHeartEmpty } from 'react-icons/io'

import { useSelector, useDispatch } from 'react-redux'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const ProductDetails = ({ product, products }) => {


    const [selectedSize,setSelectedSize]=useState();
    const [showErr,setShowErr]=useState(false);

    const dispatch = useDispatch();

    const p = product?.data?.[0]?.attributes;

    const notify=()=>{
        toast.success('Success. Check Your Cart', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });

    }
    return (
        <div className='w-full md:py-20'>
        <ToastContainer/>
            <Wrapper>
                <div className='flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]'>
                    {/* left column start */}
                    <div className='w-full md:w-auto flex-[1.5] 
            max-w-[500px] lg:max-w-full first-letter 
            mx-auto lg:mx-0'
                    >
                        <ProductDetailsCarousel images={p.image.data} />
                    </div>
                    {/* left column End */}

                    {/* right column start */}
                    <div className='flex-[1] py-3'
                    >
                        {/* Product Titile */}
                        <div className='text-[34px] font-semibold mb-2 leading-tight'>
                            {p.name}
                        </div>
                        {/* Sub Title */}
                        <div className="text-lg font-semibold mb-5">
                            {p.subtitle}
                        </div>

                        {/* PRODUCT PRICE */}
                        <div className="flex items-center">
                            <p className="mr-2 text-lg font-semibold">
                                MRP : &#8377;{p.price}
                            </p>
                            {p.original_price && (
                                <>
                                    <p className="text-base  font-medium line-through">
                                        &#8377;{p.original_price}
                                    </p>
                                    <p className="ml-auto text-base font-medium text-green-500">
                                        {getDiscountedPercentage(
                                            p.original_price,
                                            p.price
                                        )}
                                        % off
                                    </p>
                                </>
                            )}
                        </div>
                        <div className='text-md font-medium text-black/[0.5]'>
                            incl. of taxes
                        </div>
                        <div className='text-md font-medium text-black/[0.5] mb-20'>
                            {`(Also includes all applicable duties)`}
                        </div>

                        {/* Product Size range start */}
                        <div className='mb-10'>
                            {/* Heading Start */}
                            <div className='flex justify-between mb-2'>
                                <div className=' text-md font-semibold '>
                                    Select Size
                                </div>
                                <div className='text-md font-medium text-black/[0.5] cursor-pointer'
                                >
                                    Select Guide
                                </div>
                            </div>
                            {/* Heading End */}

                            {/* Size Selection Start */}
                            <div className='grid grid-cols-3 gap-2' id='sizesGrid'>

                                {p.size.data.map((item, i) => (
                                    <div key={i} className={`border rounded-md text-center py-3
                             font-medium  ${item.enabled ? 'hover:border-black cursor-pointer':'cursor-not-allowed bg-black/[0.1] opacity-50'} ${selectedSize===item.size ? ' border-black':''}`}
                             onClick={()=>{
                                setSelectedSize(item.size)
                                setShowErr(false)
                             }}>
                                        {item.size}
                                    </div>

                                ))}

                            </div>
                            {/* Size Selection end */}

                            {/* Show Error Start */}
                            {showErr && <div className='text-red-600 mt-1'> Size selection is required</div>}
                            {/* Show Error End */}
                        </div>
                        {/* Product Size range end */}

                        {/* Add To Cart Button Start */}
                        <button className=' w-full py-4 rounded-full bg-black text-white
                         text-lg font-medium transition-transform active:scale-95 mb-3
                          hover:opacity-75'
                          onClick={()=>{
                            if(!selectedSize){

                                setShowErr(true);
                                document.getElementById("sizesGrid").scrollIntoView({
                                    block:"center",
                                    behavior:"smooth"
                                })
                            }else{
                                dispatch(addToCart({...product?.data?.[0],selectedSize,oneQuantityPrice:p.price}));
                                notify();
                            }
                            
                          }}>
                            Add to Cart
                        </button>
                        {/* Add To Cart Button End */}

                        {/* WishList Button Start */}
                        <button className='w-full py-4 rounded-full 
                        border border-black text-lg font-medium 
                        transition-transform active:scale-95 flex items-center justify-center gap-2
                        hover:opacity-75 mb-10'>
                            WishList

                            <IoMdHeartEmpty size={20} />
                        </button>
                        {/* WishList Button End */}

                        {/* Product Details Start */}
                        <div>
                            <div className='text-lg font-bold mb-5'>
                                Product Details
                            </div>

                            <div className=" text-md mb-5">

                                {p.description}

                            </div>
                        </div>
                        {/* Product Details End */}

                    </div>
                    {/* right column end */}
                </div>


                <RelatedProduct products={products}/>
            </Wrapper>
        </div>
    )
}

export default ProductDetails

export async function getStaticPaths() {
    const products = await fetchDataFromApi('/api/products?populate=*')

    const paths = products.data.map((p) => ({
        params: {
            slug: p.attributes.slug
        }
    }))

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params: { slug } }) {

    const product = await fetchDataFromApi(`/api/products?populate=*&filters[slug][$eq]=${slug}`)
    const products = await fetchDataFromApi(`/api/products?populate=*&[filters][slug][$ne]=${slug}`)
    return {
        props: {
            product,
            products
        }
    }

}