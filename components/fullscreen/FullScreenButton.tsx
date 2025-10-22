import { useState } from "react";

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  return (
    <button
      onClick={toggleFullScreen}
      className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
        isFullScreen
          ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
      }`}
    >
      <span className="text-sm sm:text-base">{isFullScreen ? "⤓" : "⤢"}</span>
      <span className="hidden sm:inline text-xs sm:text-sm">
        {isFullScreen ? "전체화면 종료" : "전체화면"}
      </span>
    </button>
  );
};

export default FullScreenButton;
