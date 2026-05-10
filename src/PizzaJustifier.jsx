import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import i18n from "./i18n";
import { LANGUAGES } from "./languages";

function getSelectedLanguageCode(language) {
  if (!language) {
    return "en";
  }

  if (LANGUAGES.some((option) => option.code === language)) {
    return language;
  }

  const baseCode = language.split("-")[0];

  return (
    LANGUAGES.find(
      (option) => option.code === baseCode || option.code.startsWith(`${baseCode}-`)
    )?.code ?? "en"
  );
}

function getCurrentTimeSeed(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getCurrentTimeLabel(language, date = new Date()) {
  return new Intl.DateTimeFormat(language || undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getScore(timeSeed, situation, pizza) {
  const hash = (timeSeed + situation + pizza)
    .split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 91 + (hash % 9);
}

function getJustification(timeLabel, timeSeed, situation, pizza, t) {
  const justifications = t("justifications", { returnObjects: true });
  const hash = (timeSeed + situation + pizza)
    .split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const template = justifications[hash % justifications.length];
  return {
    argument: template.argument
      .replace("{{time}}", timeLabel)
      .replace("{{situation}}", situation)
      .replace("{{pizza}}", pizza),
    quote: template.quote,
    authority: template.authority,
  };
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .pj-root {
    min-height: 100vh;
    background: #faf6ef;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1.5rem;
    position: relative;
  }
  .pj-lang-bar {
    position: absolute;
    top: 1.25rem;
    right: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .pj-lang-flag { font-size: 1.1rem; line-height: 1; pointer-events: none; }
  .pj-lang-wrap { position: relative; }
  .pj-lang-wrap::after {
    content: '▾';
    position: absolute;
    right: 0.45rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a07848;
    pointer-events: none;
    font-size: 0.7rem;
  }
  .pj-lang-select {
    padding: 0.32rem 1.6rem 0.32rem 0.55rem;
    border: 1.5px solid #e8d9c4;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    color: #1a0a00;
    background: #fff;
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s;
  }
  .pj-lang-select:focus { border-color: #c97b2a; }
  .pj-header { text-align: center; margin-bottom: 2.5rem; }
  .pj-logo { font-size: 3rem; margin-bottom: 0.5rem; }
  .pj-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 700;
    color: #1a0a00;
    line-height: 1.1;
    margin-bottom: 0.5rem;
  }
  .pj-subtitle { font-size: 1rem; color: #7a5c3a; font-style: italic; }
  .pj-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #e8d9c4;
    padding: 2rem;
    width: 100%;
    max-width: 560px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 32px rgba(180,120,50,0.07);
  }
  .pj-form-group { margin-bottom: 1.25rem; }
  .pj-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #a07848;
    margin-bottom: 0.5rem;
  }
  .pj-select-wrap { position: relative; }
  .pj-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a07848;
    pointer-events: none;
    font-size: 0.85rem;
  }
  .pj-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1.5px solid #e8d9c4;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: #1a0a00;
    background: #faf6ef;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.15s;
    outline: none;
  }
  .pj-select:focus { border-color: #c97b2a; }
  .pj-btn {
    width: 100%;
    padding: 1rem;
    background: #c97b2a;
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    margin-top: 0.5rem;
  }
  .pj-btn:hover { background: #b06820; }
  .pj-btn:active { transform: scale(0.98); }
  .pj-verdict {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #e8d9c4;
    padding: 2rem;
    width: 100%;
    max-width: 560px;
    animation: pj-fadein 0.4s ease;
    box-shadow: 0 4px 32px rgba(180,120,50,0.07);
  }
  @keyframes pj-fadein {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pj-score-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1.5px solid #e8d9c4;
  }
  .pj-score-circle {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #c97b2a;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    padding-bottom: 10px;
    flex-shrink: 0;
  }
  .pj-score-num { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; color: #fff; line-height: 1; }
  .pj-score-label { font-size: 0.6rem; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.05em; }
  .pj-verdict-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #1a0a00; line-height: 1.25; }
  .pj-verdict-sub { font-size: 0.85rem; color: #a07848; margin-top: 2px; }
  .pj-argument { font-size: 0.95rem; color: #3a2510; line-height: 1.7; margin-bottom: 1.5rem; }
  .pj-blockquote {
    border-left: 3px solid #c97b2a;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: #faf6ef;
    border-radius: 0 8px 8px 0;
  }
  .pj-blockquote-text { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1rem; color: #1a0a00; margin-bottom: 0.25rem; }
  .pj-blockquote-author { font-size: 0.78rem; color: #a07848; }
  .pj-seal { display: flex; align-items: center; gap: 0.5rem; padding-top: 1rem; border-top: 1.5px solid #e8d9c4; margin-top: 0.5rem; }
  .pj-seal-icon { font-size: 1.5rem; }
  .pj-seal-text { font-size: 0.8rem; color: #7a5c3a; }
  .pj-seal-verdict { font-weight: 500; color: #c97b2a; font-size: 0.85rem; }
  .pj-footer {
    margin-top: 2.5rem;
    text-align: center;
    font-size: 0.8rem;
    color: #a07848;
    line-height: 1.6;
  }
  .pj-footer a {
    color: #c97b2a;
    text-decoration: none;
    font-weight: 500;
  }
  .pj-footer a:hover { text-decoration: underline; }
`;

export default function PizzaJustifier() {
  const { t } = useTranslation();
  const lang = getSelectedLanguageCode(i18n.resolvedLanguage || i18n.language);

  const situations = t("situations", { returnObjects: true });
  const pizzas = t("pizzas", { returnObjects: true });

  const [situation, setSituation] = useState(situations[0]);
  const [pizza, setPizza] = useState(pizzas[0]);
  const [result, setResult] = useState(null);

  function handleLangChange(newLang) {
    if (newLang === lang) {
      return;
    }

    i18n.changeLanguage(newLang).then(() => {
      const newSituations = i18n.t("situations", { returnObjects: true });
      const newPizzas = i18n.t("pizzas", { returnObjects: true });
      setSituation(newSituations[0] ?? "");
      setPizza(newPizzas[0] ?? "");
      setResult(null);
    });
  }

  function handleJustify() {
    const now = new Date();
    const timeSeed = getCurrentTimeSeed(now);
    const timeLabel = getCurrentTimeLabel(lang, now);
    const score = getScore(timeSeed, situation, pizza);
    const j = getJustification(timeLabel, timeSeed, situation, pizza, t);
    setResult({ score, ...j });
  }

  const currentFlag = LANGUAGES.find((l) => l.code === lang)?.flag ?? "🌐";

  return (
    <>
      <style>{styles}</style>
      <div className="pj-root">

        {/* Language selector */}
        <div className="pj-lang-bar">
          <span className="pj-lang-flag">{currentFlag}</span>
          <div className="pj-lang-wrap">
            <select
              className="pj-lang-select"
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Header */}
        <div className="pj-header">
          <div className="pj-logo">🍕</div>
          <h1 className="pj-title">{t("title")}</h1>
          <p className="pj-subtitle">{t("subtitle")}</p>
        </div>

        {/* Form */}
        <div className="pj-card">
          <div className="pj-form-group">
            <label className="pj-label">{t("labelSituation")}</label>
            <div className="pj-select-wrap">
              <select className="pj-select" value={situation}
                onChange={(e) => { setSituation(e.target.value); setResult(null); }}>
                {situations.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="pj-form-group">
            <label className="pj-label">{t("labelPizza")}</label>
            <div className="pj-select-wrap">
              <select className="pj-select" value={pizza}
                onChange={(e) => { setPizza(e.target.value); setResult(null); }}>
                {pizzas.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <button className="pj-btn" onClick={handleJustify}>
            {t("btnJustify")}
          </button>
        </div>

        {/* Verdict */}
        {result && (
          <div className="pj-verdict">
            <div className="pj-score-row">
              <div className="pj-score-circle">
                <span className="pj-score-num">{result.score}</span>
                <span className="pj-score-label">/ 100</span>
              </div>
              <div>
                <div className="pj-verdict-title">{t("verdictTitle")}</div>
                <div className="pj-verdict-sub">
                  {t("verdictSub", { score: result.score })}
                </div>
              </div>
            </div>
            <p className="pj-argument">{result.argument}</p>
            <div className="pj-blockquote">
              <p className="pj-blockquote-text">"{result.quote}"</p>
              <p className="pj-blockquote-author">— {result.authority}</p>
            </div>
            <div className="pj-seal">
              <span className="pj-seal-icon">🏛️</span>
              <div>
                <div className="pj-seal-text">{t("sealText")}</div>
                <div className="pj-seal-verdict">{t("sealVerdict")}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="pj-footer">
          <Trans
            i18nKey="footerCredit"
            values={{ languageCount: LANGUAGES.length }}
            components={{
              yesglot: <a href="https://yesglot.com" target="_blank" rel="noopener noreferrer" />,
            }}
          />
          <br />
          <Trans
            i18nKey="footerCta"
            components={{
              github: <a href="https://github.com/yesglot/example-react" target="_blank" rel="noopener noreferrer" />,
            }}
          />
        </footer>

      </div>
    </>
  );
}
