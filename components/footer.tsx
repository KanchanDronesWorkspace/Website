"use client";
export function Footer() {
  const currentYear = new Date().getFullYear();
  const EMAIL_ADDRESS = "info@kanchandrones.com"

  return (
    <footer className="pt-2 pb-12 overflow-hidden  border-t border-white/5">
      <div className="w-full">
        <div className="relative mb-8 pt-12">
          <h2 className="text-[11vw] font-footer text-white/[0.1] uppercase leading-none  text-center whitespace-nowrap select-none">
            KANCHAN DRONES
          </h2>
        </div>

        <div className=" flex-col md:flex-row gap-4">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] text-center">
            © {currentYear} Kanchan Drones |{" "}
            <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a> |
            All rights reserved | Made in India
          </div>
        </div>
      </div>
    </footer>
  );
}
