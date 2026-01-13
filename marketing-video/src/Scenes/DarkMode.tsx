import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const DarkMode = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Toggle logic
    const isDark = frame > 45;

    return (
        <AbsoluteFill style={{
            background: isDark ? '#0f172a' : '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            transition: 'background 0.3s ease'
        }}>
            <h2 style={{
                fontFamily: 'Cairo',
                fontSize: '60px',
                marginBottom: '50px',
                color: isDark ? 'white' : '#1e293b'
            }}>
                🌗 الوضع الليلي
            </h2>

            <div style={{
                width: '120px',
                height: '60px',
                background: isDark ? '#4F46E5' : '#cbd5e1',
                borderRadius: '50px',
                padding: '5px',
                position: 'relative',
                cursor: 'pointer'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: isDark ? '65px' : '5px',
                    transition: 'left 0.3s ease',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }} />
            </div>

            <p style={{
                fontFamily: 'Cairo',
                fontSize: '30px',
                marginTop: '40px',
                color: isDark ? '#94a3b8' : '#64748b'
            }}>
                {isDark ? 'مريح للعين 👀' : 'مظهر أنيق ✨'}
            </p>
        </AbsoluteFill>
    );
};
