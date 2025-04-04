import dynamic from 'next/dynamic';

// Dynamically import to ensure client-side rendering
const YSUCalendarApp = dynamic(() => import('@/components/YSUCalendarApp'), { 
  ssr: false,
  loading: () => <div>Loading Calendar...</div>
});

export default function Home() {
  return (
    <main>
      <YSUCalendarApp />
    </main>
  );
}
