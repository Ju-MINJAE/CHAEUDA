'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';

interface ImagesProps {
  images: string[];
  video: string | null;
}

export const Images = ({ images, video }: ImagesProps) => {
  return (
    <div className="relative w-full h-[400px] bg-gray-100">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        className="h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
        {video && (
          <SwiperSlide>
            <div className="relative w-full h-full">
              <video src={video} controls className="w-full h-full object-contain bg-black" />
            </div>
          </SwiperSlide>
        )}

        <button className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70">
          <span className="sr-only">Previous</span>←
        </button>
        <button className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70">
          <span className="sr-only">Next</span>→
        </button>
        <div className="swiper-pagination absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, index) => (
            <span key={index} className="w-2 h-2 rounded-full bg-white/50 cursor-pointer" />
          ))}
        </div>
      </Swiper>
    </div>
  );
};
