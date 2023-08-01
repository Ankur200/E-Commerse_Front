import { getDiscountedPercentage } from '@/utils/helper'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'




const ProductCard = ({data:{attributes : p,id}}) => {
  return (
    <Link href={`/product/${p.slug}`} className=" transform overflow-hidden bg-white duration-200 cursor-pointer hover:scale-105">
        
        <div className="p-4 text-black/[0.9]">
        <Image
          width={500}
          height={500}
          src={p.thumbnail.data.attributes.url}
          alt={p.name}
        />

            <h2 className='text-lg font-medium'>{p.name}</h2>
            <div className='flex items-center text-black/[0.5]'>
                <p className=' mr-2 text-lg font-semibold'>&#8377;{p.price}</p>
               {p.original_price && (
                <>
                <p className='text-base font-medium line-through'> &#8377;{p.original_price}</p>
                <p className=' ml-auto text-base font-medium text-green-500'>%{getDiscountedPercentage(p.original_price,p.price)}</p>
                </>
               )}
                

            </div>

        </div>
    </Link>
  )
}

export default ProductCard