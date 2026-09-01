import React from "react";
import ReviewBar from "@/app/components/ReviewBar";
import Image from "next/image";
import line from "../../../public/line.svg";
import mylogo from "../../../public/logo_white.png";
const SideView = () => {
  return (
    <div className='left flex-3 md:flex hidden gradientbg rounded-sm px-4 flex  flex-col py-4 justify-between items-center h-full'>
      <div className='titleText px-4 pt-4'>
        <Image src={mylogo} alt='Logo' width={80} />
        <h3 className='mt-4 text-white font-bold text-3xl  font-noto text-left leading-relaxed'>
          Bootstrap your
        </h3>
        <div className='flex items-start gap-2 flex-col text-3xl'>
          <h3 className='text-[#6AF1F1]   font-noto font-bold '>
            Trainings <span className='text-white'> Real Time</span>
          </h3>

          <Image
            src={line}
            className='text-center ml-4 mb-4'
            alt='line'
            width={120}
          />
        </div>

        <p className='fonts-noto text-white text-[14px] font-normal text-left'>
          Learn from expertly curated content that keeps pace with the latest
          industry trends and technological advancements. Our interactive
          learning environment allows you to study at your own pace while
          building confidence through hands-on practice. Join thousands of
          learners worldwide who have already transformed their careers by
          becoming certified professionals through mycertifyhub.
        </p>
      </div>
      <ReviewBar />
    </div>
  );
};

export default SideView;
