import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  SaveIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@workspace/ui/components/menubar"

/*
 * One story per section of menubar.mdx, in the order of the shadcn/ui page.
 * The shadcn examples keep the checkbox and radio state in `useState`; here
 * the Base UI components own it (`defaultChecked`, `defaultValue`), so every
 * story is a plain JSX snippet.
 *
 * A closed menu is invisible to axe, so every story has a `play` that opens
 * one first (the test runs axe after `play`). `abrirMenu` finds the trigger
 * by role and name, waits for the menu (it is portaled to <body>, so it is
 * queried with `screen`) and for the enter animation to end, because axe would
 * measure contrast mid-fade. It can also move the highlight to an item: axe
 * only measures the highlighted state (`focus:bg-accent`) if it is on screen
 * when the test ends. Keys are vertical (ArrowDown, End) so the same play
 * works in RTL, where the horizontal arrows swap.
 */
const meta = {
  title: "Componentes/Menubar",
  component: Menubar,
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

async function abrirMenu(
  canvasElement: HTMLElement,
  gatilho: string,
  destacar?: "primeiro" | "ultimo"
) {
  const canvas = within(canvasElement)
  await userEvent.click(await canvas.findByRole("menuitem", { name: gatilho }))
  const menu = await screen.findByRole("menu")
  await Promise.allSettled(
    document.getAnimations().map((animation) => animation.finished)
  )
  await waitFor(() => expect(menu).toBeVisible())
  if (destacar) {
    await userEvent.keyboard(destacar === "ultimo" ? "{End}" : "{ArrowDown}")
    await waitFor(() => {
      const item = document.activeElement as HTMLElement
      expect(menu).toContainElement(item)
      expect(item).toHaveAttribute("data-highlighted")
    })
  }
  return menu
}

export const Demo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gatilho = await canvas.findByRole("menuitem", { name: "Arquivo" })

    // Opens by click, and the vertical arrows and Home walk the items
    // without leaving the menu.
    const menu = await abrirMenu(canvasElement, "Arquivo", "primeiro")
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(menu).toContainElement(document.activeElement as HTMLElement)
    )
    await userEvent.keyboard("{Home}")
    await waitFor(() =>
      expect(document.activeElement).toHaveTextContent("Nova aba")
    )

    // Esc closes it and gives the focus back to the trigger.
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(gatilho).toHaveFocus())

    // Opens again and stays open with an item highlighted, for axe.
    await abrirMenu(canvasElement, "Arquivo", "primeiro")
  },
  render: () => (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>Arquivo</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              Nova aba <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Nova janela <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>Nova janela anônima</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>Compartilhar</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem>Enviar link por e-mail</MenubarItem>
                  <MenubarItem>Mensagens</MenubarItem>
                  <MenubarItem>Notas</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              Imprimir... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Editar</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              Desfazer <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Refazer <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>Localizar</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem>Pesquisar na web</MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem>Localizar...</MenubarItem>
                  <MenubarItem>Localizar próximo</MenubarItem>
                  <MenubarItem>Localizar anterior</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>Recortar</MenubarItem>
            <MenubarItem>Copiar</MenubarItem>
            <MenubarItem>Colar</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Exibir</MenubarTrigger>
        <MenubarContent className="w-52">
          <MenubarGroup>
            <MenubarCheckboxItem>Barra de favoritos</MenubarCheckboxItem>
            <MenubarCheckboxItem defaultChecked>
              URLs completas
            </MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>
              Recarregar <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Forçar recarga <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Alternar tela cheia</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Ocultar barra lateral</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Perfis</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup defaultValue="beto">
            <MenubarRadioItem value="ana">Ana</MenubarRadioItem>
            <MenubarRadioItem value="beto">Beto</MenubarRadioItem>
            <MenubarRadioItem value="luis">Luís</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Editar...</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Adicionar perfil...</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const CaixaDeSelecao: Story = {
  name: "Caixa de seleção",
  play: async ({ canvasElement }) => {
    const menu = await abrirMenu(canvasElement, "Exibir", "primeiro")
    const marcado = within(menu).getByRole("menuitemcheckbox", {
      name: "Sempre mostrar URLs completas",
    })
    await expect(marcado).toHaveAttribute("aria-checked", "true")
  },
  render: () => (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>Exibir</MenubarTrigger>
        <MenubarContent className="w-72">
          <MenubarCheckboxItem>
            Sempre mostrar a barra de favoritos
          </MenubarCheckboxItem>
          <MenubarCheckboxItem defaultChecked>
            Sempre mostrar URLs completas
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Recarregar <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Forçar recarga <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Formatar</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem defaultChecked>Tachado</MenubarCheckboxItem>
          <MenubarCheckboxItem>Código</MenubarCheckboxItem>
          <MenubarCheckboxItem>Sobrescrito</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const Radio: Story = {
  play: async ({ canvasElement }) => {
    const menu = await abrirMenu(canvasElement, "Perfis", "primeiro")
    const marcado = within(menu).getByRole("menuitemradio", { name: "Beto" })
    await expect(marcado).toHaveAttribute("aria-checked", "true")
  },
  render: () => (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>Perfis</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup defaultValue="beto">
            <MenubarRadioItem value="ana">Ana</MenubarRadioItem>
            <MenubarRadioItem value="beto">Beto</MenubarRadioItem>
            <MenubarRadioItem value="luis">Luís</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Editar...</MenubarItem>
          <MenubarItem inset>Adicionar perfil...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Tema</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup defaultValue="sistema">
            <MenubarRadioItem value="claro">Claro</MenubarRadioItem>
            <MenubarRadioItem value="escuro">Escuro</MenubarRadioItem>
            <MenubarRadioItem value="sistema">Sistema</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const Submenu: Story = {
  play: async ({ canvasElement }) => {
    const menu = await abrirMenu(canvasElement, "Arquivo", "primeiro")
    const gatilhoSub = within(menu).getByRole("menuitem", {
      name: "Compartilhar",
    })
    await expect(gatilhoSub).toHaveAttribute("aria-haspopup", "menu")
  },
  render: () => (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>Arquivo</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Compartilhar</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Enviar link por e-mail</MenubarItem>
              <MenubarItem>Mensagens</MenubarItem>
              <MenubarItem>Notas</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Imprimir... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Editar</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Desfazer <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Refazer <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Localizar</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Localizar...</MenubarItem>
              <MenubarItem>Localizar próximo</MenubarItem>
              <MenubarItem>Localizar anterior</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Recortar</MenubarItem>
          <MenubarItem>Copiar</MenubarItem>
          <MenubarItem>Colar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const ComIcones: Story = {
  name: "Com ícones",
  play: async ({ canvasElement }) => {
    // The highlight goes to the destructive item: axe measures it in focus.
    const menu = await abrirMenu(canvasElement, "Mais", "ultimo")
    await expect(document.activeElement).toBe(
      within(menu).getByRole("menuitem", { name: "Excluir" })
    )
  },
  render: () => (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>Arquivo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileIcon aria-hidden="true" />
            Novo arquivo <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FolderIcon aria-hidden="true" />
            Abrir pasta
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <SaveIcon aria-hidden="true" />
            Salvar <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Mais</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <SettingsIcon aria-hidden="true" />
              Configurações
            </MenubarItem>
            <MenubarItem>
              <HelpCircleIcon aria-hidden="true" />
              Ajuda
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <TrashIcon aria-hidden="true" />
              Excluir
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  play: async ({ canvasElement }) => {
    await abrirMenu(canvasElement, "ملف", "primeiro")
  },
  render: () => (
    <div dir="rtl" lang="ar">
      <Menubar className="w-72" dir="rtl">
        <MenubarMenu>
          <MenubarTrigger>ملف</MenubarTrigger>
          <MenubarContent dir="rtl" lang="ar" align="end">
            <MenubarGroup>
              <MenubarItem>
                علامة تبويب جديدة <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                نافذة جديدة <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>نافذة التصفح المتخفي الجديدة</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarSub>
                <MenubarSubTrigger>مشاركة</MenubarSubTrigger>
                <MenubarSubContent dir="rtl" lang="ar">
                  <MenubarGroup>
                    <MenubarItem>رابط البريد الإلكتروني</MenubarItem>
                    <MenubarItem>الرسائل</MenubarItem>
                    <MenubarItem>الملاحظات</MenubarItem>
                  </MenubarGroup>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>
                طباعة... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>تعديل</MenubarTrigger>
          <MenubarContent dir="rtl" lang="ar" align="end">
            <MenubarGroup>
              <MenubarItem>
                تراجع <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                إعادة <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarSub>
                <MenubarSubTrigger>بحث</MenubarSubTrigger>
                <MenubarSubContent dir="rtl" lang="ar">
                  <MenubarGroup>
                    <MenubarItem>البحث على الويب</MenubarItem>
                  </MenubarGroup>
                  <MenubarSeparator />
                  <MenubarGroup>
                    <MenubarItem>بحث...</MenubarItem>
                    <MenubarItem>البحث التالي</MenubarItem>
                    <MenubarItem>البحث السابق</MenubarItem>
                  </MenubarGroup>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>قص</MenubarItem>
              <MenubarItem>نسخ</MenubarItem>
              <MenubarItem>لصق</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>عرض</MenubarTrigger>
          <MenubarContent className="w-52" dir="rtl" lang="ar" align="end">
            <MenubarGroup>
              <MenubarCheckboxItem>شريط الإشارات المرجعية</MenubarCheckboxItem>
              <MenubarCheckboxItem defaultChecked>
                عناوين URL الكاملة
              </MenubarCheckboxItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>
                إعادة تحميل <MenubarShortcut>⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled inset>
                إعادة تحميل قسري <MenubarShortcut>⇧⌘R</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>تبديل وضع ملء الشاشة</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>إخفاء الشريط الجانبي</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>الملفات الشخصية</MenubarTrigger>
          <MenubarContent dir="rtl" lang="ar" align="end">
            <MenubarRadioGroup defaultValue="benoit">
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>تعديل...</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>إضافة ملف شخصي...</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  ),
}
