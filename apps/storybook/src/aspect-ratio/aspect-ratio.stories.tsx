import type { Meta, StoryObj } from "@storybook/react-vite"

import { AspectRatio } from "@workspace/ui/components/aspect-ratio"

/*
 * One story per section of aspect-ratio.mdx, in the order of the shadcn/ui
 * page. The shadcn examples use the Next.js `Image` with `fill`; here a plain
 * <img> with `absolute inset-0 size-full` does the same. The image is the
 * brand logo from `brand/` (the Storybook serves it at the root): it is
 * horizontal, so the wide examples use `object-contain` and the narrow ones
 * (square and portrait) use `object-cover object-left` to show its start.
 */
// No `component` here: `ratio` is required, and the stories have no `args`.
const meta = {
  title: "Componentes/Aspect Ratio",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <AspectRatio
      ratio={16 / 9}
      className="w-full max-w-sm rounded-2xl bg-muted"
    >
      <img
        src="brainz-group-logo.svg"
        alt="Logo da Brainz Group"
        className="absolute inset-0 size-full rounded-2xl object-contain p-8"
      />
    </AspectRatio>
  ),
}

export const Quadrado: Story = {
  render: () => (
    <AspectRatio
      ratio={1 / 1}
      className="w-full max-w-[12rem] rounded-2xl bg-muted"
    >
      <img
        src="brainz-group-logo.svg"
        alt="Logo da Brainz Group"
        className="absolute inset-0 size-full rounded-2xl object-cover object-left p-4"
      />
    </AspectRatio>
  ),
}

export const Retrato: Story = {
  render: () => (
    <AspectRatio
      ratio={9 / 16}
      className="w-full max-w-[10rem] rounded-2xl bg-muted"
    >
      <img
        src="brainz-group-logo.svg"
        alt="Logo da Brainz Group"
        className="absolute inset-0 size-full rounded-2xl object-cover object-left p-4"
      />
    </AspectRatio>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <figure dir="rtl" lang="ar" className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="rounded-2xl bg-muted">
        <img
          src="brainz-group-logo.svg"
          alt="شعار مجموعة برينز"
          className="absolute inset-0 size-full rounded-2xl object-contain p-8"
        />
      </AspectRatio>
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        الشعار الرسمي
      </figcaption>
    </figure>
  ),
}
