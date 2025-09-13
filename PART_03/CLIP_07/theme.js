// 테마 및 스타일 설정 파일
const THEME_CONFIG = {
    // 색상 테마
    colors: {
        // 배경 그라데이션
        backgroundGradient: {
            primary: '#74b9ff',
            secondary: '#0984e3',
            direction: '135deg'
        },

        // 버튼 색상
        buttons: {
            default: {
                primary: '#6c5ce7',
                secondary: '#a29bfe'
            },
            active: {
                primary: '#00b894',
                secondary: '#00cec9'
            },
            hover: {
                shadowColor: 'rgba(108, 92, 231, 0.4)'
            }
        },

        // 날씨 정보 카드 그라데이션
        weatherCard: {
            primary: '#667eea',
            secondary: '#764ba2',
            direction: '135deg'
        },

        // 텍스트 색상
        text: {
            primary: '#2d3436',
            secondary: '#636e72',
            white: '#ffffff'
        },

        // 카드 배경
        card: {
            background: 'rgba(255, 255, 255, 0.95)',
            detailBackground: 'rgba(255, 255, 255, 0.1)'
        }
    },

    // 크기 및 간격
    dimensions: {
        // 카드 크기
        card: {
            maxWidth: '400px',
            borderRadius: '20px',
            padding: '30px'
        },

        // 버튼 크기
        buttons: {
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '14px'
        },

        // 폰트 크기
        fontSize: {
            title: '2rem',
            cityName: '1.5rem',
            temperature: '3rem',
            description: '1.1rem',
            detailValue: '1.2rem',
            detailLabel: '0.8rem',
            lastUpdated: '0.9rem'
        },

        // 아이콘 크기
        weatherIcon: {
            fontSize: '4rem'
        }
    },

    // 애니메이션 설정
    animations: {
        transition: {
            duration: '0.3s',
            easing: 'ease'
        },
        hover: {
            transform: 'translateY(-2px)',
            shadowSpread: '15px'
        }
    },

    // 반응형 브레이크포인트
    responsive: {
        mobile: '480px',
        mobileSettings: {
            card: {
                padding: '20px'
            },
            fontSize: {
                title: '1.5rem',
                temperature: '2.5rem'
            }
        }
    }
};