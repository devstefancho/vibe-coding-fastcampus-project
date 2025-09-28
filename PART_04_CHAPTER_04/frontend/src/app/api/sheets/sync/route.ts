import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import { Transaction, Category } from '@/types/budget';

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();

    // Google Sheets에서 데이터 가져오기
    const [transactions, categories, lastSyncAt] = await Promise.all([
      sheetsService.getTransactions(),
      sheetsService.getCategories(),
      sheetsService.getMeta('lastSyncAt')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        categories,
        lastSyncAt: lastSyncAt || new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Sync GET error:', error);
    return NextResponse.json({
      success: false,
      message: '데이터 가져오기 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { transactions, categories } = await request.json();

    if (!Array.isArray(transactions) || !Array.isArray(categories)) {
      return NextResponse.json({
        success: false,
        message: '잘못된 데이터 형식입니다.'
      }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();

    // 로컬 데이터를 Google Sheets에 동기화
    const syncSuccess = await sheetsService.syncToSheets(
      transactions as Transaction[],
      categories as Category[]
    );

    if (syncSuccess) {
      return NextResponse.json({
        success: true,
        message: '데이터 동기화가 완료되었습니다.',
        syncedAt: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '데이터 동기화 중 오류가 발생했습니다.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Sync POST error:', error);
    return NextResponse.json({
      success: false,
      message: '데이터 동기화 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}