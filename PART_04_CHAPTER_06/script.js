// 전역 변수
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

// 상태 관리
let state = {
    backgroundImage: null,
    backgroundColor: null,
    imageFit: 'cover',
    imageScale: 100,
    imageX: 50,
    imageY: 50,
    topText: {
        text: '',
        fontSize: 48,
        color: '#ffffff',
        x: 400,
        y: 80,
        rotation: 0
    },
    bottomText: {
        text: '',
        fontSize: 48,
        color: '#ffffff',
        x: 400,
        y: 520,
        rotation: 0
    },
    dragging: null
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvas();
    initializeTemplates();
    initializeUpload();
    initializeImageControls();
    initializeTextControls();
    initializeExportButtons();
    initializeCanvasDrag();

    // 초기 렌더링
    renderCanvas();
});

// Canvas 초기화
function initializeCanvas() {
    // 기본 배경색 설정
    state.backgroundColor = '#667eea';
    renderCanvas();
}

// 템플릿 버튼 초기화
function initializeTemplates() {
    const templateButtons = document.querySelectorAll('.template-btn');

    templateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 활성 클래스 제거
            templateButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 배경색 설정
            state.backgroundColor = this.dataset.color;
            state.backgroundImage = null;

            // 이미지 조정 섹션 숨기기
            document.getElementById('imageAdjustSection').style.display = 'none';

            renderCanvas();
        });
    });

    // 첫 번째 템플릿 활성화
    templateButtons[0].classList.add('active');
}

// 이미지 업로드 초기화
function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');

    // 클릭 이벤트
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 파일 선택
    imageInput.addEventListener('change', handleImageUpload);

    // 드래그 앤 드롭
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            loadImageFile(files[0]);
        }
    });
}

// 이미지 업로드 처리
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImageFile(file);
    }
}

