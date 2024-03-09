import { LoginButton } from './components/log-in';

export default function Page() {
  return (
    <main>
      <div className='flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10'>
        <LoginButton />
      </div>
    </main>
  );
}
