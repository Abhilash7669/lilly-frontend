import AuthenticatedLayout from "@/components/layout/authenticated-layout";

type Props = {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <AuthenticatedLayout>
      {children}
    </AuthenticatedLayout>
  )
}