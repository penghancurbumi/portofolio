import { cn } from "@/lib/utils"

export function VerifiedIcon({
  className = "",
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      className={cn("text-white dark:text-black", className)}
      aria-label="Verified account"
      role="img"
      {...props}
    >
      <defs>
        <linearGradient
          id="x_gold_paint0"
          x1="4"
          y1="1.5"
          x2="19.5"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="0.539" stopColor="#5b5b5b" />
          <stop offset="0.68" stopColor="#404040" />
          <stop offset="1" stopColor="#a4a4a4" />
        </linearGradient>
        <linearGradient
          id="x_gold_paint1"
          x1="5"
          y1="2.5"
          x2="17.5"
          y2="19.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f8f7f5" />
          <stop offset="0.406" stopColor="#807f7d" />
          <stop offset="0.989" stopColor="#424242" />
        </linearGradient>
      </defs>
      <g>
        {/* Layer 1: Bevel Gold Outer Base */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.596 3.011L11 .5 8.404 3.011l-3.576-.506-.624 3.558-3.19 1.692L2.6 11l-1.586 3.245 3.19 1.692.624 3.558 3.576-.506L11 21.5l2.596-2.511 3.576.506.624-3.558 3.19-1.692L19.4 11l1.586-3.245-3.19-1.692-.624-3.558-3.576.506z"
          fill="url(#x_gold_paint0)"
        />
        {/* Layer 2: Main Rich Gold Gradient Body */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.348 3.772L11 1.5 8.651 3.772l-3.235-.458-.565 3.219-2.886 1.531L3.4 11l-1.435 2.936 2.886 1.531.565 3.219 3.235-.458L11 20.5l2.348-2.272 3.236.458.564-3.219 2.887-1.531L18.6 11l1.435-2.936-2.887-1.531-.564-3.219-3.236.458z"
          fill="url(#x_gold_paint1)"
        />
        {/* Layer 3: Drop Shadow on Checkmark Edge */}
        <path
          d="M9.662 15.65 6.233 12.22l1.414-1.414 2.015 2.015 4.336-4.73 1.47 1.348-5.806 6.21z"
          fill="#666666"
        />
        {/* Layer 4: Bold Checkmark - follows the current text colour, so it is
            white on the light theme and black on the dark theme. */}
        <path
          d="M9.662 14.85 6.233 11.42l1.414-1.414 2.015 2.015 4.336-4.73 1.47 1.348-5.806 6.21z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
