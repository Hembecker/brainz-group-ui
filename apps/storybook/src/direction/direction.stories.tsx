import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { DirectionProvider } from "@workspace/ui/components/direction"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

/*
 * The shadcn/ui Direction page has one preview (its `card-rtl` example, in
 * Arabic) and two code blocks (`DirectionProvider` and `useDirection`), which
 * live in direction.mdx. So there is one story: the card in Arabic inside a
 * `DirectionProvider direction="rtl"`, with `dir` and `lang` on the wrapper
 * (the provider does not write the attribute). The preview already wraps every
 * story in a provider that follows the toolbar; this one makes the example
 * RTL on its own. Ids are prefixed with the story name.
 */
const meta = {
  title: "Componentes/Direction",
  component: DirectionProvider,
} satisfies Meta<typeof DirectionProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" lang="ar">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              <h3>تسجيل الدخول إلى حسابك</h3>
            </CardTitle>
            <CardDescription>
              أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
            </CardDescription>
            <CardAction>
              <Button variant="link">إنشاء حساب</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="demo-email">البريد الإلكتروني</Label>
                  <Input
                    id="demo-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="demo-senha">كلمة المرور</Label>
                    <a
                      href="#esqueci-a-senha"
                      className="ms-auto inline-block text-sm text-link underline underline-offset-4 hover:text-link-hover"
                    >
                      نسيت كلمة المرور؟
                    </a>
                  </div>
                  <Input id="demo-senha" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
            <Button variant="outline" className="w-full">
              تسجيل الدخول باستخدام Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DirectionProvider>
  ),
}
