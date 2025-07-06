type Props = {
  children: React.ReactNode;
};

export default function InnerLayout({ children }: Props) {
  return <main className="px-6 pb-6 pt-1">{children}</main>;
}
