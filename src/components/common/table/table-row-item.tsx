
type Props = {
    text: string;
}

export default function TableRowItem({ text }: Props) {
  return <p className="text-xs">{text}</p>
}