import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{"subjectId":"default","id":"default","attemptId":"default"}];
}

export default function Page({ params }: { params: any }) {
  return <ClientPage params={params} />;
}