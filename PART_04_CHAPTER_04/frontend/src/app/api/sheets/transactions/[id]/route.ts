import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import { Transaction } from '@/types/budget';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction: Transaction = await request.json();
    const { id } = params;

    // ID 일치 확인
    if (transaction.id !== id) {
      return NextResponse.json({
        success: false,
        message: '거래 ID가 일치하지 않습니다.'
      }, { status: 400 });
    }

    // 필수 필드 검증
    if (!transaction.date || !transaction.type || !transaction.amount || !transaction.categoryId) {
      return NextResponse.json({
        success: false,
        message: '필수 필드가 누락되었습니다.'
      }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    const success = await sheetsService.updateTransaction(transaction);

    if (success) {
      return NextResponse.json({
        success: true,
        message: '거래가 수정되었습니다.',
        data: transaction
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '거래 수정 중 오류가 발생했습니다.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Update transaction error:', error);
    return NextResponse.json({
      success: false,
      message: '거래 수정 중 오류가 발생했습니다.',
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
        message: '거래 ID가 필요합니다.'
      }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    const success = await sheetsService.deleteTransaction(id);

    if (success) {
      return NextResponse.json({
        success: true,
        message: '거래가 삭제되었습니다.',
        deletedId: id
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '거래 삭제 중 오류가 발생했습니다.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Delete transaction error:', error);
    return NextResponse.json({
      success: false,
      message: '거래 삭제 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}