-- MyBestShoesShop 좋아요 기능을 위한 테이블 생성
-- 이 파일은 Supabase SQL 에디터에서 실행해야 합니다.

-- 좋아요 테이블 생성
-- 사용자가 어떤 상품을 좋아요했는지 기록하는 테이블입니다.
CREATE TABLE IF NOT EXISTS public.likes (
    -- 좋아요 고유 ID (자동 증가)
    id BIGSERIAL PRIMARY KEY,

    -- 사용자 ID (auth.users 테이블과 연결)
    -- 어떤 사용자가 좋아요를 눌렀는지 저장
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- 상품 ID (문자열로 저장, products 데이터와 매칭)
    -- 어떤 상품을 좋아요했는지 저장
    product_id TEXT NOT NULL,

    -- 좋아요를 누른 날짜와 시간
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스 생성 (검색 성능 향상)
-- 사용자별 좋아요 목록을 빠르게 조회하기 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);

-- 상품별 좋아요 수를 빠르게 조회하기 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_likes_product_id ON public.likes(product_id);

-- 유니크 제약조건 생성
-- 한 사용자가 같은 상품에 중복으로 좋아요를 누를 수 없도록 제한
ALTER TABLE public.likes
ADD CONSTRAINT unique_user_product_like
UNIQUE (user_id, product_id);

-- RLS (Row Level Security) 활성화
-- 데이터 보안을 위해 행 수준 보안을 설정합니다.
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성

-- 1. 조회 정책: 모든 사용자가 좋아요 데이터를 조회할 수 있음
-- (상품별 좋아요 수 표시를 위해 필요)
CREATE POLICY "Anyone can view likes" ON public.likes
    FOR SELECT USING (true);

-- 2. 삽입 정책: 로그인한 사용자만 자신의 좋아요 데이터를 추가할 수 있음
CREATE POLICY "Users can insert their own likes" ON public.likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. 삭제 정책: 로그인한 사용자만 자신의 좋아요 데이터를 삭제할 수 있음
CREATE POLICY "Users can delete their own likes" ON public.likes
    FOR DELETE USING (auth.uid() = user_id);

-- 자동 타임스탬프 업데이트 함수 생성
-- created_at은 자동으로 설정되므로 추가 함수는 불필요

-- 완료 메시지
-- SQL 실행이 성공하면 아래 메시지가 표시됩니다.
DO $$
BEGIN
    RAISE NOTICE 'MyBestShoesShop 좋아요 테이블이 성공적으로 생성되었습니다!';
    RAISE NOTICE '다음 단계:';
    RAISE NOTICE '1. 프론트엔드에서 좋아요 기능을 구현하세요';
    RAISE NOTICE '2. 테스트 데이터를 추가하여 정상 작동을 확인하세요';
END $$;