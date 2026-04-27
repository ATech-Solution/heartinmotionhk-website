// Breakpoints: md = 768px (tablet start), lg = 1024px (desktop start)
export function visibilityClasses(
  showOnMobile = true,
  showOnTablet = true,
  showOnDesktop = true,
): string {
  if (!showOnMobile && !showOnTablet && !showOnDesktop) return 'hidden'
  const parts: string[] = [showOnMobile ? 'block' : 'hidden']
  if (showOnTablet !== showOnMobile) parts.push(showOnTablet ? 'md:block' : 'md:hidden')
  if (showOnDesktop !== showOnTablet) parts.push(showOnDesktop ? 'lg:block' : 'lg:hidden')
  return parts.join(' ')
}