// 이미지 파일 로드 (FileReader API 사용)
function loadImageFile(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            state.backgroundImage = img;
            state.backgroundColor = null;

            // 템플릿 버튼 비활성화
            document.querySelectorAll('.template-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // 이미지 조정 섹션 표시
            document.getElementById('imageAdjustSection').style.display = 'block';

            renderCanvas();
            showMessage('이미지가 업로드되었습니다!', 'success');
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// 이미지 조정 컨트롤 초기화
function initializeImageControls() {
    const imageFit = document.getElementById('imageFit');
    const imageScale = document.getElementById('imageScale');
    const imageX = document.getElementById('imageX');
    const imageY = document.getElementById('imageY');

    imageFit.addEventListener('change', function() {
        state.imageFit = this.value;
        renderCanvas();
    });

    imageScale.addEventListener('input', function() {
        state.imageScale = parseInt(this.value);
        document.getElementById('scaleValue').textContent = this.value;
        renderCanvas();
    });

    imageX.addEventListener('input', function() {
        state.imageX = parseInt(this.value);
        document.getElementById('imageXValue').textContent = this.value;
        renderCanvas();
    });

    imageY.addEventListener('input', function() {
        state.imageY = parseInt(this.value);
        document.getElementById('imageYValue').textContent = this.value;
        renderCanvas();
    });
}

// 텍스트 컨트롤 초기화
function initializeTextControls() {
    // 상단 텍스트
    document.getElementById('topText').addEventListener('input', function() {
        state.topText.text = this.value;
        renderCanvas();
    });

    document.getElementById('topFontSize').addEventListener('input', function() {
        state.topText.fontSize = parseInt(this.value);
        renderCanvas();
    });

    document.getElementById('topColor').addEventListener('input', function() {
        state.topText.color = this.value;
        renderCanvas();
    });

    document.getElementById('topX').addEventListener('input', function() {
        state.topText.x = parseInt(this.value);
        renderCanvas();
    });

    document.getElementById('topY').addEventListener('input', function() {
        state.topText.y = parseInt(this.value);
        renderCanvas();
    });

    document.getElementById('topRotation').addEventListener('input', function() {
        state.topText.rotation = parseInt(this.value);
        renderCanvas();
    });

    // 하단 텍스트
    document.getElementById('bottomText').addEventListener('input', function() {
        state.bottomText.text = this.value;
        renderCanvas();
    });

    document.getElementById('bottomFontSize').addEventListener('input', function() {
        state.bottomText.fontSize = parseInt(this.value);
        renderCanvas();
    });

    document.getElementById('bottomColor').addEventListener('input', function() {
        state.bottomText.color = this.value;
        renderCanvas();
    });

    document.getElementById('bottomX').addEventListener('input', function() {
        state.bottomText.x = parseInt(this.value);
        renderCanvas();
    });

    document.getElementById('bottomY').addEventListener('input', function() {
        state.bottomText.y = parseInt(this.value);
        renderCanvas();
    });

    document.getElementById('bottomRotation').addEventListener('input', function() {
        state.bottomText.rotation = parseInt(this.value);
        renderCanvas();
    });
}

// Canvas 드래그 기능 초기화
function initializeCanvasDrag() {
    let isDragging = false;
    let dragTarget = null;
    let offsetX = 0;
    let offsetY = 0;

    canvas.addEventListener('mousedown', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        // 텍스트 클릭 확인
        if (isTextClicked(x, y, state.topText)) {
            isDragging = true;
            dragTarget = 'top';
            offsetX = x - state.topText.x;
            offsetY = y - state.topText.y;
            canvas.style.cursor = 'grabbing';
        } else if (isTextClicked(x, y, state.bottomText)) {
            isDragging = true;
            dragTarget = 'bottom';
            offsetX = x - state.bottomText.x;
            offsetY = y - state.bottomText.y;
            canvas.style.cursor = 'grabbing';
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        if (isDragging && dragTarget) {
            if (dragTarget === 'top') {
                state.topText.x = Math.round(x - offsetX);
                state.topText.y = Math.round(y - offsetY);
                document.getElementById('topX').value = state.topText.x;
                document.getElementById('topY').value = state.topText.y;
            } else if (dragTarget === 'bottom') {
                state.bottomText.x = Math.round(x - offsetX);
                state.bottomText.y = Math.round(y - offsetY);
                document.getElementById('bottomX').value = state.bottomText.x;
                document.getElementById('bottomY').value = state.bottomText.y;
            }
            renderCanvas();
        } else {
            // 호버 효과
            if (isTextClicked(x, y, state.topText) || isTextClicked(x, y, state.bottomText)) {
                canvas.style.cursor = 'grab';
            } else {
                canvas.style.cursor = 'default';
            }
        }
    });

    canvas.addEventListener('mouseup', function() {
        isDragging = false;
        dragTarget = null;
        canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('mouseleave', function() {
        isDragging = false;
        dragTarget = null;
        canvas.style.cursor = 'default';
    });
}

// 텍스트 클릭 확인
function isTextClicked(x, y, textObj) {
    if (!textObj.text) return false;

    ctx.font = `bold ${textObj.fontSize}px Impact, sans-serif`;
    const metrics = ctx.measureText(textObj.text);
    const textWidth = metrics.width;
    const textHeight = textObj.fontSize;

    const left = textObj.x - textWidth / 2;
    const right = textObj.x + textWidth / 2;
    const top = textObj.y - textHeight / 2;
    const bottom = textObj.y + textHeight / 2;

    return x >= left && x <= right && y >= top && y <= bottom;
}

// Canvas 렌더링
function renderCanvas() {
    // Canvas 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 그리기
    if (state.backgroundImage) {
        drawImage(state.backgroundImage);
    } else if (state.backgroundColor) {
        ctx.fillStyle = state.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 텍스트 그리기
    if (state.topText.text) {
        drawText(state.topText);
    }
    if (state.bottomText.text) {
        drawText(state.bottomText);
    }
}

// 이미지 그리기 (맞춤 방식 적용)
function drawImage(img) {
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;

    let drawWidth, drawHeight, drawX, drawY;

    const scale = state.imageScale / 100;

    if (state.imageFit === 'cover') {
        if (imgAspect > canvasAspect) {
            drawHeight = canvas.height * scale;
            drawWidth = drawHeight * imgAspect;
        } else {
            drawWidth = canvas.width * scale;
            drawHeight = drawWidth / imgAspect;
        }
    } else if (state.imageFit === 'contain') {
        if (imgAspect > canvasAspect) {
            drawWidth = canvas.width * scale;
            drawHeight = drawWidth / imgAspect;
        } else {
            drawHeight = canvas.height * scale;
            drawWidth = drawHeight * imgAspect;
        }
    } else { // fill
        drawWidth = canvas.width * scale;
        drawHeight = canvas.height * scale;
    }

    // 위치 조정
    drawX = (canvas.width - drawWidth) * (state.imageX / 100);
    drawY = (canvas.height - drawHeight) * (state.imageY / 100);

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

// 텍스트 그리기 (외곽선 포함)
function drawText(textObj) {
    ctx.save();

    // 회전 적용
    ctx.translate(textObj.x, textObj.y);
    ctx.rotate((textObj.rotation * Math.PI) / 180);

    // 폰트 설정
    ctx.font = `bold ${textObj.fontSize}px Impact, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 외곽선
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = textObj.fontSize / 12;
    ctx.strokeText(textObj.text, 0, 0);

    // 텍스트
    ctx.fillStyle = textObj.color;
    ctx.fillText(textObj.text, 0, 0);

    ctx.restore();
}

// 내보내기 버튼 초기화
function initializeExportButtons() {
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('copyBtn').addEventListener('click', copyImageToClipboard);
    document.getElementById('twitterBtn').addEventListener('click', shareToTwitter);
}

// PNG 다운로드
async function downloadImage() {
    const button = document.getElementById('downloadBtn');
    button.classList.add('loading');

    try {
        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = `meme_${new Date().getTime()}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);

            showMessage('이미지가 다운로드되었습니다!', 'success');
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('다운로드 실패:', error);
        showMessage('다운로드에 실패했습니다.', 'error');
    } finally {
        setTimeout(() => {
            button.classList.remove('loading');
        }, 500);
    }
}

// 클립보드 복사 (CHAPTER_05 방식)
async function copyImageToClipboard() {
    const button = document.getElementById('copyBtn');
    button.classList.add('loading');

    try {
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                showMessage('이미지가 클립보드에 복사되었습니다!', 'success');
            } catch (error) {
                console.error('클립보드 복사 실패:', error);
                showMessage('클립보드 복사에 실패했습니다. HTTPS 환경에서만 작동합니다.', 'error');
            } finally {
                button.classList.remove('loading');
            }
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('Blob 변환 실패:', error);
        showMessage('이미지 복사에 실패했습니다.', 'error');
        button.classList.remove('loading');
    }
}

// Twitter 공유 (CHAPTER_05 방식)
async function shareToTwitter() {
    const button = document.getElementById('twitterBtn');
    button.classList.add('loading');

    try {
        // 먼저 클립보드에 복사
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);

                // Twitter 공유 URL 생성
                const text = '나만의 밈을 만들었어요! 🎨';
                const hashtags = '밈생성기,MemeGenerator';
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;

                // 새 창으로 Twitter 열기
                window.open(url, '_blank', 'width=550,height=420');

                // 사용자에게 안내
                setTimeout(() => {
                    showMessage('이미지가 클립보드에 복사되었습니다.\nTwitter에서 트윗에 붙여넣기 하세요! (Ctrl+V 또는 Cmd+V)', 'success');
                }, 500);
            } catch (error) {
                console.error('클립보드 복사 실패:', error);
                showMessage('클립보드 복사에 실패했습니다. HTTPS 환경에서만 작동합니다.', 'error');
            } finally {
                button.classList.remove('loading');
            }
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('Twitter 공유 실패:', error);
        showMessage('Twitter 공유에 실패했습니다.', 'error');
        button.classList.remove('loading');
    }
}

// 메시지 표시
function showMessage(message, type = 'success') {
    const container = document.getElementById('messageContainer');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    container.appendChild(messageDiv);

    // 3초 후 제거
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}
