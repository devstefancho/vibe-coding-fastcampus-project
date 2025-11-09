import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
    }

    fetchProducts();
  }, []);

  // Distribute products across 3 posts (3, 2, 4 products each)
  const post1Products = products.slice(0, 3);
  const post2Products = products.slice(3, 5);
  const post3Products = products.slice(5, 9);

  return (
    <div className="home">
      <header className="site-header">
        <h1>노트의 미학</h1>
        <p className="subtitle">필기가 만드는 차이, 과학이 증명하다</p>
      </header>

      <main className="content">
        {/* Post 1 */}
        <article className="blog-post">
          <h2>필기는 뇌를 깨운다</h2>
          <p className="post-subtitle">핸드라이팅의 인지과학</p>

          <div className="post-content">
            <p>
              디지털 시대에도 손으로 쓰는 행위는 여전히 중요합니다. 노르웨이 과학기술대학교(NTNU)의 2020년 연구에 따르면,
              손글씨는 키보드 타이핑보다 뇌의 더 많은 영역을 활성화시킵니다. 특히 감각운동 피질과 해마가 활발하게 작동하면서
              학습과 기억 형성에 결정적인 역할을 합니다.
            </p>
            <p>
              필기할 때 우리 뇌는 단순히 글자를 베끼는 것이 아니라 정보를 재구성합니다. 프린스턴대학교와 UCLA의 공동 연구팀은
              노트북으로 받아쓰는 학생들보다 손으로 필기하는 학생들이 개념적 이해도가 훨씬 높다는 것을 발견했습니다.
              손글씨는 우리가 정보를 자신의 언어로 번역하도록 강제하기 때문입니다.
            </p>

            <p className="partners-notice">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>

            <div className="product-grid">
              {post1Products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <p>
              뇌 영상 연구에서는 필기 시 전두엽 피질의 활성도가 증가하며, 이는 고차원적 사고와 문제 해결 능력과 직접 연관됩니다.
              손끝의 미세한 움직임이 만드는 감각 피드백은 뇌에 풍부한 정보를 제공하고, 이것이 곧 더 깊은 학습으로 이어집니다.
            </p>
            <p>
              경영학과 3학년 준영씨는 전공 과목의 방대한 개념들을 인덱스 노트로 정리하기 시작했습니다.
              각 주제를 인덱스로 구분하자 복잡한 이론들이 머릿속에서 체계적으로 정리되었고,
              중간고사 성적은 전 학기보다 한 등급 상승했습니다. IT 기업에 다니는 민지님은
              하드커버 크라프트 노트를 회의 전용으로 사용합니다. 견고한 표지 덕분에 이동 중에도
              메모가 가능하고, 자연스러운 크라프트 색감이 오히려 집중력을 높여줍니다.
              50대 중반의 영어 학습자 현수님은 넓은 칸 노트를 선택했습니다.
              여유로운 줄 간격 덕분에 단어와 예문을 시각적으로 구분할 수 있었고,
              "그 단어가 페이지 왼쪽 위에 있었다"는 공간 기억이 암기에 큰 도움이 되었습니다.
            </p>
            <p>
              단순해 보이는 펜과 종이의 조합이 실은 가장 강력한 인지 도구인 셈입니다.
            </p>
          </div>
        </article>

        {/* Post 2 */}
        <article className="blog-post">
          <h2>더 오래 기억하다</h2>
          <p className="post-subtitle">기억력 보유와 학습 효과</p>

          <div className="post-content">
            <p>
              기억은 단순히 정보를 저장하는 것이 아니라 인출 가능성의 문제입니다. 인디애나 대학교의 신경과학 연구에 따르면,
              손으로 쓴 정보는 타이핑한 정보보다 장기 기억으로 전환될 확률이 34% 더 높습니다. 이는 필기 과정에서 발생하는
              다중 감각 통합 덕분입니다.
            </p>
            <p>
              에빙하우스의 망각곡선 이론을 적용한 최근 연구는 더욱 흥미로운 결과를 보여줍니다. 필기 노트를 복습하는 학습자는
              디지털 노트 사용자보다 일주일 후 정보 보유율이 평균 28% 더 높았습니다. 손글씨의 물리적 궤적이 시각적 단서로
              작용하여 기억 인출을 돕기 때문입니다.
            </p>

            <p className="partners-notice">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>

            <div className="product-grid">
              {post2Products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <p>
              도쿄대학교의 2021년 연구는 종이 노트가 디지털 노트보다 뇌의 해마와 전두엽 피질 사이의 연결성을 더 강화한다고
              밝혔습니다. 이 신경망 강화는 장기 기억 형성의 핵심 메커니즘입니다.
            </p>
            <p>
              건축학과 2학년 서진씨는 A1 대형 노트에 건축 스케치를 그립니다.
              큰 캔버스는 디테일을 놓치지 않게 해주고, 손으로 그린 선 하나하나가
              시각적 기억으로 새겨져 설계 이론 시험에서도 머릿속에 이미지가 떠오릅니다.
              공무원 시험을 준비하는 혜진씨는 정돈된 라인 노트를 선택했습니다.
              일정한 줄 간격이 주는 시각적 안정감은 복잡한 법조문을 암기하는 데 도움이 되었고,
              3개월 만에 핵심 조문 200개를 완벽히 외울 수 있었습니다.
              복습할 때마다 같은 위치에서 같은 내용을 보니, 마치 책의 한 페이지가
              사진처럼 뇌에 저장되는 느낌이었습니다.
            </p>
            <p>
              필기는 공간 기억을 활성화시켜 "그 내용이 페이지 왼쪽 상단에 있었다"는 식의
              위치 기반 회상을 가능하게 합니다. 결국 손으로 쓴다는 것은
              기억의 여러 층위에 정보를 각인하는 행위입니다.
            </p>
          </div>
        </article>

        {/* Post 3 */}
        <article className="blog-post">
          <h2>창의력의 공간</h2>
          <p className="post-subtitle">창의적 사고와 문제해결</p>

          <div className="post-content">
            <p>
              노트는 단순한 기록 도구를 넘어 사고의 실험실입니다. 캠브리지 대학교의 인지심리학 연구에 따르면,
              자유로운 형식의 손글씨 노트는 발산적 사고(divergent thinking)를 촉진하여 창의적 문제 해결 능력을
              23% 향상시킵니다. 구조화되지 않은 종이 위에서 우리의 생각은 예상치 못한 방향으로 흐를 수 있습니다.
            </p>
            <p>
              다이어그램, 화살표, 낙서까지 포함하는 비선형적 필기는 뇌의 우반구와 좌반구를 동시에 활성화시킵니다.
              MIT 미디어랩의 연구자들은 손으로 그린 마인드맵이 디지털 도구로 만든 것보다 아이디어 간 연결성을
              발견하는 데 40% 더 효과적이라고 보고했습니다. 손의 자유로운 움직임이 사고의 자유로움을 반영하기 때문입니다.
            </p>

            <p className="partners-notice">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>

            <div className="product-grid">
              {post3Products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <p>
              스탠퍼드 대학교의 디자인 씽킹 연구소는 혁신적인 아이디어의 70% 이상이 손글씨 브레인스토밍 세션에서
              나온다고 밝혔습니다.
            </p>
            <p>
              UX 디자이너 은지님은 프로젝트별로 색상을 달리한 캠퍼스 노트를 사용합니다.
              블랙은 와이어프레임, 네이비는 사용자 리서치, 머스타드는 아이디어 스케치,
              그린은 회의록으로 구분하니 창의적 사고가 자연스럽게 확장되었습니다.
              SF 소설을 쓰는 작가 준호씨는 하드커버 캠퍼스 노트를 항상 가방에 넣고 다닙니다.
              카페에서도, 지하철에서도 견고한 표지 덕분에 떠오르는 아이디어를 즉시 기록할 수 있고,
              이렇게 모인 단상들이 나중에 소설의 핵심 플롯이 됩니다.
            </p>
            <p>
              초등학교 교사 수민님은 Oxford 크라프트 A4 노트에 학기 계획을 세웁니다.
              넓은 공간에 마인드맵을 그리며 교과 과정의 연결고리를 발견하고,
              학생들을 위한 창의적인 수업 아이디어가 샘솟습니다.
              기계 엔지니어 태영씨는 3mm 그리드 노트를 애용합니다.
              정확한 격자 덕분에 회로도와 구조 다이어그램을 자유롭게 그릴 수 있고,
              손으로 그리는 과정에서 설계의 문제점을 발견하는 경우가 많습니다.
              디지털 툴로는 느끼지 못했던 직관이 그리드 위에서 깨어납니다.
            </p>
            <p>
              종이 노트는 삭제와 수정이 어렵기에 오히려 모든 생각을 보존하게 만들고,
              나중에 버려진 아이디어에서 새로운 통찰을 얻을 수 있게 합니다. 또한 필기의 느린 속도는
              각 생각을 음미하고 정제할 시간을 줍니다. 창의성은 속도가 아니라 깊이에서 나옵니다.
            </p>
            <p>
              노트 필기는 단순한 습관이 아니라 두뇌를 훈련하는 과학적 방법입니다. 디지털 도구가 편리함을 제공한다면,
              펜과 종이는 깊이를 선물합니다. 오늘부터 노트를 들고 생각을 써보세요. 당신의 뇌가 깨어나는 것을 느낄 수 있을 것입니다.
            </p>
          </div>
        </article>
      </main>

      <footer className="site-footer">
        <p className="disclosure">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
        <p className="copyright">© 2025 노트의 미학. All rights reserved.</p>
      </footer>
    </div>
  );
}
