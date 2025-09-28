import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();

    // Google Sheets 구조 초기화
    const success = await sheetsService.initializeSheets();

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Google Sheets 구조가 성공적으로 초기화되었습니다.',
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Google Sheets 구조 초기화에 실패했습니다.',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Google Sheets 초기화 API 오류:', error);
    return NextResponse.json({
      success: false,
      message: 'Google Sheets 초기화 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}