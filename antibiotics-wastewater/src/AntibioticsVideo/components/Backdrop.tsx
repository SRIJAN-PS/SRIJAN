import { AbsoluteFill } from "remotion";

export const Backdrop: React.FC = () => {
  return (
    <AbsoluteFill
      name="Backdrop"
      style={{
        background:
          "radial-gradient(circle at 25% 15%, #143A55 0%, #0B2233 45%, #06121C 100%)",
      }}
    />
  );
};
