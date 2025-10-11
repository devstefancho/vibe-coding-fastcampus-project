// 전역 변수
let currentSection = 1;
let selectedMode = 'equal';
let teamCount = 2;
let membersPerTeam = 3;
let members = [];
let teams = [];

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeModeSelection();
});

// 모드 선택 초기화
function initializeModeSelection() {
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectedMode = this.value;
            toggleModeInputs();
        });
    });
}

// 모드에 따른 입력 필드 전환
function toggleModeInputs() {
    const equalModeInput = document.getElementById('equal-mode-input');
    const fixedModeInput = document.getElementById('fixed-mode-input');

    if (selectedMode === 'equal') {
        equalModeInput.style.display = 'block';
        fixedModeInput.style.display = 'none';
    } else {
        equalModeInput.style.display = 'none';
        fixedModeInput.style.display = 'block';
    }
}

// 섹션 이동
function goToSection(sectionNumber) {
    // 유효성 검사
    if (!validateSection(currentSection)) {
        return;
    }

    // 현재 섹션 비활성화
    const currentSectionElement = document.getElementById(`section-${currentSection}`);
    currentSectionElement.classList.remove('active');

    // 새 섹션 활성화
    const newSectionElement = document.getElementById(`section-${sectionNumber}`);
    newSectionElement.classList.add('active');

    // 프로그레스바 업데이트
    updateProgressBar(sectionNumber);

    // 섹션별 처리
    handleSectionChange(currentSection, sectionNumber);

    currentSection = sectionNumber;
}

// 섹션 유효성 검사 - 개선된 버전
function validateSection(section) {
    if (section === 1) {
        // 모드에 따른 값 가져오기
        if (selectedMode === 'equal') {
            teamCount = parseInt(document.getElementById('team-count').value);
            if (!teamCount || isNaN(teamCount)) {
                showError('팀 개수를 입력해주세요.');
                return false;
            }
            if (teamCount < 2) {
                showError('팀 개수는 최소 2개 이상이어야 합니다.');
                return false;
            }
            if (teamCount > 10) {
                showError('팀 개수는 최대 10개까지 가능합니다.');
                return false;
            }
        } else {
            membersPerTeam = parseInt(document.getElementById('members-per-team').value);
            if (!membersPerTeam || isNaN(membersPerTeam)) {
                showError('팀당 인원 수를 입력해주세요.');
                return false;
            }
            if (membersPerTeam < 2) {
                showError('팀당 인원 수는 최소 2명 이상이어야 합니다.');
                return false;
            }
            if (membersPerTeam > 10) {
                showError('팀당 인원 수는 최대 10명까지 가능합니다.');
                return false;
            }
        }
    } else if (section === 2) {
        // 참가자 이름 검증
        const memberInput = document.getElementById('member-input').value.trim();
        if (!memberInput) {
            showError('참가자 이름을 입력해주세요.');
            return false;
        }

        members = memberInput.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        // 중복 이름 체크
        const uniqueMembers = new Set(members);
        if (uniqueMembers.size !== members.length) {
            showError('중복된 이름이 있습니다. 이름을 구분할 수 있도록 수정해주세요.');
            return false;
        }

        if (members.length < 2) {
            showError('최소 2명 이상의 참가자가 필요합니다.');
            return false;
        }

        if (members.length > 100) {
            showError('참가자는 최대 100명까지 가능합니다.');
            return false;
        }

        // 모드에 따른 검증
        if (selectedMode === 'equal') {
            if (members.length < teamCount) {
                showError(`${teamCount}개 팀을 만들기 위해서는 최소 ${teamCount}명이 필요합니다.`);
                return false;
            }
        } else {
            if (members.length < membersPerTeam) {
                showError(`팀당 ${membersPerTeam}명이 필요합니다. 최소 ${membersPerTeam}명 이상 입력해주세요.`);
                return false;
            }
        }
    }
    return true;
}

