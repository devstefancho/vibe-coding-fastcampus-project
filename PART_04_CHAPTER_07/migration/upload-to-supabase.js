require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 오류: .env 파일에 SUPABASE_URL과 SUPABASE_ANON_KEY를 설정해주세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 프로그레스 바 그리기 함수
function drawProgressBar(current, total, barLength = 50) {
  const percentage = Math.floor((current / total) * 100);
  const filledLength = Math.floor((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  process.stdout.write(`\r[${bar}] ${percentage}% (${current}/${total})`);
}

// 배치 업로드 함수
async function uploadInBatches(data, batchSize = 100) {
  const totalBatches = Math.ceil(data.length / batchSize);
  let uploadedCount = 0;
  const errors = [];

  console.log(`📤 업로드 시작 (배치 크기: ${batchSize})\n`);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, data.length);
    const batch = data.slice(start, end);

    try {
      const { error } = await supabase
        .from('quotes')
        .insert(batch);

      if (error) {
        errors.push({ batch: i + 1, error: error.message });
        console.error(`\n❌ 배치 ${i + 1} 업로드 실패:`, error.message);
      } else {
        uploadedCount += batch.length;
      }
    } catch (err) {
      errors.push({ batch: i + 1, error: err.message });
      console.error(`\n❌ 배치 ${i + 1} 업로드 중 예외 발생:`, err.message);
    }

    drawProgressBar(uploadedCount, data.length);
  }

  console.log('\n');
  return { uploadedCount, errors };
}

// 메인 실행 함수
async function main() {
  console.log('🚀 Supabase 명언 데이터 업로드 시작\n');

  // quotes.json 파일 읽기 (상위 디렉토리)
  const quotesPath = path.join(__dirname, '..', 'quotes.json');

  if (!fs.existsSync(quotesPath)) {
    console.error('❌ 오류: quotes.json 파일을 찾을 수 없습니다.');
    console.error(`   경로: ${quotesPath}`);
    process.exit(1);
  }

  const quotesData = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));
  console.log(`📋 총 ${quotesData.length}개의 명언을 발견했습니다.\n`);

  // 테이블 존재 확인
  console.log('📋 테이블 확인 중...');
  const { data: existingData, error: checkError } = await supabase
    .from('quotes')
    .select('count')
    .limit(1);

  if (checkError) {
    console.error('❌ 오류: quotes 테이블에 접근할 수 없습니다.');
    console.error('   ', checkError.message);
    process.exit(1);
  }

  console.log('✅ quotes 테이블이 존재합니다.\n');

  // 기존 데이터 확인
  const { count: existingCount } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true });

  if (existingCount > 0) {
    console.log(`⚠️  경고: 테이블에 이미 ${existingCount}개의 데이터가 있습니다.`);
    console.log('   계속 진행하면 중복 데이터가 추가될 수 있습니다.\n');
  }

  // 업로드 시작
  const { uploadedCount, errors } = await uploadInBatches(quotesData);

  // 결과 요약
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 업로드 결과 요약');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ 성공: ${uploadedCount}개`);
  console.log(`❌ 실패: ${quotesData.length - uploadedCount}개`);

  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length}개 배치에서 오류 발생:`);
    errors.forEach(({ batch, error }) => {
      console.log(`   - 배치 ${batch}: ${error}`);
    });
  } else {
    console.log('\n🎉 모든 데이터가 성공적으로 업로드되었습니다!');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// 실행
main().catch((error) => {
  console.error('\n❌ 치명적 오류:', error);
  process.exit(1);
});
