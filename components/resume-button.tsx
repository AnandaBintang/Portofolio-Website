import { Button, type ButtonProps } from "@/components/ui/button"
import { Download } from "lucide-react"
import { forwardRef } from "react"

interface ResumeButtonProps extends ButtonProps {
  showText?: boolean
  className?: string
}

const ResumeButton = forwardRef<HTMLButtonElement, ResumeButtonProps>(
  ({ showText = true, className = "", ...props }, ref) => {
    return (
      <Button ref={ref} className={className} asChild {...props}>
        <a href="/resume.pdf" download="Ananda_Bintang_Resume.pdf">
          <Download className={`h-4 w-4 ${showText ? "mr-2" : ""}`} />
          {showText && "Download Resume"}
        </a>
      </Button>
    )
  },
)

ResumeButton.displayName = "ResumeButton"

export { ResumeButton }
