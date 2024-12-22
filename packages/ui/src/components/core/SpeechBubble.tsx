import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  point: 'right' | 'bottom' | 'none';
}

export const SpeechBubble = ({ children, point }: Props) => {
  return (
    <div className="relative max-w-[700px] text-center leading-[1.4em] my-10 mx-auto bg-white border-8 border-[#333] rounded-[30px] font-sans p-5 text-lg">
      {children}
      {point === 'right' && (
        <>
          <span className="absolute right-[-50px] top-[38px] border-[25px] border-solid border-[#333] border-t-transparent border-r-transparent"></span>
          <span className="absolute right-[-30px] top-[50px] border-[15px] border-solid border-white border-t-transparent border-r-transparent"></span>
        </>
      )}
      {point === 'bottom' && (
        <>
          <span className="absolute left-[100px] bottom-[-50px] border-[25px] border-solid border-[#333] border-b-transparent border-r-transparent"></span>
          <span className="absolute left-[108px] bottom-[-30px] border-[15px] border-solid border-white border-b-transparent border-r-transparent"></span>
        </>
      )}
    </div>
  );
};
