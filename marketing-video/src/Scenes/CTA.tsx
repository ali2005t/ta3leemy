import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const CTA = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        fps,
        frame,
        config: { damping: 100 },
    });

    const urlOpacity = spring({
        fps,
        frame: frame - 30,
        config: { damping: 200 }
    });

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <h1 style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '120px',
                fontWeight: '900',
                marginBottom: '40px',
                transform: `scale(${scale})`,
                color: '#4F46E5',
                textTransform: 'uppercase'
            }}>
                Join Now
            </h1>

            <div style={{
                marginTop: '20px',
                padding: '20px 60px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50px',
                border: '2px solid rgba(255,255,255,0.2)',
                opacity: urlOpacity,
                transform: `translateY(${(1 - urlOpacity) * 20}px)`
            }}>
                <h2 style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '60px',
                    fontWeight: '300',
                    letterSpacing: '2px',
                    color: '#38bdf8'
                }}>
                    https://ta3leemy.online/
                </h2>
            </div>
        </AbsoluteFill>
    );
};
