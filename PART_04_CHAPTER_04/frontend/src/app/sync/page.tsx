'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SyncMeta } from '@/types/budget';
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Cloud,
  Settings,
  ExternalLink
} from 'lucide-react';

export default function SyncPage() {
  const [syncMeta, setSyncMeta] = useState<SyncMeta>({
    sheetId: '',
    lastSyncAt: '',
    pendingCount: 0,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');

  const handleConnect = async () => {
    if (!sheetUrl) {
      alert('Google Sheets URL을 입력해주세요.');
      return;
    }

    // 간단한 URL 형식 검증
    if (!sheetUrl.includes('docs.google.com/spreadsheets')) {
      alert('올바른 Google Sheets URL을 입력해주세요.');
      return;
    }

    // URL에서 Sheet ID 추출 (실제 구현에서는 더 정교한 파싱 필요)
    const sheetId = sheetUrl.split('/d/')[1]?.split('/')[0] || '';

    setSyncMeta({
      sheetId: sheetId,
      lastSyncAt: new Date().toISOString(),
      pendingCount: 3,
    });

    setIsConnected(true);
    alert('Google Sheets 연결이 완료되었습니다!');
  };

  const handleSync = async () => {
    if (!isConnected) {
      alert('먼저 Google Sheets를 연결해주세요.');
      return;
    }

    setIsSyncing(true);

    // 동기화 시뮬레이션
    setTimeout(() => {
      setSyncMeta(prev => ({
        ...prev,
        lastSyncAt: new Date().toISOString(),
        pendingCount: 0,
      }));
      setIsSyncing(false);
      alert('동기화가 완료되었습니다!');
    }, 2000);
  };

  const handleDisconnect = () => {
    if (confirm('Google Sheets 연결을 해제하시겠습니까?')) {
      setSyncMeta({
        sheetId: '',
        lastSyncAt: '',
        pendingCount: 0,
      });
      setIsConnected(false);
      setSheetUrl('');
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">동기화 설정</h1>
          <p className="text-gray-600 mt-2">Google Sheets와 데이터를 동기화하세요</p>
        </div>

        {/* 연결 상태 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">연결 상태</h2>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isConnected
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isConnected ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>연결됨</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <span>연결 안됨</span>
                </>
              )}
            </div>
          </div>

          {isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cloud className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Sheet ID</span>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">{syncMeta.sheetId}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">마지막 동기화</span>
                  </div>
                  <p className="text-xs text-gray-600">{formatDateTime(syncMeta.lastSyncAt)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">대기중인 변경사항</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{syncMeta.pendingCount}개</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? '동기화 중...' : '지금 동기화'}</span>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  연결 해제
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Google Sheets URL
                </label>
                <input
                  type="url"
                  id="sheetUrl"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleConnect}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Cloud className="h-4 w-4" />
                <span>Google Sheets 연결</span>
              </button>
            </div>
          )}
        </div>

        {/* 동기화 설명 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Settings className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">동기화 설정 방법</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>1단계:</strong> Google Sheets에서 새 스프레드시트를 생성하세요.</p>
                <p><strong>2단계:</strong> 스프레드시트 URL을 복사하여 위 입력란에 붙여넣으세요.</p>
                <p><strong>3단계:</strong> '연결' 버튼을 클릭하면 자동으로 시트 구조가 설정됩니다.</p>
                <p><strong>4단계:</strong> 이후 데이터 변경 시 자동으로 동기화가 진행됩니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 동기화 규칙 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">동기화 규칙</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">자동 동기화</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 새 거래 추가 시 즉시 업로드</li>
                <li>• 카테고리 변경 시 자동 반영</li>
                <li>• 앱 시작 시 최신 데이터 다운로드</li>
                <li>• 인터넷 연결 시 대기중인 변경사항 전송</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">충돌 해결</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 최신 수정 시간 우선 (Last-Write-Wins)</li>
                <li>• 로컬 변경사항은 별도 백업</li>
                <li>• 삭제된 항목은 비활성화로 처리</li>
                <li>• 수동 동기화로 강제 업데이트 가능</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 도움말 링크 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">도움이 필요하신가요?</h4>
              <p className="text-sm text-gray-600">Google Sheets 설정 가이드를 확인해보세요</p>
            </div>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <span>가이드 보기</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}