// 에러 메시지 표시 - 더 나은 UX
function showError(message) {
    // 기존 에러 메시지 제거
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 새 에러 메시지 생성
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // 현재 활성화된 섹션에 추가
    const activeSection = document.querySelector('.section.active .content-box');
    activeSection.insertBefore(errorDiv, activeSection.firstChild);

    // 3초 후 자동 제거
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// 프로그레스바 업데이트
function updateProgressBar(activeStep) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber < activeStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === activeStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// 섹션 변경 처리
function handleSectionChange(fromSection, toSection) {
    if (toSection === 3) {
        // 매칭 중 섹션으로 이동 시
        startMatching();
    } else if (toSection === 4) {
        // 결과 섹션으로 이동 시 confetti 실행
        setTimeout(() => {
            triggerConfetti();
        }, 500);
    } else if (toSection === 1) {
        // 처음으로 돌아갈 때 초기화
        resetGame();
    }
}

// 팀 매칭 시작
function startMatching() {
    // 카드 셔플 애니메이션 시작
    createShuffleAnimation();

    // 애니메이션 완료 후 결과로 이동
    setTimeout(() => {
        createTeams();
        goToSection(4);
    }, 3500);
}

// 카드 셔플 애니메이션 생성
function createShuffleAnimation() {
    const shuffleContainer = document.getElementById('shuffle-container');
    shuffleContainer.innerHTML = '';

    const cardCount = 20;
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
    ];

    // 카드 생성
    for (let i = 0; i < cardCount; i++) {
        const card = document.createElement('div');
        card.className = 'shuffle-card';
        card.style.backgroundColor = colors[i % colors.length];
        card.style.animationDelay = `${i * 0.05}s`;
        shuffleContainer.appendChild(card);
    }

    // 셔플 애니메이션 시작
    setTimeout(() => {
        const cards = shuffleContainer.querySelectorAll('.shuffle-card');
        cards.forEach((card, index) => {
            // 랜덤 위치로 이동
            const randomX = (Math.random() - 0.5) * 600;
            const randomY = (Math.random() - 0.5) * 400;
            const randomRotate = (Math.random() - 0.5) * 720;

            card.style.setProperty('--random-x', `${randomX}px`);
            card.style.setProperty('--random-y', `${randomY}px`);
            card.style.setProperty('--random-rotate', `${randomRotate}deg`);

            card.classList.add('shuffling');
        });
    }, 100);

    // 카드 모으기
    setTimeout(() => {
        const cards = shuffleContainer.querySelectorAll('.shuffle-card');
        cards.forEach(card => {
            card.classList.remove('shuffling');
            card.classList.add('gathering');
        });
    }, 2500);
}

// 팀 생성 - 개선된 로직
function createTeams() {
    // 참가자 랜덤 셔플
    const shuffledMembers = shuffleArray([...members]);
    teams = [];

    if (selectedMode === 'equal') {
        // 균등 분배 모드 - 라운드 로빈 방식으로 더 균등하게 분배
        teams = createEqualTeams(shuffledMembers, teamCount);
    } else {
        // 고정 인원 모드
        teams = createFixedTeams(shuffledMembers, membersPerTeam);
    }

    displayResults();
}

// 균등 분배 팀 생성 (라운드 로빈 방식)
function createEqualTeams(shuffledMembers, numTeams) {
    const result = [];

    // 빈 팀 배열 초기화
    for (let i = 0; i < numTeams; i++) {
        result.push({
            name: `팀 ${i + 1}`,
            members: [],
            color: getTeamColor(i)
        });
    }

    // 라운드 로빈 방식으로 참가자 분배
    shuffledMembers.forEach((member, index) => {
        const teamIndex = index % numTeams;
        result[teamIndex].members.push(member);
    });

    return result;
}

// 고정 인원 팀 생성
function createFixedTeams(shuffledMembers, perTeam) {
    const result = [];
    let teamNumber = 1;

    for (let i = 0; i < shuffledMembers.length; i += perTeam) {
        const teamMembers = shuffledMembers.slice(i, i + perTeam);

        // 엄격한 고정 인원 모드: 나머지 인원도 별도 팀으로 생성
        result.push({
            name: `팀 ${teamNumber}`,
            members: teamMembers,
            color: getTeamColor(teamNumber - 1)
        });
        teamNumber++;
    }

    return result;
}

// 팀 색상 생성
function getTeamColor(index) {
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
    ];
    return colors[index % colors.length];
}

// 배열 셔플 (Fisher-Yates 알고리즘)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 결과 표시 - 개선된 버전
function displayResults() {
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    teams.forEach((team, index) => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.style.background = team.color;
        teamCard.style.animationDelay = `${index * 0.1}s`;

        const teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';

        const teamTitle = document.createElement('h3');
        teamTitle.textContent = team.name;

        const teamCount = document.createElement('span');
        teamCount.className = 'team-count';
        teamCount.textContent = `${team.members.length}명`;

        teamHeader.appendChild(teamTitle);
        teamHeader.appendChild(teamCount);
        teamCard.appendChild(teamHeader);

        const membersContainer = document.createElement('div');
        membersContainer.className = 'team-members';

        team.members.forEach((member, memberIndex) => {
            const memberTag = document.createElement('span');
            memberTag.className = 'member-tag';
            memberTag.textContent = member;
            memberTag.style.animationDelay = `${(index * 0.1) + (memberIndex * 0.05)}s`;
            membersContainer.appendChild(memberTag);
        });

        teamCard.appendChild(membersContainer);
        resultContainer.appendChild(teamCard);
    });
}

