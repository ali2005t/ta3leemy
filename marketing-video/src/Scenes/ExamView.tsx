import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const ExamView = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Simulate selection
    const selected = frame > 40;

    return (
        <AbsoluteFill style={{
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', color: '#334155', marginBottom: '40px' }}>📝 امتحانات إلكترونية</h2>

            <div style={{ width: '800px', textAlign: 'right' }}>
                <h3 style={{ fontFamily: 'Cairo', fontSize: '35px', marginBottom: '20px' }}>1. ما هي عاصمة مصر؟</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ padding: '20px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '25px', fontFamily: 'Cairo' }}>الإسكندرية</div>
                    <div style={{
                        padding: '20px',
                        border: '2px solid',
                        borderColor: selected ? '#22c55e' : '#e2e8f0',
                        background: selected ? '#dcfce7' : 'transparent',
                        borderRadius: '10px',
                        fontSize: '25px',
                        fontFamily: 'Cairo',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        القاهرة
                        {selected && <span>✅</span>}
                    </div>
                    <div style={{ padding: '20px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '25px', fontFamily: 'Cairo' }}>الأقصر</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
