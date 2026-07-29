import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Architecture } from "@/components/landing/architecture";
import { Workflow } from "@/components/landing/Workflow";
import { CTA } from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <Features />
      <Architecture />
      <Workflow />
      <CTA />
    </Container>
  );
}