// 3단계 Confetti 애니메이션
function triggerConfetti() {
    // 1단계: 양쪽에서 발사
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 0);

    // 2단계: 중앙에서 원형으로 발사
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 360,
            ticks: 100,
            gravity: 0.8,
            decay: 0.94,
            startVelocity: 30,
            origin: { x: 0.5, y: 0.5 }
        });
    }, 800);

    // 3단계: 위에서 떨어지는 효과
    setTimeout(() => {
        const duration = 2000;
        const animationEnd = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#43e97b', '#38f9d7', '#fa709a', '#fee140', '#30cfd0']
            });

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame);
            }
        }());
    }, 1600);
}

// 이미지 캡처 함수
async function captureResultImage() {
    const captureArea = document.getElementById('capture-area');

    try {
        // 팀 카드와 멤버 태그의 애니메이션을 강제로 완료 상태로 설정
        const teamCards = document.querySelectorAll('.team-card');
        const memberTags = document.querySelectorAll('.member-tag');

        teamCards.forEach(card => {
            card.style.setProperty('opacity', '1', 'important');
            card.style.setProperty('transform', 'translateY(0)', 'important');
            card.style.setProperty('animation', 'none', 'important');
        });

        memberTags.forEach(tag => {
            tag.style.setProperty('opacity', '1', 'important');
            tag.style.setProperty('transform', 'scale(1)', 'important');
            tag.style.setProperty('animation', 'none', 'important');
        });

        // DOM 업데이트 대기
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(captureArea, {
            backgroundColor: '#f8fafc',
            scale: 2,
            logging: false,
            useCORS: true
        });

        // 스타일 복원
        teamCards.forEach(card => {
            card.style.removeProperty('opacity');
            card.style.removeProperty('transform');
            card.style.removeProperty('animation');
        });

        memberTags.forEach(tag => {
            tag.style.removeProperty('opacity');
            tag.style.removeProperty('transform');
            tag.style.removeProperty('animation');
        });

        return canvas;
    } catch (error) {
        console.error('이미지 생성 실패:', error);
        alert('이미지 생성에 실패했습니다.');
        return null;
    }
}

// 이미지 다운로드 - 로딩 상태 추가
async function downloadImage() {
    const button = event.target.closest('.btn');
    button.classList.add('loading');

    try {
        const canvas = await captureResultImage();
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `팀매칭결과_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 성공 메시지
        showSuccessMessage('이미지가 다운로드되었습니다!');
    } catch (error) {
        showError('다운로드에 실패했습니다.');
    } finally {
        button.classList.remove('loading');
    }
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    const existingMsg = document.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = 'success-message';
    msgDiv.textContent = message;

    const activeSection = document.querySelector('.section.active .content-box');
    activeSection.insertBefore(msgDiv, activeSection.firstChild);

    setTimeout(() => {
        msgDiv.classList.add('fade-out');
        setTimeout(() => msgDiv.remove(), 300);
    }, 2000);
}

// 클립보드에 이미지 복사
async function copyImageToClipboard() {
    const canvas = await captureResultImage();
    if (!canvas) return;

    try {
        // canvas를 blob으로 변환
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                alert('이미지가 클립보드에 복사되었습니다!');
            } catch (error) {
                console.error('클립보드 복사 실패:', error);
                alert('클립보드 복사에 실패했습니다. HTTPS 환경에서만 작동합니다.');
            }
        });
    } catch (error) {
        console.error('Blob 변환 실패:', error);
        alert('이미지 복사에 실패했습니다.');
    }
}

// Twitter 공유
async function shareToTwitter() {
    // 먼저 클립보드에 복사
    await copyImageToClipboard();

    // Twitter 공유 URL 생성
    const text = '랜덤 팀 매칭 결과를 공유합니다! 🎉';
    const hashtags = '팀매칭,랜덤매칭';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;

    // 새 창으로 Twitter 열기
    window.open(url, '_blank', 'width=550,height=420');

    // 사용자에게 안내
    setTimeout(() => {
        alert('이미지가 클립보드에 복사되었습니다.\nTwitter에서 트윗에 붙여넣기 하세요! (Ctrl+V 또는 Cmd+V)');
    }, 500);
}

// 게임 초기화
function resetGame() {
    members = [];
    teams = [];
    document.getElementById('member-input').value = '';
    document.getElementById('result-container').innerHTML = '';
}
