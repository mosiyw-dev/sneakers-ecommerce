import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/btn relative inline-flex shrink-0 items-center justify-center font-bold tracking-tight whitespace-nowrap outline-none select-none transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 disabled:scale-100 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-0.5 border border-primary/20",
        glow:
          "bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/50 hover:brightness-110 hover:-translate-y-0.5 border border-white/20",
        luxury:
          "bg-gradient-to-b from-neutral-900 to-neutral-950 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-950 shadow-md shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 border border-white/15 dark:border-black/10",
        secondary:
          "bg-secondary/90 text-secondary-foreground hover:bg-secondary hover:text-foreground border border-border/80 shadow-xs hover:border-border hover:-translate-y-0.2",
        outline:
          "border border-border/90 bg-background/60 backdrop-blur-md text-foreground hover:bg-muted hover:border-foreground/30 hover:shadow-sm hover:-translate-y-0.2",
        glass:
          "bg-background/40 hover:bg-background/70 backdrop-blur-xl border border-white/20 dark:border-white/10 text-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md shadow-destructive/25 hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/35 hover:-translate-y-0.5 border border-destructive/20",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto font-semibold active:scale-100",
      },
      size: {
        default: "h-10 gap-2 px-4 rounded-xl text-xs sm:text-sm",
        xs: "h-7 gap-1.5 px-2.5 rounded-lg text-[11px]",
        sm: "h-8 gap-1.5 px-3 rounded-xl text-xs",
        lg: "h-12 gap-2.5 px-6 rounded-2xl text-xs sm:text-sm font-extrabold",
        xl: "h-14 gap-3 px-8 rounded-2xl text-sm sm:text-base font-black shadow-lg",
        icon: "size-10 rounded-xl p-0 flex items-center justify-center",
        "icon-xs": "size-7 rounded-lg p-0 flex items-center justify-center [&_svg]:size-3.5",
        "icon-sm": "size-8 rounded-xl p-0 flex items-center justify-center [&_svg]:size-4",
        "icon-lg": "size-12 rounded-2xl p-0 flex items-center justify-center [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
