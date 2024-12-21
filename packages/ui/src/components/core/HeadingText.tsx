interface Props {
  text: string;
}

export const HeadingText = ({ text }: Props) => {
  return <h1 className="text-3xl font-extrabold lg:text-6xl">{text}</h1>;
};
