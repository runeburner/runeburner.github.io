import { Inspection } from "../Inspection/Inspection";
import { Canvas } from "../World/Canvas";

export const Page = (): React.ReactElement => {
  return (
    <>
      <Canvas className="w-full h-full" />
      <Inspection />
    </>
  );
};
