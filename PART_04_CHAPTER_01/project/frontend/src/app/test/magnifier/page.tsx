'use client';

import ImageMagnifier from '@/components/ImageMagnifier';

export default function MagnifierTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            이미지 확대 기능 테스트
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            마우스를 이미지 위에 올려보세요. 해당 부분이 확대되어 보입니다.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 제품 정보 섹션 */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nike 운동화 샘플
            </h2>
            <p className="text-gray-600 mb-6">
              고품질 운동화로 편안함과 스타일을 모두 제공합니다. 마우스를 이미지 위에 올려 세부사항을 확인해보세요.
            </p>
            <div className="flex justify-center items-center mb-6">
              <span className="text-3xl font-bold text-blue-600">₩129,000</span>
              <span className="text-xl text-gray-500 line-through ml-3">₩159,000</span>
              <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full ml-3">19% OFF</span>
            </div>
          </div>

          {/* 이미지 확대 기능 */}
          <ImageMagnifier
            src="/nike-sample.png"
            alt="Nike 운동화 샘플"
            zoomLevel={2.5}
            zoomAreaSize={350}
          />

          {/* 제품 상세 정보 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">주요 특징</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  통기성 뛰어난 메쉬 소재
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  쿠셔닝 미드솔로 편안한 착용감
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  내구성 있는 고무 아웃솔
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  세련된 디자인으로 일상 착용 가능
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">확대 기능 사용법</h3>
              <ol className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  마우스를 왼쪽 이미지 위에 올려보세요
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  확대하고 싶은 부분에 마우스를 이동하세요
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  오른쪽에서 세부 디테일을 확인하세요
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              장바구니에 담기
            </button>
          </div>
        </div>

        {/* 추가 예시 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-center">기본 확대 (2배)</h3>
            <ImageMagnifier
              src="/nike-sample.png"
              alt="Nike 운동화 - 기본 확대"
              zoomLevel={2}
              zoomAreaSize={200}
            />
            <div className="mt-3 text-center text-xs text-gray-500">
              영역: 200px | 확대: 2배
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-center">중간 확대 (2.5배)</h3>
            <ImageMagnifier
              src="/nike-sample.png"
              alt="Nike 운동화 - 중간 확대"
              zoomLevel={2.5}
              zoomAreaSize={220}
            />
            <div className="mt-3 text-center text-xs text-gray-500">
              영역: 220px | 확대: 2.5배
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-center">고배율 확대 (3배)</h3>
            <ImageMagnifier
              src="/nike-sample.png"
              alt="Nike 운동화 - 고배율 확대"
              zoomLevel={3}
              zoomAreaSize={250}
            />
            <div className="mt-3 text-center text-xs text-gray-500">
              영역: 250px | 확대: 3배
            </div>
          </div>
        </div>

        {/* 설명 섹션 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">이미지 확대 기능 특징</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">고해상도 확대</h4>
              <p className="text-gray-600 text-sm">제품의 세밀한 디테일까지 선명하게 확인할 수 있습니다.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">빠른 반응</h4>
              <p className="text-gray-600 text-sm">마우스 움직임에 즉시 반응하여 부드러운 사용 경험을 제공합니다.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">반응형 디자인</h4>
              <p className="text-gray-600 text-sm">다양한 화면 크기에서 최적화된 사용자 경험을 제공합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}