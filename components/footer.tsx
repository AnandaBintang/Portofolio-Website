import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-foreground/70">© {currentYear} Ananda Bintang. All rights reserved.</p>
          </div>

          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="#home" className="text-foreground/70 hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-foreground/70 hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-foreground/70 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
