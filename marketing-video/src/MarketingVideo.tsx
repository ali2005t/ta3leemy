import { AbsoluteFill, Sequence } from 'remotion';
import { Intro } from './Scenes/Intro';
import { ProblemSolution } from './Scenes/ProblemSolution';
import { Showcase } from './Scenes/Showcase';
import { CTA } from './Scenes/CTA';

export const MarketingVideo = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'white' }}>
            {/* 0s -> 3s: Intro */}
            <Sequence from={0} durationInFrames={90}>
                <Intro />
            </Sequence>

            {/* 3s -> 7s: Problem/Solution */}
            <Sequence from={90} durationInFrames={120}>
                <ProblemSolution />
            </Sequence>

            {/* 7s -> 12s: Showcase */}
            <Sequence from={210} durationInFrames={150}>
                <Showcase />
            </Sequence>

            {/* 12s -> 15s: CTA */}
            <Sequence from={360} durationInFrames={90}>
                <CTA />
            </Sequence>
        </AbsoluteFill>
    );
};
