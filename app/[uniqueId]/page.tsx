import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    uniqueId: string;
  };
}

export default function UniqueIdPage({ params }: PageProps) {
  // Redirigir a la carta del menú
  redirect(`/${params.uniqueId}/menu`);
}
