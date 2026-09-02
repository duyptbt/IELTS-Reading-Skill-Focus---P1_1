import React, { useState, useEffect, useRef } from 'react';
import { 
  QuestionItem, 
  Mode, 
  UserAnswerState,
  HighlightItem
} from '../types';
import { 
  QUESTIONS, 
  TIP_STRIP_PART1, 
  TIP_STRIP_PART2, 
  TIP_STRIP_PART3,
  checkAnswerCorrectness 
} from '../data/ieltsData';
import { HighlightableText } from './HighlightableText';
import { 
  Lightbulb, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Flag,
  Info,
  BookOpen,
  Sparkles,
  ArrowRight,
  GitCommit,
  Highlighter as HighlighterIcon,
  Plus
} from 'lucide-react';

interface QuestionsViewProps {
  mode: Mode;
  userAnswers: UserAnswerState;
  onAnswerChange: (questionId: number, answer: string) => void;
  onJumpToParagraph: (paragraphId: number) => void;
  flaggedQuestions: Set<number>;
  onToggleFlag: (questionId: number) => void;
  isSubmitted: boolean;
  onGoToConsolidation?: () => void;
  highlighterColor?: 'yellow' | 'green' | 'cyan' | 'pink' | 'eraser' | null;
  highlights?: HighlightItem[];
  onAddHighlight?: (highlight: HighlightItem) => void;
  onRemoveHighlight?: (id: string) => void;
  onAddNoteSnippet?: (text: string) => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  mode,
  userAnswers,
  onAnswerChange,
  onJumpToParagraph,
  flaggedQuestions,
  onToggleFlag,
  isSubmitted,
  onGoToConsolidation,
  highlighterColor = null,
  highlights = [],
  onAddHighlight,
  onRemoveHighlight,
  onAddNoteSnippet,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Floating selection menu state for question highlights
  const [floatingMenu, setFloatingMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
    questionId: number;
  } | null>(null);

  // Practice mode state: which questions have their explanation open or checked
  const [checkedQuestions, setCheckedQuestions] = useState<{ [key: number]: boolean }>({});
  const [openExplanations, setOpenExplanations] = useState<{ [key: number]: boolean }>({});
  const [openTips, setOpenTips] = useState<{ [key: number]: boolean }>({});

  // When test is not submitted and answers are empty (retake / reset), clear checked states
  useEffect(() => {
    if (!isSubmitted && Object.keys(userAnswers).length === 0) {
      setCheckedQuestions({});
      setOpenExplanations({});
    }
  }, [isSubmitted, userAnswers]);

  // Tip strip collapse state
  const [isTipStrip1Open, setIsTipStrip1Open] = useState(true);
  const [isTipStrip2Open, setIsTipStrip2Open] = useState(true);
  const [isTipStrip3Open, setIsTipStrip3Open] = useState(true);

  // Active question filter tab (all, part1: 1-5, part2: 6-9, part3: 10-13, flagged)
  const [activeFilter, setActiveFilter] = useState<'all' | 'part1' | 'part2' | 'part3' | 'flagged'>('all');

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setFloatingMenu(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length < 2) {
      setFloatingMenu(null);
      return;
    }

    // Determine which question card was selected
    const anchorNode = selection.anchorNode;
    let currentEl = anchorNode?.parentElement;
    let qId: number | null = null;

    while (currentEl && !qId) {
      const qAttr = currentEl.getAttribute('data-question-id');
      if (qAttr) {
        qId = parseInt(qAttr, 10);
      }
      currentEl = currentEl.parentElement;
    }

