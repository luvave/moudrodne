interface Props {
  text: string;
}

export const DescriptionText = ({ text }: Props) => {
  return <p className="text-balance text-muted-foreground lg:text-lg">{text}</p>;
};
