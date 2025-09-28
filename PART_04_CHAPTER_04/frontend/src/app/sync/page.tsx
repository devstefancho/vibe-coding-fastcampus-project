'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SyncMeta } from '@/types/budget';
import { SyncService } from '@/lib/sync-service';
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // 컴포넌트 로드 시 로컬 동기화 메타데이터 확인
  useEffect(() => {
    const localData = SyncService.getLocalData();
    if (localData.syncMeta.lastSyncAt) {
      setSyncMeta({
        sheetId: localData.syncMeta.sheetId || '',
        lastSyncAt: localData.syncMeta.lastSyncAt,
        pendingCount: localData.syncMeta.pendingCount || 0,
      });
      setIsConnected(true);
    }
  }, []);

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);

    try {
      const connected = await SyncService.testConnection();

      if (connected) {
        setIsConnected(true);
        setSyncMeta(prev => ({
          ...prev,
          sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || 'configured',
        }));
        showMessage('Google Sheets 연결 성공!', 'success');
      } else {
        setIsConnected(false);
        showMessage('Google Sheets 연결 실패. 환경변수 설정을 확인해주세요.', 'error');
      }
    } catch (error) {
      setIsConnected(false);
      showMessage('연결 테스트 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBackupToSheets = async () => {
    if (!isConnected) {
      showMessage('먼저 Google Sheets 연결을 확인해주세요.', 'error');
      return;
    }

    setIsSyncing(true);

    try {
      const result = await SyncService.backupToSheets();

      if (result.success && result.data) {
        setSyncMeta({
          sheetId: syncMeta.sheetId,
          lastSyncAt: result.data.lastSyncAt,
          pendingCount: 0,
        });
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('백업 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestoreFromSheets = async () => {
    if (!isConnected) {
      showMessage('먼저 Google Sheets 연결을 확인해주세요.', 'error');
      return;
    }

    if (!confirm('Google Sheets에서 데이터를 복원하면 현재 로컬 데이터가 덮어쓰기됩니다. 계속하시겠습니까?')) {
      return;
    }

    setIsSyncing(true);

    try {
      const result = await SyncService.restoreFromSheets();

      if (result.success && result.data) {
        setSyncMeta({
          sheetId: syncMeta.sheetId,
          lastSyncAt: result.data.lastSyncAt,
          pendingCount: 0,
        });
        showMessage(result.message, 'success');

        // 페이지 새로고침으로 UI 업데이트
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('복원 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };


  const handleDisconnect = () => {
    if (confirm('Google Sheets 연결을 해제하시겠습니까?\n로컬 데이터는 유지됩니다.')) {
      setSyncMeta({
        sheetId: '',
        lastSyncAt: '',
        pendingCount: 0,
      });
      setIsConnected(false);

      // 로컬 동기화 메타데이터 클리어
      localStorage.removeItem('bk.v1.sync');
      showMessage('연결이 해제되었습니다.', 'info');
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
          <h1 className="text-3xl font-bold text-gray-900">백업 및 복원</h1>
          <p className="text-gray-600 mt-2">Google Sheets에 데이터를 백업하거나 복원하세요</p>
        </div>

        {/* 메시지 알림 */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

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
                    <span className="text-sm font-medium text-gray-700">마지막 백업</span>
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

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBackupToSheets}
                  disabled={isSyncing}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Cloud className="h-4 w-4" />
                  <span>{isSyncing ? '백업 중...' : 'Google Sheets에 백업'}</span>
                </button>

                <button
                  onClick={handleRestoreFromSheets}
                  disabled={isSyncing}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? '복원 중...' : 'Google Sheets에서 복원'}</span>
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>환경변수 설정 필요:</strong> Google Sheets 연동을 위해서는 .env.local 파일에 인증 정보가 설정되어야 합니다.
                </p>
              </div>

              <button
                onClick={handleTestConnection}
                disabled={isConnecting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Cloud className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
                <span>{isConnecting ? '연결 테스트 중...' : 'Google Sheets 연결 테스트'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 백업 및 복원 설명 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Settings className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">백업 및 복원 사용법</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>백업:</strong> 현재 로컬 데이터를 Google Sheets에 저장합니다.</p>
                <p><strong>복원:</strong> Google Sheets의 데이터로 로컬 데이터를 덮어씁니다.</p>
                <p><strong>주의:</strong> 복원 시 현재 로컬 데이터는 삭제되므로 백업을 먼저 진행하세요.</p>
                <p><strong>자동 백업:</strong> 거래나 카테고리 추가/수정 시 자동으로 백업됩니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 백업 규칙 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">백업 규칙</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">자동 백업</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 새 거래 추가 시 즉시 백업</li>
                <li>• 카테고리 변경 시 자동 백업</li>
                <li>• 거래 수정/삭제 시 백업</li>
                <li>• 인터넷 연결 시 자동 백업 시도</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">데이터 관리</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 단방향 백업으로 데이터 무결성 보장</li>
                <li>• 복원 시 사용자 확인 후 진행</li>
                <li>• 중복 데이터 자동 제거</li>
                <li>• 수동 백업/복원으로 완전 제어</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 도움말 링크 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">도움이 필요하신가요?</h4>
              <p className="text-sm text-gray-600">Google Sheets 백업 설정 가이드를 확인해보세요</p>
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