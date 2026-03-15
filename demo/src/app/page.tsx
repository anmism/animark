import fs from "fs";
import path from "path";
import { Animark } from "animark-react";

function readContent(filename: string) {
  return fs.readFileSync(
    path.join(process.cwd(), "src/content", filename),
    "utf-8"
  );
}

export default function Page() {
  const home = readContent("home.md");
  const docs = readContent("docs.md");

  return (
    <div className="page-layout">

      {/* ── Main ── */}
      <main className="main-content">

        {/* Home section */}
        <section id="intro" className="md-section">
          <Animark controls="above" controlsProps={{ showNavigation: true }}>
            {home}
          </Animark>
        </section>

        <div className="section-break" />

        {/* Docs section */}
        <section id="installation" className="md-section">
          <Animark controls="none">
            {docs}
          </Animark>
        </section>

      </main>
    </div>
  );
}
