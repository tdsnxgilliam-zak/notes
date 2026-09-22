import { useEffect, useRef, useState } from 'react';
import { useProject, resetProject } from './state/projectStore.js';
import TitleSlide from './slides/TitleSlide.jsx';
import OverviewSlide from './slides/OverviewSlide.jsx';
import GoalSlide from './slides/GoalSlide.jsx';
import { pushToFigma } from './figmaClient.js';

/**
 * App shell — slide tabs across the top, Figma-sized slide (1920x1080)
 * scaled to fit the viewport, and a "Push to Figma" sync action.
 */
export default function App() {
  const { project, dispatch } = useProject();
  const [active, setActive] = useState(0);
  const [sync, setSync] = useState({ state: 'idle', message: '' });
  const stageRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  // Slide list: title + overview + one tab per week.
  const slides = [
    { key: 'title', label: 'Title' },
    { key: 'overview', label: 'Overview' },
    ...project.weeks.map((w, i) => ({ key: w.id, label: w.eyebrow || `Week ${i + 1}` })),
  ];
  const activeSlide = slides[Math.min(active, slides.length - 1)];

  useEffect(() => {
    const fit = () => {
      if (!stageRef.current) return;
      const { clientWidth, clientHeight } = stageRef.current;
      setScale(Math.min(clientWidth / 1920, clientHeight / 1080) * 0.96);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const doSync = async () => {
    setSync({ state: 'busy', message: 'Pushing to Figma…' });
    try {
      const result = await pushToFigma(project);
      setSync({ state: 'ok', message: `Synced ${result.updated} node(s) at ${new Date().toLocaleTimeString()}` });
    } catch (err) {
      setSync({ state: 'error', message: err.message });
    }
  };

  return (
    <div className="app-shell">
      <div className="toolbar">
        <span className="toolbar-title">{project.docTitle}</span>
        <div className="slide-tabs">
          {slides.map((s, i) => (
            <button
              key={s.key}
              className={`slide-tab ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              {s.label}
            </button>
          ))}
          <button
            className="slide-tab"
            title="Add a weekly goal slide"
            onClick={() => {
              dispatch({ type: 'WEEK_ADD' });
              setActive(slides.length); // new slide becomes last
            }}
          >
            + Week
          </button>
        </div>
        <div className="spacer" />
        {sync.message && <span className={`sync-status ${sync.state}`}>{sync.message}</span>}
        <button
          className="btn small"
          onClick={() => {
            if (window.confirm('Reset everything back to the blank template?')) {
              resetProject(dispatch);
              setActive(0);
            }
          }}
        >
          Reset
        </button>
        <button className="btn primary small" disabled={sync.state === 'busy'} onClick={doSync}>
          {sync.state === 'busy' ? 'Syncing…' : 'Push to Figma'}
        </button>
      </div>

      <div className="stage" ref={stageRef}>
        <div
          className="slide-scaler"
          style={{ transform: `scale(${scale})`, width: 1920 * scale, height: 1080 * scale }}
        >
          <div className="slide">
            {activeSlide.key === 'title' && <TitleSlide />}
            {activeSlide.key === 'overview' && <OverviewSlide pageNum={2} />}
            {activeSlide.key !== 'title' && activeSlide.key !== 'overview' && (
              <GoalSlide
                week={project.weeks.find((w) => w.id === activeSlide.key)}
                pageNum={slides.findIndex((s) => s.key === activeSlide.key) + 1}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
