import React from "react";
import ReviewBar from "@/app/components/ReviewBar";
import Image from "next/image";
import line from "../../../public/line.svg";
import mylogo from "../../../public/logo_white.png";
import { listReviews } from "@/lib/content/reviews";

const SideView = async () => {
  const reviews = await listReviews();

  return (
    <div className='left flex-3 md:flex hidden gradientbg rounded-sm px-4 flex  flex-col py-4 justify-between items-center h-full'>
      <div className='titleText px-4 pt-4'>
        <Image src={mylogo} alt='Logo' width={80} />
        <h3 className='mt-4 text-white font-bold text-3xl  font-noto text-left leading-relaxed'>
          Recap the topic.
        </h3>
        <div className='flex items-start gap-2 flex-col text-3xl'>
          <h3 className='text-[#6AF1F1]   font-noto font-bold '>
            Then <span className='text-white'>sit the exam.</span>
          </h3>

          <Image
            src={line}
            className='text-center ml-4 mb-4'
            alt='line'
            width={120}
          />
        </div>

        <p className='fonts-noto text-white text-[14px] font-normal text-left'>
          CertifyHub is an exam preparation platform, not a training course.
          Each track starts with a short recap of the topic, then videos on the
          key concepts examiners actually test. You finish by practising sample
          questions written in the same format — and under the same conditions —
          as the real professional exam.
        </p>
      </div>
      <ReviewBar reviews={reviews} />
    </div>
  );
};

export default SideView;
