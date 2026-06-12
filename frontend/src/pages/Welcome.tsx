const version: string = import.meta.env.VITE_APP_VERSION ?? '';

export default function Welcome() {
  return (
    <main>
      <h1>Expense Tracker{version ? ` v${version}` : ''}</h1>
    </main>
  );
}
