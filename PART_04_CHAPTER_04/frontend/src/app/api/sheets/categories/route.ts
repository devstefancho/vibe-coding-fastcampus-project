import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import { Category } from '@/types/budget';

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();
    const categories = await sheetsService.getCategories();

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({
      success: false,
      message: '카테고리 데이터를 가져오는 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const category: Category = await request.json();

    // 필수 필드 검증
    if (!category.id || !category.name || !category.type) {
      return NextResponse.json({
        success: false,
        message: '필수 필드가 누락되었습니다.'
      }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    const success = await sheetsService.addCategory(category);

    if (success) {
      return NextResponse.json({
        success: true,
        message: '카테고리가 추가되었습니다.',
        data: category
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '카테고리 추가 중 오류가 발생했습니다.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Add category error:', error);
    return NextResponse.json({
      success: false,
      message: '카테고리 추가 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}