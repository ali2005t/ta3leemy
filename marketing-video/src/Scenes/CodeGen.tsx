import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const CodeGen = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = spring({
        fps,
        frame,
        config: { damping: 200 }
    });

    return (
        <AbsoluteFill style={{
            background: '#1e293b',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', marginBottom: '40px' }}>🔑 نظام توليد الأكواد</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                opacity
            }}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                        background: '#334155',
                        padding: '20px 40px',
                        borderRadius: '10px',
                        fontFamily: 'monospace',
                        fontSize: '30px',
                        border: '1px dashed #94a3b8'
                    }}>
                        X8Y2-K9L1-M4N5
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '40px',
                background: '#22c55e',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '50px',
                fontFamily: 'Cairo',
                fontSize: '30px',
                transform: `scale(${opacity})`
            }}>
                تم التوليد بنجاح ✅
            </div>
        </AbsoluteFill>
    );
};
