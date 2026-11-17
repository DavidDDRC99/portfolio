import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-32">
      <p className="label">404 · no signal</p>
      <h1 className="mt-4 text-4xl font-light text-fog-50">This page doesn&apos;t exist.</h1>
      <Link href="/" className="mt-8 inline-block text-signal hover:underline">← Back to the index</Link>
    </Container>
  );
}
