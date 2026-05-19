import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const PURPLE = '#7c3aed';
const CYAN = '#06b6d4';
const BG = '#04070f';

function useSpring(frame, fps, delay = 0, config = {}) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 120, mass: 1, ...config },
  });
}

export const Intro = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo JL.
  const logoScale = useSpring(frame, fps, 0);
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Name
  const nameY = interpolate(
    useSpring(frame, fps, 30),
    [0, 1],
    [40, 0]
  );
  const nameOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' });

  // Title
  const titleY = interpolate(
    useSpring(frame, fps, 50),
    [0, 1],
    [30, 0]
  );
  const titleOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: 'clamp' });

  // Divider line
  const lineWidth = interpolate(frame, [60, 90], [0, 260], { extrapolateRight: 'clamp' });

  // Badge "Available for new projects"
  const badgeOpacity = interpolate(frame, [80, 95], [0, 1], { extrapolateRight: 'clamp' });
  const badgeY = interpolate(frame, [80, 95], [15, 0], { extrapolateRight: 'clamp' });

  // Fade out everything at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Particles (static decorative dots)
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: ((i * 137.5) % 100),
    y: ((i * 97.3) % 100),
    size: 1.5 + (i % 3),
    opacity: 0.15 + (i % 4) * 0.07,
    delay: i * 3,
  }));

  const glowPulse = interpolate(frame, [0, 60, 120], [0.5, 1, 0.5], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG, opacity: fadeOut, fontFamily: 'Inter, sans-serif' }}>

      {/* Grid background */}
      <AbsoluteFill style={{
        backgroundImage: `
          linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Aurora glow blobs */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(124,58,237,${0.18 * glowPulse}) 0%, transparent 70%)`,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
      <div style={{
        position: 'absolute',
        width: 400, height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)`,
        top: '30%', left: '65%',
        transform: 'translate(-50%, -50%)',
      }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: i % 2 === 0 ? PURPLE : CYAN,
          opacity: p.opacity * Math.max(0, interpolate(frame, [p.delay, p.delay + 20], [0, 1], { extrapolateRight: 'clamp' })),
        }} />
      ))}

      {/* Center content */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}>

        {/* Logo */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: '-2px',
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          background: `linear-gradient(135deg, ${PURPLE}, ${CYAN})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 32,
          lineHeight: 1,
        }}>
          JL.
        </div>

        {/* Name */}
        <div style={{
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: '-1.5px',
          color: '#ffffff',
          transform: `translateY(${nameY}px)`,
          opacity: nameOpacity,
          marginBottom: 4,
        }}>
          Juan Lagorio
        </div>

        {/* Divider */}
        <div style={{
          width: lineWidth,
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${PURPLE}, ${CYAN}, transparent)`,
          marginBottom: 16,
          marginTop: 16,
        }} />

        {/* Title */}
        <div style={{
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: '3px',
          color: '#94a3b8',
          textTransform: 'uppercase',
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          marginBottom: 32,
        }}>
          Full Stack AI Engineer
        </div>

        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          padding: '8px 18px',
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
          }} />
          <span style={{ fontSize: 14, color: '#e2e8f0', letterSpacing: '0.5px' }}>
            Available for new projects
          </span>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
