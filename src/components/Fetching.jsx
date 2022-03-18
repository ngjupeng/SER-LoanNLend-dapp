import React from "react";

export default function Fetching() {
  return (
    <div className="mt-5">
      <div className="w-[70%] mb-4 h-3 md:h-6 rounded-full animate-pulse bg-gray-700"></div>
      <div className="w-[60%] mb-4 h-3 md:h-6 rounded-full animate-pulse bg-gray-700"></div>
      <div className="w-full h-3 md:h-6 rounded-full animate-pulse bg-gray-700"></div>
      <div className="flex w-full my-4 animate-pulse">
        <div className="w-[60%] mr-4 h-3 md:h-6 rounded-full bg-gray-700"></div>
        <div className="w-[40%] h-3 md:h-6 rounded-full bg-gray-700"></div>
      </div>
      <div className="w-40% h-3 md:h-6 rounded-full animate-pulse bg-gray-700"></div>
      <div className="my-4 w-[70%] mb-4 h-3 md:h-6 rounded-full animate-pulse bg-gray-700"></div>
      <div className="flex w-full mt-4 animate-pulse">
        <div className="w-[40%] mr-4 h-3 md:h-6 rounded-full bg-gray-700"></div>
        <div className="w-[60%] h-3 md:h-6 rounded-full bg-gray-700"></div>
      </div>
    </div>
  );
}
