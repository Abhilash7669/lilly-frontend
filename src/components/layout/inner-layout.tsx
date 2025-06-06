type Props = {
  children: React.ReactNode;
};

export default function InnerLayout({ children }: Props) {
  return <main className="p-6">{children}</main>;
}
