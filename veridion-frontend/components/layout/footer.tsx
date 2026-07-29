import Link from "next/link";
import { Container } from "./Container";
import { ShieldCheck} from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span>Veridion</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
              — AI Regulatory Version Intelligence
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </a>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              License
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Veridion. All rights reserved. Built with Next.js, LangGraph, and FastAPI.
        </div>
      </Container>
    </footer>
  );
}