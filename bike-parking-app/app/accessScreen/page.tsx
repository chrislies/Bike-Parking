import Link from "next/link";

export default function AccessScreen() {
  return (
    <div>
      <div className="flex items-center justify-center text-center h-screen">
        <div className="flex flex-col gap-5">
          <h1>Sign In Page</h1>
          <Link href="Map">Continue as Guest</Link>
        </div>
      </div>
    </div>
  );
}
