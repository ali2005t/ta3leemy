import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const ProblemSolution = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacityProblem = spring({
        fps,
        frame,
        config: { damping: 200 },
    });

    const opacitySolution = spring({
        fps,
        frame: frame - 60, // Start after 2 seconds
        config: { damping: 200 },
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: '#1e293b',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            {frame < 60 ? (
                <h2 style={{
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '70px',
                    opacity: opacityProblem,
                    textAlign: 'center'
                }}>
                    هل تعاني من صعوبة إدارة الطلاب؟ 🤔
                </h2>
            ) : (
                <h2 style={{
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '80px',
                    fontWeight: 'bold',
                    color: '#4F46E5',
                    opacity: opacitySolution,
                    textAlign: 'center',
                    transform: `scale(${1 + opacitySolution * 0.1})`
                }}>
                    ✨ منصة تعليمي هي الحل!
                </h2>
            )}
        </AbsoluteFill>
    );
};
