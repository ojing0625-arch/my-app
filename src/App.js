import { useState, useCallback, useEffect } from "react";

const ENG_TO_KOR = {
  q:'ㅂ',w:'ㅈ',e:'ㄷ',r:'ㄱ',t:'ㅅ',y:'ㅛ',u:'ㅕ',i:'ㅑ',o:'ㅐ',p:'ㅔ',
  a:'ㅁ',s:'ㄴ',d:'ㅇ',f:'ㄹ',g:'ㅎ',h:'ㅗ',j:'ㅓ',k:'ㅏ',l:'ㅣ',
  z:'ㅋ',x:'ㅌ',c:'ㅊ',v:'ㅍ',b:'ㅠ',n:'ㅜ',m:'ㅡ',
  Q:'ㅃ',W:'ㅉ',E:'ㄸ',R:'ㄲ',T:'ㅆ',O:'ㅒ',P:'ㅖ',
};

const KOR_TO_ENG = {
  'ㅂ':'q','ㅈ':'w','ㄷ':'e','ㄱ':'r','ㅅ':'t','ㅛ':'y','ㅕ':'u','ㅑ':'i','ㅐ':'o','ㅔ':'p',
  'ㅁ':'a','ㄴ':'s','ㅇ':'d','ㄹ':'f','ㅎ':'g','ㅗ':'h','ㅓ':'j','ㅏ':'k','ㅣ':'l',
  'ㅋ':'z','ㅌ':'x','ㅊ':'c','ㅍ':'v','ㅠ':'b','ㅜ':'n','ㅡ':'m',
  'ㅃ':'Q','ㅉ':'W','ㄸ':'E','ㄲ':'R','ㅆ':'T','ㅒ':'O','ㅖ':'P',
};

const CHOSUNG  = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGSUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGSUNG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const JONGSUNG_TO_JAMO = {
  'ㄱ':['ㄱ'],'ㄲ':['ㄲ'],'ㄳ':['ㄱ','ㅅ'],'ㄴ':['ㄴ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ','ㅎ'],
  'ㄷ':['ㄷ'],'ㄹ':['ㄹ'],'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅅ'],
  'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ','ㅎ'],'ㅁ':['ㅁ'],'ㅂ':['ㅂ'],'ㅄ':['ㅂ','ㅅ'],
  'ㅅ':['ㅅ'],'ㅆ':['ㅆ'],'ㅇ':['ㅇ'],'ㅈ':['ㅈ'],'ㅊ':['ㅊ'],'ㅋ':['ㅋ'],'ㅌ':['ㅌ'],'ㅍ':['ㅍ'],'ㅎ':['ㅎ'],
};

const DOUBLE_JONGSUNG = {
  'ㄱ+ㅅ':'ㄳ','ㄴ+ㅈ':'ㄵ','ㄴ+ㅎ':'ㄶ','ㄹ+ㄱ':'ㄺ','ㄹ+ㅁ':'ㄻ','ㄹ+ㅂ':'ㄼ',
  'ㄹ+ㅅ':'ㄽ','ㄹ+ㅌ':'ㄾ','ㄹ+ㅍ':'ㄿ','ㄹ+ㅎ':'ㅀ','ㅂ+ㅅ':'ㅄ',
};

const DOUBLE_JUNGSUNG = {
  'ㅗ+ㅏ':'ㅘ','ㅗ+ㅐ':'ㅙ','ㅗ+ㅣ':'ㅚ','ㅜ+ㅓ':'ㅝ','ㅜ+ㅔ':'ㅞ','ㅜ+ㅣ':'ㅟ','ㅡ+ㅣ':'ㅢ',
};

const isChosung  = c => CHOSUNG.includes(c);
const isJungsung = c => JUNGSUNG.includes(c);

