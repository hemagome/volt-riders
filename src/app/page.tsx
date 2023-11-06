import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const slides = [{ url: "/Feas.jpg" }, { url: "/VoltRiders.webp" }];

  return (
    <div className="max-w-[1400px] h-[780px] w-full m-auto py-16 px-4 relative">
      <div
        style={{ backgroundImage: `url(${slides[0].url})` }}
        className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
      >
        <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <ChevronLeft size={30} />
        </div>
        <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <ChevronRight size={30} />
        </div>
      </div>
    </div>
  );
}
