// 저속노화 식단 앱 테마 색상 (초록색/헬스 테마)
export const colors = {
  // 메인 색상
  primary: '#4CAF50', // 밝은 초록
  primaryDark: '#388E3C', // 진한 초록
  primaryLight: '#81C784', // 연한 초록

  // 배경 색상
  background: '#F5F5F5', // 연한 회색 배경
  surface: '#FFFFFF', // 흰색 카드 배경

  // 텍스트 색상
  textPrimary: '#212121', // 진한 회색 (주 텍스트)
  textSecondary: '#757575', // 중간 회색 (부 텍스트)
  textLight: '#BDBDBD', // 연한 회색 (비활성 텍스트)

  // 강조 색상
  accent: '#66BB6A', // 액센트 초록
  success: '#4CAF50', // 성공 (초록)
  warning: '#FFA726', // 경고 (오렌지)
  error: '#EF5350', // 에러 (빨강)
  info: '#42A5F5', // 정보 (파랑)

  // 칼로리 관련 색상
  caloriesLow: '#66BB6A', // 저칼로리 (초록)
  caloriesMedium: '#FFA726', // 중간 칼로리 (오렌지)
  caloriesHigh: '#EF5350', // 고칼로리 (빨강)

  // 탭바 색상
  tabActive: '#4CAF50',
  tabInactive: '#9E9E9E',

  // 그림자 색상
  shadow: '#000000',

  // 달력 마커 색상
  markerColor: '#4CAF50',
  selectedDayColor: '#66BB6A',

  // 테두리 색상
  border: '#E0E0E0',
  borderDark: '#BDBDBD',
};

// 그림자 스타일
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};
