interface Props {
  text: string;
  color: string;
  size?: number;
}
export default function UserAvatar({ text, color, size = 36 }: Props) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}>
      {text}
    </div>
  );
}
