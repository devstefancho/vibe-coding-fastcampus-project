#!/usr/bin/env python3
"""
허깅페이스에서 Quotes-500K 데이터셋을 다운로드하고 1000개를 랜덤 샘플링하는 스크립트
"""

import json
import random
from datasets import load_dataset

def main():
    print("🚀 허깅페이스에서 Quotes-500K 데이터셋 다운로드 시작...")

    # 데이터셋 로드
    try:
        dataset = load_dataset("jstet/quotes-500k", split="train")
        print(f"✅ 데이터셋 로드 완료: 총 {len(dataset)}개의 명언")
    except Exception as e:
        print(f"❌ 데이터셋 로드 실패: {e}")
        return

    # 1000개 랜덤 샘플링
    print("\n📊 1000개 랜덤 샘플링 중...")
    total_quotes = len(dataset)

    # 랜덤 인덱스 생성
    random.seed(42)  # 재현성을 위한 시드 설정
    sample_indices = random.sample(range(total_quotes), min(1000, total_quotes))

    # 샘플링된 데이터 추출
    sampled_quotes = []
    for idx in sample_indices:
        quote_data = dataset[idx]
        sampled_quotes.append({
            "quote": quote_data["quote"],
            "author": quote_data["author"],
            "category": quote_data["category"]
        })

    print(f"✅ {len(sampled_quotes)}개 샘플링 완료")

    # JSON 파일로 저장
    output_file = "quotes-1000.json"
    print(f"\n💾 {output_file}에 저장 중...")

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(sampled_quotes, f, ensure_ascii=False, indent=2)
        print(f"✅ {output_file} 저장 완료!")

        # 샘플 데이터 출력
        print(f"\n📖 샘플 데이터 (처음 3개):")
        for i, quote in enumerate(sampled_quotes[:3], 1):
            print(f"\n{i}. {quote['quote'][:100]}...")
            print(f"   - 작가: {quote['author']}")
            print(f"   - 카테고리: {quote['category']}")

    except Exception as e:
        print(f"❌ 파일 저장 실패: {e}")
        return

    print(f"\n🎉 작업 완료! {output_file} 파일이 생성되었습니다.")

if __name__ == "__main__":
    main()
