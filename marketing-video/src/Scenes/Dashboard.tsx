import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

export const Dashboard = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const barHeight = spring({
        fps,
        frame,
        config: { damping: 10, stiffness: 100 }
    });

    const data = [40, 70, 50, 90, 60, 80, 100];

    return (
        <AbsoluteFill style={{
            background: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', color: '#1e293b', marginBottom: '50px' }}>
                📊 إحصائيات دقيقة وشاملة
            </h2>

            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '20px',
                height: '400px',
                borderBottom: '4px solid #cbd5e1',
                paddingBottom: '10px'
            }}>
                {data.map((h, i) => (
                    <div key={i} style={{
                        width: '60px',
                        height: `${h * 4}px`,
                        background: i === 6 ? '#22c55e' : '#4F46E5',
                        borderRadius: '10px 10px 0 0',
                        transform: `scaleY(${barHeight})`,
                        transformOrigin: 'bottom'
                    }} />
                ))}
            </div>
        </AbsoluteFill>
    );
};
