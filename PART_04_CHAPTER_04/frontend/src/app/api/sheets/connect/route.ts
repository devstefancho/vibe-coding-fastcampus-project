import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();
    const isConnected = await sheetsService.testConnection();

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Google Sheets 연결 성공',
        connected: true
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Google Sheets 연결 실패',
        connected: false
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Google Sheets 연결 중 오류가 발생했습니다.',
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}