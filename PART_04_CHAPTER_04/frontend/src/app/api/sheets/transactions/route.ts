import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import { Transaction } from '@/types/budget';

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();
    const transactions = await sheetsService.getTransactions();

    return NextResponse.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json({
      success: false,
      message: '거래 데이터를 가져오는 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const transaction: Transaction = await request.json();

    // 필수 필드 검증
    if (!transaction.id || !transaction.date || !transaction.type || !transaction.amount || !transaction.categoryId) {
      return NextResponse.json({
        success: false,
        message: '필수 필드가 누락되었습니다.'
      }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    const success = await sheetsService.addTransaction(transaction);

    if (success) {
      return NextResponse.json({
        success: true,
        message: '거래가 추가되었습니다.',
        data: transaction
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '거래 추가 중 오류가 발생했습니다.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Add transaction error:', error);
    return NextResponse.json({
      success: false,
      message: '거래 추가 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}