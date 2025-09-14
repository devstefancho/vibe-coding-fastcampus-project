-- ====================================
-- 1단계: 사용자 프로필 테이블 생성
-- ====================================
-- 'profiles' 테이블을 만듭니다. 이미 존재하면 무시합니다.
-- 이 테이블은 로그인한 사용자의 개인정보(이름, 전화번호, 주소)를 저장합니다.
CREATE TABLE IF NOT EXISTS public.profiles (
    -- id: 각 사용자를 구분하는 고유 식별자 (UUID 형태)
    -- auth.users(id)와 연결되어 사용자가 삭제되면 프로필도 함께 삭제됩니다
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- name: 사용자 이름을 저장하는 텍스트 필드
    name TEXT,

    -- phone: 사용자 전화번호를 저장하는 텍스트 필드
    phone TEXT,

    -- address: 사용자 주소를 저장하는 텍스트 필드
    address TEXT,

    -- created_at: 프로필이 생성된 날짜와 시간 (자동으로 현재 시간 설정)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- updated_at: 프로필이 마지막으로 수정된 날짜와 시간 (자동으로 현재 시간 설정)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- id를 기본 키(Primary Key)로 설정
    PRIMARY KEY (id)
);

-- ====================================
-- 2단계: 행 수준 보안(RLS) 활성화
-- ====================================
-- 각 사용자가 오직 자신의 프로필만 볼 수 있도록 보안 설정을 활성화합니다.
-- 이렇게 하면 다른 사용자의 프로필 정보를 볼 수 없습니다.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ====================================
-- 3단계: 보안 정책 생성
-- ====================================
-- 정책 1: 사용자는 자신의 프로필만 조회할 수 있습니다
-- SELECT(조회) 작업 시 현재 로그인한 사용자의 ID와 프로필의 ID가 같을 때만 허용
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- 정책 2: 사용자는 자신의 프로필만 생성할 수 있습니다
-- INSERT(생성) 작업 시 현재 로그인한 사용자의 ID와 생성하려는 프로필의 ID가 같을 때만 허용
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 정책 3: 사용자는 자신의 프로필만 수정할 수 있습니다
-- UPDATE(수정) 작업 시 현재 로그인한 사용자의 ID와 수정하려는 프로필의 ID가 같을 때만 허용
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ====================================
-- 4단계: 자동 업데이트 시간 관리 함수 생성
-- ====================================
-- 프로필이 수정될 때마다 updated_at 필드를 현재 시간으로 자동 업데이트하는 함수를 만듭니다.
-- 이 함수는 프로필이 언제 마지막으로 수정되었는지 추적하는데 사용됩니다.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- 수정되는 행의 updated_at 필드를 현재 시간(UTC)으로 설정
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 5단계: 자동 업데이트 시간 트리거 생성
-- ====================================
-- profiles 테이블의 데이터가 수정되기 전에 위에서 만든 함수를 자동으로 실행하는 트리거를 생성합니다.
-- 이렇게 하면 사용자가 프로필을 수정할 때마다 updated_at이 자동으로 현재 시간으로 변경됩니다.
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================
-- 6단계: 신규 사용자 프로필 자동 생성 함수
-- ====================================
-- 새로운 사용자가 회원가입할 때 자동으로 프로필 레코드를 생성하는 함수를 만듭니다.
-- 카카오 로그인 시 받아온 이름 정보를 프로필에 자동으로 저장합니다.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 새로 가입한 사용자의 ID와 카카오에서 받아온 이름으로 프로필 레코드 생성
    -- NEW.raw_user_meta_data->>'name'은 카카오 로그인 시 받아온 사용자 이름
    INSERT INTO public.profiles (id, name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- 7단계: 신규 사용자 프로필 자동 생성 트리거
-- ====================================
-- auth.users 테이블에 새로운 사용자가 추가된 후 위에서 만든 함수를 자동으로 실행하는 트리거를 생성합니다.
-- 이렇게 하면 사용자가 처음 로그인할 때 자동으로 빈 프로필이 생성됩니다.
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();