    if (!qId) {
      const range = selection.getRangeAt(0);
      let container: HTMLElement | null = range.commonAncestorContainer as HTMLElement;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement;
      }
      const qAttr = container?.closest('[data-question-id]')?.getAttribute('data-question-id');
      if (qAttr) qId = parseInt(qAttr, 10);
    }

    if (!qId) return;

    // Eraser mode: remove highlights matching selected text within this question
    if (highlighterColor === 'eraser') {
      if (onRemoveHighlight) {
        const matchingHls = highlights.filter(
          (h) => h.questionId === qId && (h.text.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(h.text.toLowerCase()))
        );
        matchingHls.forEach((h) => onRemoveHighlight(h.id));
      }
      selection.removeAllRanges();
      setFloatingMenu(null);
      return;
    }

    // Direct color mode from top header
    if (highlighterColor && onAddHighlight) {
      const newHighlight: HighlightItem = {
        id: `hl-q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        questionId: qId,
        text,
        color: highlighterColor,
      };
      onAddHighlight(newHighlight);
      selection.removeAllRanges();
      setFloatingMenu(null);
      return;
    }

    // Otherwise show popup menu
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

    setFloatingMenu({
      visible: true,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 42,
      text,
      questionId: qId,
    });
  };

  const applyColorFromPopup = (color: 'yellow' | 'green' | 'cyan' | 'pink') => {
    if (!floatingMenu || !onAddHighlight) return;
    const newHighlight: HighlightItem = {
      id: `hl-q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      questionId: floatingMenu.questionId,
      text: floatingMenu.text,
      color,
    };
    onAddHighlight(newHighlight);
    setFloatingMenu(null);
    window.getSelection()?.removeAllRanges();
  };

  const copySnippetToNotes = () => {
    if (!floatingMenu || !onAddNoteSnippet) return;
    onAddNoteSnippet(`[Question ${floatingMenu.questionId}]: "${floatingMenu.text}"`);
    setFloatingMenu(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleCheckQuestion = (qId: number) => {
    setCheckedQuestions((prev) => ({ ...prev, [qId]: true }));
    setOpenExplanations((prev) => ({ ...prev, [qId]: true }));
  };

  const toggleExplanation = (qId: number) => {
    setOpenExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleTip = (qId: number) => {
    setOpenTips((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const getWordCount = (str: string) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const part1Questions = QUESTIONS.filter((q) => q.questionNumber >= 1 && q.questionNumber <= 5);
  const part2Questions = QUESTIONS.filter((q) => q.questionNumber >= 6 && q.questionNumber <= 9);
  const part3Questions = QUESTIONS.filter((q) => q.questionNumber >= 10 && q.questionNumber <= 13);

  const answeredCount = Object.values(userAnswers).filter(
    (ans): ans is string => typeof ans === 'string' && ans.trim().length > 0
  ).length;

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="relative flex-1 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden select-text flex flex-col"
      style={{ minHeight: '580px', maxHeight: 'calc(100vh - 170px)' }}
    >
      {/* Floating Selection Highlighter Tooltip */}
      {floatingMenu && floatingMenu.visible && (
        <div
          className="absolute z-50 transform -translate-x-1/2 flex items-center space-x-1 bg-slate-900/95 backdrop-blur-md text-white px-2 py-1 rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${Math.max(120, Math.min(floatingMenu.x, (containerRef.current?.offsetWidth || 600) - 120))}px`,
            top: `${Math.max(10, floatingMenu.y)}px`,
          }}
        >
          <span className="text-[11px] text-slate-300 font-medium px-1 flex items-center space-x-1">
            <HighlighterIcon className="w-3 h-3 text-amber-400" />
            <span>Highlight:</span>
          </span>

          <button
            id="popup-q-hl-yellow"
            onClick={() => applyColorFromPopup('yellow')}
            className="w-5 h-5 rounded hover:scale-110 transition-transform"
            style={{ backgroundColor: '#fef08a' }}
            title="Yellow"
          />
          <button
            id="popup-q-hl-green"
            onClick={() => applyColorFromPopup('green')}
            className="w-5 h-5 rounded hover:scale-110 transition-transform"
            style={{ backgroundColor: '#bbf7d0' }}
            title="Green"
          />
          <button
            id="popup-q-hl-cyan"
            onClick={() => applyColorFromPopup('cyan')}
            className="w-5 h-5 rounded hover:scale-110 transition-transform"
            style={{ backgroundColor: '#bae6fd' }}
            title="Cyan"
          />
          <button
            id="popup-q-hl-pink"
            onClick={() => applyColorFromPopup('pink')}
            className="w-5 h-5 rounded hover:scale-110 transition-transform"
            style={{ backgroundColor: '#fbcfe8' }}
            title="Pink"
          />

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {onAddNoteSnippet && (
            <button
              id="popup-q-copy-note"
              onClick={copySnippetToNotes}
              className="flex items-center space-x-1 text-[11px] text-amber-300 hover:text-amber-200 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Add selection to Notes"
            >
              <Plus className="w-3 h-3" />
              <span>Note</span>
            </button>
          )}
        </div>
      )}
      {/* Sleek Top Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
        <h2 className="font-bold text-slate-600 uppercase text-xs tracking-wider">
          Questions 1–13
        </h2>
        <div className="text-xs font-medium text-slate-500">
          Answered:{' '}
          <span className="font-bold text-slate-900">{answeredCount}</span> / 13
        </div>
      </div>

      {/* Navigator, Filters and Quick Jump */}
      <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-200 bg-white shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              id="filter-all-btn"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All (1–13)
            </button>
            <button
              id="filter-part1-btn"
              onClick={() => setActiveFilter('part1')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeFilter === 'part1'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Q 1–5 (Flow-chart)
            </button>
            <button
              id="filter-part2-btn"
              onClick={() => setActiveFilter('part2')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeFilter === 'part2'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Q 6–9 (T/F/NG)
            </button>
            <button
              id="filter-part3-btn"
              onClick={() => setActiveFilter('part3')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeFilter === 'part3'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Q 10–13 (Short Answer)
            </button>
            {flaggedQuestions.size > 0 && (
              <button
                id="filter-flagged-btn"
                onClick={() => setActiveFilter('flagged')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === 'flagged'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Flag className="w-3 h-3 fill-current" />
                <span>Flagged ({flaggedQuestions.size})</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Jump Bar */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUESTIONS.map((q) => {
            const hasAnswer = Boolean(userAnswers[q.id]?.trim());
            const isFlagged = flaggedQuestions.has(q.id);
            const isChecked = checkedQuestions[q.id] || (isSubmitted && mode === 'test');
            const isCorrect = isChecked ? checkAnswerCorrectness(q, userAnswers[q.id] || '') : false;

            let badgeColor = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
            if (isChecked) {
              badgeColor = isCorrect
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-rose-600 text-white border-rose-700';
            } else if (hasAnswer) {
              badgeColor = 'bg-blue-600 text-white border-blue-700 shadow-xs';
            }

            return (
              <a
                key={q.id}
                href={`#question-card-${q.id}`}
                id={`quick-jump-q-${q.id}`}
                className={`relative shrink-0 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded text-xs font-bold flex items-center justify-center border transition-all ${badgeColor}`}
                title={`Jump to Question ${q.questionNumber}`}
              >
                {q.questionNumber}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Scrollable Questions Content */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-8 flex-1">
        {/* SECTION 1: Questions 1–5 (Flow-chart Completion) */}
        {(activeFilter === 'all' || activeFilter === 'part1' || (activeFilter === 'flagged' && part1Questions.some(q => flaggedQuestions.has(q.id)))) && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-blue-400 border border-slate-700">
                  Questions 1–5
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Flow-chart Completion
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mt-2">
                Complete the flow-chart below.
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Choose <span className="underline font-bold text-amber-300">ONE WORD ONLY</span> from the text for each answer.
              </p>
            </div>

            {/* TIP STRIP: Questions 1-5 */}
            {mode === 'practice' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span>{TIP_STRIP_PART1.title}</span>
                  </div>
                  <button
                    id="toggle-tipstrip-1"
                    onClick={() => setIsTipStrip1Open(!isTipStrip1Open)}
                    className="text-blue-700 hover:text-blue-900 text-xs font-semibold"
                  >
                    {isTipStrip1Open ? 'Hide' : 'Show'}
                  </button>
                </div>

                {isTipStrip1Open && (
                  <div className="text-xs text-blue-800 leading-relaxed space-y-2">
                    <ul className="space-y-1 list-disc list-inside">
                      {TIP_STRIP_PART1.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {TIP_STRIP_PART1.bulletsVi && (
                      <div className="pt-2 border-t border-blue-200/60 mt-2">
                        <span className="font-semibold text-blue-950 block mb-1">
                          Hướng dẫn chiến thuật (Tiếng Việt):
                        </span>
                        <ul className="space-y-1 list-disc list-inside text-blue-900">
                          {TIP_STRIP_PART1.bulletsVi.map((bulletVi, bIdx) => (
                            <li key={bIdx} className="leading-snug">
                              {bulletVi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Flowchart Presentation Header */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-2.5 text-slate-700 text-xs font-bold">
              <GitCommit className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Key Events in the Dover Boat Project Chronology</span>
            </div>

            {/* Questions 1-5 Items */}
            <div className="space-y-4">
              {part1Questions
                .filter(q => activeFilter !== 'flagged' || flaggedQuestions.has(q.id))
                .map((q, idx, arr) => {
                const answer = userAnswers[q.id] || '';
                const wordCount = getWordCount(answer);
                const isOverLimit = wordCount > 1;
                const isChecked = checkedQuestions[q.id] || (isSubmitted && mode === 'test');
                const isCorrect = isChecked ? checkAnswerCorrectness(q, answer) : false;
                const isFlagged = flaggedQuestions.has(q.id);
                const showExplanation = openExplanations[q.id] || (isSubmitted && mode === 'test');
                const showTip = openTips[q.id];

                return (
                  <div key={q.id} className="relative">
                    <div
                      id={`question-card-${q.id}`}
                      data-question-id={q.id}
                      className={`p-4 sm:p-5 rounded-xl border transition-all ${
                        isChecked
                          ? isCorrect
                            ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200'
                            : 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {/* Card Header: Year Tag, Number, Prompt, and Flag */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="shrink-0 w-6 h-6 rounded bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                            {q.questionNumber}
                          </span>
                          <div className="flex-1">
                            {q.year && (
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
                                Year: {q.year}
                              </span>
                            )}
                            <HighlightableText
                              text={q.prompt}
                              questionId={q.id}
                              highlights={highlights}
                              onRemoveHighlight={onRemoveHighlight || (() => {})}
                              className="text-sm font-semibold text-slate-900 leading-snug block"
                              as="p"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            id={`flag-q-${q.id}`}
                            onClick={() => onToggleFlag(q.id)}
                            title={isFlagged ? 'Remove flag' : 'Flag question for review'}
                            className={`p-1.5 rounded transition-colors ${
                              isFlagged
                                ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Flag className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Question Specific Tip (Practice Mode) */}
                      {mode === 'practice' && q.tip && (
                        <div className="mt-2.5">
                          <button
                            id={`tip-btn-q-${q.id}`}
                            onClick={() => toggleTip(q.id)}
                            className="flex items-center space-x-1.5 text-xs text-blue-700 hover:text-blue-900 font-medium py-0.5 px-2 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span>{showTip ? 'Hide Question Tip' : 'Show Question Tip'}</span>
                          </button>
                          {showTip && (
                            <div className="mt-1.5 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900 leading-relaxed animate-in fade-in space-y-1.5">
                              <div>
                                <span className="font-bold">Tip: </span>
                                <span>{q.tip}</span>
                              </div>
                              {q.tipVi && (
                                <div className="pt-1.5 border-t border-blue-200/60 text-slate-700">
                                  <span className="font-semibold text-blue-900">Gợi ý làm bài: </span>
                                  <span>{q.tipVi}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Input Field */}
                      <div className="mt-3">
                        <div className="relative">
                          <input
                            id={`input-q-${q.id}`}
                            type="text"
                            disabled={isSubmitted && mode === 'test'}
                            value={answer}
                            onChange={(e) => onAnswerChange(q.id, e.target.value)}
                            placeholder="Type ONE word only..."
                            className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none transition-all ${
                              isChecked
                                ? isCorrect
                                  ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 font-medium'
                                  : 'border-rose-500 bg-rose-50/30 text-rose-950 font-medium'
                                : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50/50 hover:bg-white text-slate-900'
                            }`}
                          />
                        </div>

                        {/* Word count feedback */}
                        <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-500">
                          <span>
                            Word count: <strong className={isOverLimit ? 'text-rose-600 font-bold' : 'text-slate-800'}>{wordCount}</strong> / 1 max (ONE WORD ONLY)
                          </span>
                          {isOverLimit && (
                            <span className="text-rose-600 font-semibold flex items-center space-x-1">
                              <Info className="w-3 h-3" />
                              <span>Warning: Exceeds 1-word limit!</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Practice Mode Controls & Feedback */}
                      {mode === 'practice' && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                          <button
                            id={`check-btn-q-${q.id}`}
                            onClick={() => handleCheckQuestion(q.id)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Check Answer</span>
                          </button>

                          <button
                            id={`explain-btn-q-${q.id}`}
                            onClick={() => toggleExplanation(q.id)}
                            className="flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-semibold py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                          >
                            <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
                            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}

                      {/* Detailed Explanation & Paragraph Evidence Box */}
                      {showExplanation && (
                        <div className="mt-3 p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-slate-800 space-y-2.5 animate-in fade-in">
                          <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/70">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900">Official Answer:</span>
                              <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300">
                                {q.officialAnswer}
                              </span>
                            </div>

                            <button
                              id={`locate-passage-q-${q.id}`}
                              onClick={() => onJumpToParagraph(q.paragraphRef)}
                              className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 font-semibold px-2 py-0.5 rounded bg-white hover:bg-blue-100/50 border border-blue-200 transition-colors"
                            >
                              <BookOpen className="w-3 h-3 text-blue-600" />
                              <span>View in Passage</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-700">Passage Evidence: </span>
                            <span className="italic bg-yellow-100 px-1 py-0.5 rounded text-slate-900 font-serif">
                              "{q.paragraphQuote}"
                            </span>
                          </div>

                          <p className="text-slate-700 leading-relaxed font-sans pt-1">
                            <strong className="text-slate-900">Explanation: </strong>
                            {q.explanation}
                          </p>

                          {q.explanationVi && (
                            <div className="pt-2 border-t border-blue-200/60 mt-1.5 text-slate-700 leading-relaxed font-sans">
                              <span className="font-bold text-blue-950 block text-[11px] uppercase tracking-wider mb-0.5">
                                Giải thích chi tiết (Tiếng Việt):
                              </span>
                              <p className="text-slate-700">{q.explanationVi}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Flow connector down arrow */}
                    {idx < arr.length - 1 && (
                      <div className="flex justify-center my-1.5">
                        <div className="w-0.5 h-4 bg-slate-300 relative">
                          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-r-2 border-slate-400 rotate-45" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: Questions 6–9 (TRUE / FALSE / NOT GIVEN) */}
        {(activeFilter === 'all' || activeFilter === 'part2' || (activeFilter === 'flagged' && part2Questions.some(q => flaggedQuestions.has(q.id)))) && (
          <div className="space-y-6 pt-2">
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-blue-400 border border-slate-700">
                  Questions 6–9
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  TRUE / FALSE / NOT GIVEN
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mt-2">
                Do the following statements agree with the information given in the text?
              </h3>
              <div className="text-xs text-slate-300 mt-2.5 space-y-1 font-medium bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <p><strong className="text-emerald-400 font-bold">TRUE</strong> — if the statement agrees with the information</p>
                <p><strong className="text-rose-400 font-bold">FALSE</strong> — if the statement contradicts the information</p>
                <p><strong className="text-amber-400 font-bold">NOT GIVEN</strong> — if there is no information on this</p>
              </div>
            </div>

            {/* TIP STRIP: Questions 6-9 */}
            {mode === 'practice' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span>{TIP_STRIP_PART2.title}</span>
                  </div>
                  <button
                    id="toggle-tipstrip-2"
                    onClick={() => setIsTipStrip2Open(!isTipStrip2Open)}
                    className="text-blue-700 hover:text-blue-900 text-xs font-semibold"
                  >
                    {isTipStrip2Open ? 'Hide' : 'Show'}
                  </button>
                </div>

                {isTipStrip2Open && (
                  <div className="text-xs text-blue-800 leading-relaxed space-y-2">
                    <ul className="space-y-1 list-disc list-inside">
                      {TIP_STRIP_PART2.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {TIP_STRIP_PART2.bulletsVi && (
                      <div className="pt-2 border-t border-blue-200/60 mt-2">
                        <span className="font-semibold text-blue-950 block mb-1">
                          Hướng dẫn chiến thuật (Tiếng Việt):
                        </span>
                        <ul className="space-y-1 list-disc list-inside text-blue-900">
                          {TIP_STRIP_PART2.bulletsVi.map((bulletVi, bIdx) => (
                            <li key={bIdx} className="leading-snug">
                              {bulletVi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Questions 6-9 Items */}
            <div className="space-y-4">
              {part2Questions
                .filter(q => activeFilter !== 'flagged' || flaggedQuestions.has(q.id))
                .map((q) => {
                const answer = userAnswers[q.id] || '';
                const isChecked = checkedQuestions[q.id] || (isSubmitted && mode === 'test');
                const isCorrect = isChecked ? checkAnswerCorrectness(q, answer) : false;
                const isFlagged = flaggedQuestions.has(q.id);
                const showExplanation = openExplanations[q.id] || (isSubmitted && mode === 'test');
                const showTip = openTips[q.id];

                return (
                  <div
                    key={q.id}
                    id={`question-card-${q.id}`}
                    data-question-id={q.id}
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isChecked
                        ? isCorrect
                          ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200'
                          : 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Card Header: Number, Prompt, and Flag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="shrink-0 w-6 h-6 rounded bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          {q.questionNumber}
                        </span>
                        <div className="flex-1">
                          <HighlightableText
                            text={q.prompt}
                            questionId={q.id}
                            highlights={highlights}
                            onRemoveHighlight={onRemoveHighlight || (() => {})}
                            className="text-sm font-semibold text-slate-900 leading-snug block"
                            as="p"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          id={`flag-q-${q.id}`}
                          onClick={() => onToggleFlag(q.id)}
                          title={isFlagged ? 'Remove flag' : 'Flag question for review'}
                          className={`p-1.5 rounded transition-colors ${
                            isFlagged
                              ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Question Specific Tip (Practice Mode) */}
                    {mode === 'practice' && q.tip && (
                      <div className="mt-2.5">
                        <button
                          id={`tip-btn-q-${q.id}`}
                          onClick={() => toggleTip(q.id)}
                          className="flex items-center space-x-1.5 text-xs text-blue-700 hover:text-blue-900 font-medium py-0.5 px-2 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>{showTip ? 'Hide Question Tip' : 'Show Question Tip'}</span>
                        </button>
                        {showTip && (
                          <div className="mt-1.5 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900 leading-relaxed animate-in fade-in space-y-1.5">
                            <div>
                              <span className="font-bold">Tip: </span>
                              <span>{q.tip}</span>
                            </div>
                            {q.tipVi && (
                              <div className="pt-1.5 border-t border-blue-200/60 text-slate-700">
                                <span className="font-semibold text-blue-900">Gợi ý làm bài: </span>
                                <span>{q.tipVi}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Segmented Radio Options */}
                    <div className="mt-3.5 flex gap-2">
                      {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map((option) => {
                        const isSelected = answer.toUpperCase() === option;
                        return (
                          <button
                            key={option}
                            id={`option-q-${q.id}-${option.replace(/\s+/g, '')}`}
                            disabled={isSubmitted && mode === 'test'}
                            onClick={() => onAnswerChange(q.id, option)}
                            className={`flex-1 py-2 px-3 rounded border text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Practice Mode Controls & Feedback */}
                    {mode === 'practice' && (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                        <button
                          id={`check-btn-q-${q.id}`}
                          onClick={() => handleCheckQuestion(q.id)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Check Answer</span>
                        </button>

                        <button
                          id={`explain-btn-q-${q.id}`}
                          onClick={() => toggleExplanation(q.id)}
                          className="flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-semibold py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                        >
                          <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
                          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {/* Detailed Explanation & Paragraph Evidence Box */}
                    {showExplanation && (
                      <div className="mt-3 p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-slate-800 space-y-2.5 animate-in fade-in">
                        <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/70">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">Official Answer:</span>
                            <span
                              className={`px-2 py-0.5 rounded font-bold ${
                                q.officialAnswer === 'TRUE'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : q.officialAnswer === 'FALSE'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {q.officialAnswer}
                            </span>
                          </div>

                          <button
                            id={`locate-passage-q-${q.id}`}
                            onClick={() => onJumpToParagraph(q.paragraphRef)}
                            className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 font-semibold px-2 py-0.5 rounded bg-white hover:bg-blue-100/50 border border-blue-200 transition-colors"
                          >
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            <span>View in Passage</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-700">Passage Evidence: </span>
                          <span className="italic bg-yellow-100 px-1 py-0.5 rounded text-slate-900 font-serif">
                            "{q.paragraphQuote}"
                          </span>
                        </div>

                        <p className="text-slate-700 leading-relaxed font-sans pt-1">
                          <strong className="text-slate-900">Explanation: </strong>
                          {q.explanation}
                        </p>

                        {q.explanationVi && (
                          <div className="pt-2 border-t border-blue-200/60 mt-1.5 text-slate-700 leading-relaxed font-sans">
                            <span className="font-bold text-blue-950 block text-[11px] uppercase tracking-wider mb-0.5">
                              Giải thích chi tiết (Tiếng Việt):
                            </span>
                            <p className="text-slate-700">{q.explanationVi}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: Questions 10–13 (Short-Answer Questions) */}
        {(activeFilter === 'all' || activeFilter === 'part3' || (activeFilter === 'flagged' && part3Questions.some(q => flaggedQuestions.has(q.id)))) && (
          <div className="space-y-6 pt-2">
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-blue-400 border border-slate-700">
                  Questions 10–13
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Short-answer Questions
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mt-2">
                Answer the questions below.
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Choose <span className="underline font-bold text-amber-300">NO MORE THAN THREE WORDS AND/OR A NUMBER</span> from the text for each answer.
              </p>
            </div>

            {/* TIP STRIP: Questions 10-13 */}
            {mode === 'practice' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span>{TIP_STRIP_PART3.title}</span>
                  </div>
                  <button
                    id="toggle-tipstrip-3"
                    onClick={() => setIsTipStrip3Open(!isTipStrip3Open)}
                    className="text-blue-700 hover:text-blue-900 text-xs font-semibold"
                  >
                    {isTipStrip3Open ? 'Hide' : 'Show'}
                  </button>
                </div>

                {isTipStrip3Open && (
                  <div className="text-xs text-blue-800 leading-relaxed space-y-2">
                    <ul className="space-y-1 list-disc list-inside">
                      {TIP_STRIP_PART3.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {TIP_STRIP_PART3.bulletsVi && (
                      <div className="pt-2 border-t border-blue-200/60 mt-2">
                        <span className="font-semibold text-blue-950 block mb-1">
                          Hướng dẫn chiến thuật (Tiếng Việt):
                        </span>
                        <ul className="space-y-1 list-disc list-inside text-blue-900">
                          {TIP_STRIP_PART3.bulletsVi.map((bulletVi, bIdx) => (
                            <li key={bIdx} className="leading-snug">
                              {bulletVi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Questions 10-13 Items */}
            <div className="space-y-4">
              {part3Questions
                .filter(q => activeFilter !== 'flagged' || flaggedQuestions.has(q.id))
                .map((q) => {
                const answer = userAnswers[q.id] || '';
                const wordCount = getWordCount(answer);
                const isOverLimit = wordCount > 3;
                const isChecked = checkedQuestions[q.id] || (isSubmitted && mode === 'test');
                const isCorrect = isChecked ? checkAnswerCorrectness(q, answer) : false;
                const isFlagged = flaggedQuestions.has(q.id);
                const showExplanation = openExplanations[q.id] || (isSubmitted && mode === 'test');
                const showTip = openTips[q.id];

                return (
                  <div
                    key={q.id}
                    id={`question-card-${q.id}`}
                    data-question-id={q.id}
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isChecked
                        ? isCorrect
                          ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200'
                          : 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Card Header: Number, Prompt, and Flag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="shrink-0 w-6 h-6 rounded bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          {q.questionNumber}
                        </span>
                        <div className="flex-1">
                          <HighlightableText
                            text={q.prompt}
                            questionId={q.id}
                            highlights={highlights}
                            onRemoveHighlight={onRemoveHighlight || (() => {})}
                            className="text-sm font-semibold text-slate-900 leading-snug block"
                            as="p"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          id={`flag-q-${q.id}`}
                          onClick={() => onToggleFlag(q.id)}
                          title={isFlagged ? 'Remove flag' : 'Flag question for review'}
                          className={`p-1.5 rounded transition-colors ${
                            isFlagged
                              ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Question Specific Tip (Practice Mode) */}
                    {mode === 'practice' && q.tip && (
                      <div className="mt-2.5">
                        <button
                          id={`tip-btn-q-${q.id}`}
                          onClick={() => toggleTip(q.id)}
                          className="flex items-center space-x-1.5 text-xs text-blue-700 hover:text-blue-900 font-medium py-0.5 px-2 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>{showTip ? 'Hide Question Tip' : 'Show Question Tip'}</span>
                        </button>
                        {showTip && (
                          <div className="mt-1.5 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900 leading-relaxed animate-in fade-in space-y-1.5">
                            <div>
                              <span className="font-bold">Tip: </span>
                              <span>{q.tip}</span>
                            </div>
                            {q.tipVi && (
                              <div className="pt-1.5 border-t border-blue-200/60 text-slate-700">
                                <span className="font-semibold text-blue-900">Gợi ý làm bài: </span>
                                <span>{q.tipVi}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Input Field */}
                    <div className="mt-3">
                      <div className="relative">
                        <input
                          id={`input-q-${q.id}`}
                          type="text"
                          disabled={isSubmitted && mode === 'test'}
                          value={answer}
                          onChange={(e) => onAnswerChange(q.id, e.target.value)}
                          placeholder="Type NO MORE THAN THREE WORDS AND/OR A NUMBER..."
                          className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none transition-all ${
                            isChecked
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 font-medium'
                                : 'border-rose-500 bg-rose-50/30 text-rose-950 font-medium'
                              : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50/50 hover:bg-white text-slate-900'
                          }`}
                        />
                      </div>

                      {/* Word count feedback */}
                      <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-500">
                        <span>
                          Word count: <strong className={isOverLimit ? 'text-rose-600 font-bold' : 'text-slate-800'}>{wordCount}</strong> / 3 max
                        </span>
                        {isOverLimit && (
                          <span className="text-rose-600 font-semibold flex items-center space-x-1">
                            <Info className="w-3 h-3" />
                            <span>Warning: Exceeds 3-word limit!</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Practice Mode Controls & Feedback */}
                    {mode === 'practice' && (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                        <button
                          id={`check-btn-q-${q.id}`}
                          onClick={() => handleCheckQuestion(q.id)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Check Answer</span>
                        </button>

                        <button
                          id={`explain-btn-q-${q.id}`}
                          onClick={() => toggleExplanation(q.id)}
                          className="flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-semibold py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                        >
                          <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
                          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {/* Detailed Explanation & Paragraph Evidence Box */}
                    {showExplanation && (
                      <div className="mt-3 p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-slate-800 space-y-2.5 animate-in fade-in">
                        <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/70">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">Official Answer:</span>
                            <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300">
                              {q.officialAnswer}
                            </span>
                          </div>

                          <button
                            id={`locate-passage-q-${q.id}`}
                            onClick={() => onJumpToParagraph(q.paragraphRef)}
                            className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 font-semibold px-2 py-0.5 rounded bg-white hover:bg-blue-100/50 border border-blue-200 transition-colors"
                          >
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            <span>View in Passage</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-700">Passage Evidence: </span>
                          <span className="italic bg-yellow-100 px-1 py-0.5 rounded text-slate-900 font-serif">
                            "{q.paragraphQuote}"
                          </span>
                        </div>

                        <p className="text-slate-700 leading-relaxed font-sans pt-1">
                          <strong className="text-slate-900">Explanation: </strong>
                          {q.explanation}
                        </p>

                        {q.explanationVi && (
                          <div className="pt-2 border-t border-blue-200/60 mt-1.5 text-slate-700 leading-relaxed font-sans">
                            <span className="font-bold text-blue-950 block text-[11px] uppercase tracking-wider mb-0.5">
                              Giải thích chi tiết (Tiếng Việt):
                            </span>
                            <p className="text-slate-700">{q.explanationVi}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Post-Questions Consolidation Callout */}
        {onGoToConsolidation && (
          <div className="p-5 rounded-2xl bg-linear-to-br from-[#0F172A] to-slate-900 text-white shadow-lg border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Language & Reading Consolidation</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ready to Master Key Vocabulary & Grammar?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consolidate your learning with academic word lists, IELTS sentence structures, paraphrase analyses, and 4 interactive tasks based on The Dover Bronze-Age Boat.
            </p>
            <button
              id="questions-go-to-consolidation-btn"
              onClick={onGoToConsolidation}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Explore Consolidation Tab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