function composeKorean(jamos) {
  let result = '', i = 0;
  while (i < jamos.length) {
    const j = jamos[i];
    if (isChosung(j)) {
      if (i+1 < jamos.length && isJungsung(jamos[i+1])) {
        let jung = jamos[i+1];
        if (i+2 < jamos.length && isJungsung(jamos[i+2])) {
          const c = DOUBLE_JUNGSUNG[jung+'+'+jamos[i+2]];
          if (c) { jung = c; i++; }
        }
        if (i+2 < jamos.length && isChosung(jamos[i+2])) {
          const nxt = jamos[i+2];
          if (i+3 < jamos.length && isJungsung(jamos[i+3])) {
            result += String.fromCharCode(0xAC00 + CHOSUNG.indexOf(j)*21*28 + JUNGSUNG.indexOf(jung)*28);
            i += 2; continue;
          } else {
            let jong = nxt;
            if (i+3 < jamos.length && isChosung(jamos[i+3]) && !(i+4 < jamos.length && isJungsung(jamos[i+4]))) {
              const c2 = DOUBLE_JONGSUNG[nxt+'+'+jamos[i+3]];
              if (c2) { jong = c2; i++; }
            }
            const jonIdx = JONGSUNG.indexOf(jong);
            if (jonIdx >= 0) {
              result += String.fromCharCode(0xAC00 + CHOSUNG.indexOf(j)*21*28 + JUNGSUNG.indexOf(jung)*28 + jonIdx);
              i += 3; continue;
            }
          }
        }
        result += String.fromCharCode(0xAC00 + CHOSUNG.indexOf(j)*21*28 + JUNGSUNG.indexOf(jung)*28);
        i += 2;
      } else { result += j; i++; }
    } else { result += j; i++; }
  }
  return result;
}

function engToKor(text) {
  const jamos = [];
  for (const ch of text) {
    if (ENG_TO_KOR[ch] !== undefined) jamos.push(ENG_TO_KOR[ch]);
    else if (ENG_TO_KOR[ch.toLowerCase()] !== undefined) jamos.push(ENG_TO_KOR[ch.toLowerCase()]);
    else jamos.push(ch);
  }
  return composeKorean(jamos);
}

function decomposeKorean(char) {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return null;
  const offset = code - 0xAC00;
  return {
    cho:  CHOSUNG[Math.floor(offset/28/21)],
    jung: JUNGSUNG[Math.floor(offset/28)%21],
    jong: JONGSUNG[offset%28],
  };
}

function korToEng(text) {
  let result = '';
  for (const ch of text) {
    const d = decomposeKorean(ch);
    if (d) {
      result += KOR_TO_ENG[d.cho]  || d.cho;
      result += KOR_TO_ENG[d.jung] || d.jung;
// eslint-disable-next-line
      if (d.jong) (JONGSUNG_TO_JAMO[d.jong]||[d.jong]).forEach(j => { result += KOR_TO_ENG[j]||j; });
    } else if (KOR_TO_ENG[ch]) {
      result += KOR_TO_ENG[ch];
    } else {
      result += ch;
    }
  }
  return result;
}

