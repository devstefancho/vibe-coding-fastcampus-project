import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import { Category } from '@/types/budget';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category: Category = await request.json();
    const { id } = params;

    // ID 일치 확인
    if (category.id !== id) {
      return NextResponse.json({
        success: false,
        message: '카테고리 ID가 일치하지 않습니다.'
      }, { status: 400 });
    }

    // 필수 필드 검증
    if (!category.name || !category.type) {
      return NextResponse.json({
        success: false,
        message: '필수 필드가 누락되었습니다.'
      }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    const success = await sheetsService.updateCategory(category);

    if (success) {
      return NextResponse.json({
        success: true,
        message: '카테고리가 수정되었습니다.',
        data: category
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '카테고리 수정 중 오류가 발생했습니다.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({
      success: false,
      message: '카테고리 수정 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: '카테고리 ID가 필요합니다.'
      }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    const success = await sheetsService.deleteCategory(id);

    if (success) {
      return NextResponse.json({
        success: true,
        message: '카테고리가 삭제되었습니다.',
        deletedId: id
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '카테고리 삭제 중 오류가 발생했습니다.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({
      success: false,
      message: '카테고리 삭제 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}