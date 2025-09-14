export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ShoeMall</h3>
            <p className="text-gray-300 text-sm">
              최고의 신발을 합리적인 가격에 제공하는 온라인 쇼핑몰입니다.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">고객 서비스</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">고객센터</a></li>
              <li><a href="#" className="hover:text-white">배송 조회</a></li>
              <li><a href="#" className="hover:text-white">반품/교환</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">정보</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">회사소개</a></li>
              <li><a href="#" className="hover:text-white">이용약관</a></li>
              <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-white">매장찾기</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📞 1588-1234</li>
              <li>📧 info@shoemall.co.kr</li>
              <li>🏢 서울특별시 강남구 테헤란로 123</li>
              <li>🕐 평일 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 ShoeMall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}