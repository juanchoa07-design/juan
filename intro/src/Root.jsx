import { Composition, registerRoot } from 'remotion';
import { Intro } from './Intro';

export const RemotionRoot = () => {
  return (
    <Composition
      id="Intro"
      component={Intro}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

registerRoot(RemotionRoot);