export default function App() {
  const [mode, setMode]             = useState('en');
  const [inputText, setInputText]   = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied]         = useState(false);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  useEffect(() => {
    const update = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const convert = useCallback((text, m) => {
    if (!text) return '';
    return m === 'en' ? engToKor(text) : korToEng(text);
  }, []);

  const handleInput = (val) => {
    setInputText(val);
    setOutputText(convert(val, mode));
  };

  const swap = () => {
    const next = mode === 'en' ? 'ko' : 'en';
    setMode(next);
    setInputText(outputText);
    setOutputText(convert(outputText, next));
  };

  const copy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const FROM_LABEL = mode === 'en' ? '영문' : '한글';
  const TO_LABEL   = mode === 'en' ? '한글' : '영문';

  // 세로: 상하, 가로: 좌우
  const mainDir   = isLandscape ? 'row' : 'column';
  // 스왑 버튼: 세로면 ↕, 가로면 ↔
  const swapIcon  = isLandscape ? '↔' : '↕';
  // 스왑 영역: 세로면 가로 row(가운데 정렬), 가로면 세로 column
  const swapDir   = isLandscape ? 'column' : 'row';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9f9f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
      padding: isLandscape ? '20px 28px' : '36px 20px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea { resize: none; }
        textarea:focus { outline: none; }

        .box {
          background: #fff;
          border: 1px solid #e2e2e2;
          border-radius: 14px;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          min-width: 0;
          min-height: 0;
        }
        .box-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #aaa;
          text-transform: uppercase;
        }
        .divider { width: 100%; height: 1px; background: #efefef; }
        .text-area {
          background: transparent;
          border: none;
          color: #1a1a1a;
          font-size: 20px;
          line-height: 1.7;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 400;
          width: 100%;
          flex: 1;
          caret-color: #555;
        }
        .text-area::placeholder { color: #ccc; font-weight: 300; font-size: 15px; }
        .output-text {
          color: #1a1a1a;
          font-size: 20px;
          line-height: 1.7;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 400;
          flex: 1;
          word-break: break-all;
          white-space: pre-wrap;
          overflow-y: auto;
        }
        .output-text.empty { color: #ccc; font-size: 15px; font-weight: 300; }
        .box-footer { display: flex; align-items: center; justify-content: space-between; }
        .char-count { font-size: 11px; color: #ccc; letter-spacing: 0.03em; }
        .clear-btn {
          cursor: pointer; background: none; border: none;
          color: #ccc; font-size: 15px; transition: color 0.15s; line-height: 1;
        }
        .clear-btn:hover { color: #999; }
        .copy-btn {
          cursor: pointer; background: none;
          border: 1px solid #ddd; border-radius: 7px;
          padding: 4px 14px; color: #888;
          font-size: 12px; font-family: 'Noto Sans KR', sans-serif;
          font-weight: 400; transition: all 0.15s;
        }
        .copy-btn:hover { border-color: #aaa; color: #444; }
        .copy-btn.done { border-color: #bbb; color: #888; }
        .lang-badge {
          font-size: 12px; color: #bbb;
          letter-spacing: 0.05em; font-weight: 400;
          min-width: 36px; text-align: center;
        }
        .lang-badge.active { color: #555; font-weight: 500; }
        .swap-btn {
          cursor: pointer; background: #fff;
          border: 1px solid #ddd; border-radius: 50%;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: #888;
          transition: all 0.2s; flex-shrink: 0;
        }
        .swap-btn:hover {
          background: #1a1a1a; border-color: #1a1a1a; color: #fff;
          transform: rotate(180deg);
        }
      `}</style>

      {/* 제목 */}
      <div style={{ textAlign: 'center', marginBottom: isLandscape ? 14 : 28 }}>
        <div style={{ fontSize: isLandscape ? 36 : 48, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.04em', lineHeight: 1.1 }}>아차차</div>
        <div style={{ fontSize: 13, color: '#aaa', fontWeight: 400, marginTop: 6, letterSpacing: '0.01em' }}>잘못 친 한영 자판 바로고침</div>
      </div>

      {/* 메인 레이아웃: 세로=column, 가로=row */}
      <div style={{
        width: '100%',
        maxWidth: isLandscape ? 900 : 500,
        display: 'flex',
        flexDirection: mainDir,
        gap: 8,
        flex: isLandscape ? 1 : undefined,
        maxHeight: isLandscape ? 'calc(100vh - 100px)' : undefined,
      }}>

        {/* 입력 박스 */}
        <div className="box" style={{ minHeight: isLandscape ? 0 : 180 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="box-label">{FROM_LABEL}</span>
            {inputText && <button className="clear-btn" onClick={() => { setInputText(''); setOutputText(''); }}>✕</button>}
          </div>
          <div className="divider" />
          <textarea
            className="text-area"
            value={inputText}
            onChange={e => handleInput(e.target.value)}
            placeholder={mode === 'en'
              ? '변환할 내용을 입력해주세요. (dkssudgktpdy)'
              : '변환할 내용을 입력해주세요. (ㅗ디ㅣㅐ)'}
            style={{ minHeight: isLandscape ? 0 : 120 }}
          />
          <div className="box-footer">
            <span className="char-count">{inputText.length}자</span>
          </div>
        </div>

        {/* 스왑 영역 */}
        <div style={{
          display: 'flex',
          flexDirection: swapDir,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          flexShrink: 0,
          padding: isLandscape ? '0 2px' : '0',
        }}>
          <span className={`lang-badge${mode === 'en' ? ' active' : ''}`}>영문</span>
          <button className="swap-btn" onClick={swap} title="방향 전환">{swapIcon}</button>
          <span className={`lang-badge${mode === 'ko' ? ' active' : ''}`}>한글</span>
        </div>

        {/* 출력 박스 */}
        <div className="box" style={{ background: '#fafafa', minHeight: isLandscape ? 0 : 180 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="box-label">{TO_LABEL}</span>
            {outputText && (
              <button className={`copy-btn${copied ? ' done' : ''}`} onClick={copy}>
                {copied ? '복사됨' : '복사'}
              </button>
            )}
          </div>
          <div className="divider" />
          <div className={`output-text${!outputText ? ' empty' : ''}`}>
            {outputText || (mode === 'en' ? '변환된 결과가 여기에 표시됩니다. (안녕하세요)' : '변환된 결과가 여기에 표시됩니다. (hello)')}
          </div>
          <div className="box-footer">
            <span className="char-count">{outputText.length}자</span>
          </div>
        </div>

      </div>
    </div>
  );
}
