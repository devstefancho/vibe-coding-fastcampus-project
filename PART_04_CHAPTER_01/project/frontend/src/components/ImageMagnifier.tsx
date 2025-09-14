'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  zoomLevel?: number;
  zoomAreaSize?: number;
  className?: string;
}

export default function ImageMagnifier({
  src,
  alt,
  zoomLevel = 2.5,
  zoomAreaSize = 400,
  className = ''
}: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  // 컴포넌트 마운트 시 이미지 완료 상태 확인
  useEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.complete && imageRef.current.naturalHeight !== 0) {
        setImageLoaded(true);
        setImageError(false);
      }
    }
  }, [src]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleMouseEnter = () => {
    if (imageLoaded) {
      setShowMagnifier(true);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || !imageLoaded) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 마우스가 이미지 범위 내에 있는지 확인
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      setShowMagnifier(false);
      return;
    }

    // 이미지 내부에서의 상대적 위치 (0~1)
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    // 마우스 위치 저장 (인디케이터용)
    setMousePosition({ x, y });

    // 확대 영역의 배경 위치 계산
    const imageX = relativeX * imageRef.current.naturalWidth * zoomLevel - zoomAreaSize / 2;
    const imageY = relativeY * imageRef.current.naturalHeight * zoomLevel - zoomAreaSize / 2;

    setImagePosition({ x: imageX, y: imageY });
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* 원본 이미지 섹션 */}
      <div className="relative">
        {/* 이미지 */}
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={`w-full h-auto rounded-lg shadow-lg transition-all duration-300 ${imageLoaded ? 'opacity-100 cursor-crosshair' : 'opacity-0 cursor-default'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          draggable={false}
        />

        {/* 마우스 위치 인디케이터 */}
        {showMagnifier && imageLoaded && (
          <div
            className="absolute border-2 border-white shadow-lg pointer-events-none"
            style={{
              left: `${mousePosition.x - 50}px`,
              top: `${mousePosition.y - 50}px`,
              width: '100px',
              height: '100px',
            }}
          />
        )}

        {/* 로딩 상태 표시 */}
        {!imageLoaded && !imageError && (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">이미지 로딩 중...</span>
          </div>
        )}

        {/* 에러 상태 표시 */}
        {imageError && (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
            <div className="text-gray-500 mb-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 14.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">이미지를 불러올 수 없습니다</p>
            <p className="text-xs text-gray-500 mt-1">{src}</p>
          </div>
        )}
      </div>

      {/* 확대 영역 섹션 */}
      <div className="flex flex-col">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800">확대된 이미지</h3>
          <p className="text-sm text-gray-500">마우스를 왼쪽 이미지 위에 올려보세요</p>
        </div>

        <div
          className="rounded-lg border-2 border-gray-200 flex items-center justify-center"
          style={{
            width: `${zoomAreaSize}px`,
            height: `${zoomAreaSize}px`,
            maxWidth: '100%',
            aspectRatio: '1',
          }}
        >
          {!showMagnifier ? (
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>이미지에 마우스를<br />올려 확대해보세요</p>
            </div>
          ) : (
            <div
              className="w-full h-full rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: `${(imageRef.current?.naturalWidth || 0) * zoomLevel}px ${(imageRef.current?.naturalHeight || 0) * zoomLevel}px`,
                backgroundPosition: `-${imagePosition.x}px -${imagePosition.y}px`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>

        {/* 확대 정보 */}
        {showMagnifier && (
          <div className="mt-2 text-sm text-gray-600">
            <p>확대 배율: {zoomLevel}x</p>
          </div>
        )}
      </div>
    </div>
  );
}