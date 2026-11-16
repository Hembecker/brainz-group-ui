import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Slider } from "@workspace/ui/components/slider"
import { Switch } from "@workspace/ui/components/switch"
import { Textarea } from "@workspace/ui/components/textarea"

/*
 * One story per section of field.mdx, in the order of the shadcn/ui page.
 * Differences from the shadcn examples:
 * - Form (react-hook-form, TanStack Form, Formisch) is left out: those
 *   packages are not installed here.
 * - The option lists are written inline, with no constants, so "Show code"
 *   gives a snippet that can be pasted.
 * - Select: the shadcn example has a FieldLabel with no htmlFor and a trigger
 *   with no id, so the select had no accessible name; here they are linked.
 * - Slider: the thumbs take their name from the Slider's `aria-labelledby`
 *   (the FieldTitle), not from `aria-label`. The shadcn example keeps the
 *   value in useState to show it in the description. Stories are literal JSX,
 *   so the description is static.
 * - Field Group: the "Responses" and "Tasks" titles are FieldLegend inside
 *   the FieldSet, not a FieldLabel with no control.
 * - Checkbox: `defaultChecked` is on the Checkbox, not on the FieldLabel.
 * Ids are prefixed with the story name: the Docs page renders all stories in
 * the same document.
 */
const meta = {
  title: "Componentes/Field",
  component: Field,
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <form onSubmit={(event) => event.preventDefault()}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Forma de pagamento</FieldLegend>
            <FieldDescription>
              Todas as transações são seguras e criptografadas.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="demo-nome-cartao">
                  Nome no cartão
                </FieldLabel>
                <Input
                  id="demo-nome-cartao"
                  placeholder="Joana Lima"
                  autoComplete="cc-name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="demo-numero-cartao">
                  Número do cartão
                </FieldLabel>
                <Input
                  id="demo-numero-cartao"
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  required
                  aria-describedby="demo-numero-cartao-descricao"
                />
                <FieldDescription id="demo-numero-cartao-descricao">
                  Informe os 16 dígitos do cartão.
                </FieldDescription>
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="demo-mes">Mês</FieldLabel>
                  <Select
                    items={[
                      { label: "MM", value: null },
                      { label: "01", value: "01" },
                      { label: "02", value: "02" },
                      { label: "03", value: "03" },
                      { label: "04", value: "04" },
                      { label: "05", value: "05" },
                      { label: "06", value: "06" },
                      { label: "07", value: "07" },
                      { label: "08", value: "08" },
                      { label: "09", value: "09" },
                      { label: "10", value: "10" },
                      { label: "11", value: "11" },
                      { label: "12", value: "12" },
                    ]}
                  >
                    <SelectTrigger id="demo-mes">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={null}>MM</SelectItem>
                        <SelectItem value="01">01</SelectItem>
                        <SelectItem value="02">02</SelectItem>
                        <SelectItem value="03">03</SelectItem>
                        <SelectItem value="04">04</SelectItem>
                        <SelectItem value="05">05</SelectItem>
                        <SelectItem value="06">06</SelectItem>
                        <SelectItem value="07">07</SelectItem>
                        <SelectItem value="08">08</SelectItem>
                        <SelectItem value="09">09</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="11">11</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="demo-ano">Ano</FieldLabel>
                  <Select
                    items={[
                      { label: "AAAA", value: null },
                      { label: "2026", value: "2026" },
                      { label: "2027", value: "2027" },
                      { label: "2028", value: "2028" },
                      { label: "2029", value: "2029" },
                      { label: "2030", value: "2030" },
                      { label: "2031", value: "2031" },
                    ]}
                  >
                    <SelectTrigger id="demo-ano">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={null}>AAAA</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                        <SelectItem value="2030">2030</SelectItem>
                        <SelectItem value="2031">2031</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="demo-cvv">CVV</FieldLabel>
                  <Input
                    id="demo-cvv"
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Endereço de cobrança</FieldLegend>
            <FieldDescription>
              O endereço de cobrança associado à forma de pagamento.
            </FieldDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox id="demo-mesmo-endereco" defaultChecked />
                <FieldLabel htmlFor="demo-mesmo-endereco" className="font-normal">
                  Mesmo endereço de entrega
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="demo-comentarios">Comentários</FieldLabel>
                <Textarea
                  id="demo-comentarios"
                  placeholder="Adicione comentários, se quiser"
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Enviar</Button>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  ),
}

export const Entrada: Story = {
  name: "Input",
  render: () => (
    <FieldSet className="w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="input-usuario">Nome de usuário</FieldLabel>
          <Input
            id="input-usuario"
            type="text"
            placeholder="Joana Lima"
            autoComplete="username"
            aria-describedby="input-usuario-descricao"
          />
          <FieldDescription id="input-usuario-descricao">
            Escolha um nome de usuário único para a sua conta.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-senha">Senha</FieldLabel>
          <FieldDescription id="input-senha-descricao">
            Use pelo menos 8 caracteres.
          </FieldDescription>
          <Input
            id="input-senha"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-describedby="input-senha-descricao"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const AreaDeTexto: Story = {
  name: "Textarea",
  render: () => (
    <FieldSet className="w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="textarea-opiniao">Opinião</FieldLabel>
          <Textarea
            id="textarea-opiniao"
            placeholder="Sua opinião ajuda a melhorar o serviço..."
            rows={4}
            aria-describedby="textarea-opiniao-descricao"
          />
          <FieldDescription id="textarea-opiniao-descricao">
            Conte o que você achou do nosso serviço.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const Selecao: Story = {
  name: "Select",
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="select-departamento">Departamento</FieldLabel>
      <Select
        items={[
          { label: "Escolha o departamento", value: null },
          { label: "Engenharia", value: "engenharia" },
          { label: "Design", value: "design" },
          { label: "Marketing", value: "marketing" },
          { label: "Vendas", value: "vendas" },
          { label: "Suporte ao cliente", value: "suporte" },
          { label: "Recursos humanos", value: "rh" },
          { label: "Finanças", value: "financas" },
          { label: "Operações", value: "operacoes" },
        ]}
      >
        <SelectTrigger
          id="select-departamento"
          aria-describedby="select-departamento-descricao"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={null}>Escolha o departamento</SelectItem>
            <SelectItem value="engenharia">Engenharia</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="vendas">Vendas</SelectItem>
            <SelectItem value="suporte">Suporte ao cliente</SelectItem>
            <SelectItem value="rh">Recursos humanos</SelectItem>
            <SelectItem value="financas">Finanças</SelectItem>
            <SelectItem value="operacoes">Operações</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldDescription id="select-departamento-descricao">
        Escolha o seu departamento ou área de atuação.
      </FieldDescription>
    </Field>
  ),
}

export const Controle: Story = {
  name: "Slider",
  render: () => (
    <Field className="w-full max-w-xs">
      <FieldTitle id="slider-faixa-titulo">Faixa de preço</FieldTitle>
      <FieldDescription id="slider-faixa-descricao">
        Defina o orçamento, de R$ 0 a R$ 1.000.
      </FieldDescription>
      <Slider
        defaultValue={[200, 800]}
        max={1000}
        min={0}
        step={10}
        className="mt-2 w-full"
        aria-labelledby="slider-faixa-titulo"
        aria-describedby="slider-faixa-descricao"
      />
    </Field>
  ),
}

export const ConjuntoDeCampos: Story = {
  name: "Fieldset",
  render: () => (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Informações de endereço</FieldLegend>
      <FieldDescription>
        Precisamos do seu endereço para entregar o pedido.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fieldset-rua">Endereço</FieldLabel>
          <Input
            id="fieldset-rua"
            type="text"
            placeholder="Rua das Flores, 123"
            autoComplete="street-address"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="fieldset-cidade">Cidade</FieldLabel>
            <Input
              id="fieldset-cidade"
              type="text"
              placeholder="São Paulo"
              autoComplete="address-level2"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldset-cep">CEP</FieldLabel>
            <Input
              id="fieldset-cep"
              type="text"
              placeholder="01310-100"
              inputMode="numeric"
              autoComplete="postal-code"
            />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  ),
}

export const CaixaDeSelecao: Story = {
  name: "Checkbox",
  render: () => (
    <FieldGroup className="w-full max-w-xs">
      <FieldSet>
        <FieldLegend variant="label">
          Mostrar estes itens na área de trabalho
        </FieldLegend>
        <FieldDescription>
          Escolha os itens que você quer ver na área de trabalho.
        </FieldDescription>
        <FieldGroup className="gap-3">
          <Field orientation="horizontal">
            <Checkbox id="checkbox-discos-rigidos" defaultChecked />
            <FieldLabel htmlFor="checkbox-discos-rigidos" className="font-normal">
              Discos rígidos
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="checkbox-discos-externos" />
            <FieldLabel
              htmlFor="checkbox-discos-externos"
              className="font-normal"
            >
              Discos externos
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="checkbox-cds-dvds" />
            <FieldLabel htmlFor="checkbox-cds-dvds" className="font-normal">
              CDs, DVDs e players de música
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="checkbox-servidores" />
            <FieldLabel htmlFor="checkbox-servidores" className="font-normal">
              Servidores conectados
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <Field orientation="horizontal">
        <Checkbox
          id="checkbox-sincronizar"
          defaultChecked
          aria-describedby="checkbox-sincronizar-descricao"
        />
        <FieldContent>
          <FieldLabel htmlFor="checkbox-sincronizar">
            Sincronizar as pastas Mesa e Documentos
          </FieldLabel>
          <FieldDescription id="checkbox-sincronizar-descricao">
            As suas pastas Mesa e Documentos estão sincronizadas com a nuvem.
            Você pode acessá-las de outros dispositivos.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
}

export const Radio: Story = {
  render: () => (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label" id="radio-plano-legenda">
        Plano de assinatura
      </FieldLegend>
      <FieldDescription>
        Os planos anual e vitalício dão um desconto grande.
      </FieldDescription>
      <RadioGroup defaultValue="mensal" aria-labelledby="radio-plano-legenda">
        <Field orientation="horizontal">
          <RadioGroupItem value="mensal" id="radio-plano-mensal" />
          <FieldLabel htmlFor="radio-plano-mensal" className="font-normal">
            Mensal (R$ 49,90 por mês)
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="anual" id="radio-plano-anual" />
          <FieldLabel htmlFor="radio-plano-anual" className="font-normal">
            Anual (R$ 499,90 por ano)
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="vitalicio" id="radio-plano-vitalicio" />
          <FieldLabel htmlFor="radio-plano-vitalicio" className="font-normal">
            Vitalício (R$ 1.499,90)
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  ),
}

export const Interruptor: Story = {
  name: "Switch",
  render: () => (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="switch-2fa">Autenticação em dois fatores</FieldLabel>
      <Switch id="switch-2fa" />
    </Field>
  ),
}

export const CartaoDeEscolha: Story = {
  name: "Choice Card",
  render: () => (
    <FieldGroup className="w-full max-w-xs">
      <FieldSet>
        <FieldLegend variant="label" id="choice-card-ambiente-legenda">
          Ambiente de computação
        </FieldLegend>
        <FieldDescription>
          Escolha o ambiente de computação do seu cluster.
        </FieldDescription>
        <RadioGroup
          defaultValue="kubernetes"
          aria-labelledby="choice-card-ambiente-legenda"
        >
          <FieldLabel htmlFor="choice-card-kubernetes">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Kubernetes</FieldTitle>
                <FieldDescription>
                  Execute cargas de trabalho de GPU num cluster K8s.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="kubernetes" id="choice-card-kubernetes" />
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="choice-card-vm">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Máquina virtual</FieldTitle>
                <FieldDescription>
                  Acesse um cluster para executar cargas de trabalho de GPU.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="vm" id="choice-card-vm" />
            </Field>
          </FieldLabel>
        </RadioGroup>
      </FieldSet>
    </FieldGroup>
  ),
}

export const GrupoDeCampos: Story = {
  name: "Field Group",
  render: () => (
    <FieldGroup className="w-full max-w-xs">
      <FieldSet>
        <FieldLegend variant="label">Respostas</FieldLegend>
        <FieldDescription>
          Receba um aviso quando uma resposta demorar, como uma pesquisa ou a
          geração de uma imagem.
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field orientation="horizontal" data-disabled>
            <Checkbox id="grupo-push" defaultChecked disabled />
            <FieldLabel htmlFor="grupo-push" className="font-normal">
              Notificações push
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <FieldSet>
        <FieldLegend variant="label">Tarefas</FieldLegend>
        <FieldDescription>
          Receba um aviso quando as tarefas que você criou tiverem novidades.{" "}
          <a href="#gerenciar-tarefas">Gerenciar tarefas</a>
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field orientation="horizontal">
            <Checkbox id="grupo-push-tarefas" />
            <FieldLabel htmlFor="grupo-push-tarefas" className="font-normal">
              Notificações push
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="grupo-email-tarefas" />
            <FieldLabel htmlFor="grupo-email-tarefas" className="font-normal">
              Notificações por e-mail
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  ),
}

export const Rtl: Story = {
  name: "RTL",
  render: () => (
    <div dir="rtl" lang="ar" className="w-full max-w-md">
      <form onSubmit={(event) => event.preventDefault()}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>طريقة الدفع</FieldLegend>
            <FieldDescription>جميع المعاملات آمنة ومشفرة</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="rtl-nome-cartao">
                  الاسم على البطاقة
                </FieldLabel>
                <Input
                  id="rtl-nome-cartao"
                  placeholder="Evil Rabbit"
                  autoComplete="cc-name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="rtl-numero-cartao">رقم البطاقة</FieldLabel>
                <Input
                  id="rtl-numero-cartao"
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  dir="ltr"
                  required
                  aria-describedby="rtl-numero-cartao-descricao"
                />
                <FieldDescription id="rtl-numero-cartao-descricao">
                  أدخل رقم البطاقة المكون من 16 رقمًا
                </FieldDescription>
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="rtl-mes">الشهر</FieldLabel>
                  <Select
                    items={[
                      { label: "ش.ش", value: null },
                      { label: "٠١", value: "01" },
                      { label: "٠٢", value: "02" },
                      { label: "٠٣", value: "03" },
                      { label: "٠٤", value: "04" },
                      { label: "٠٥", value: "05" },
                      { label: "٠٦", value: "06" },
                      { label: "٠٧", value: "07" },
                      { label: "٠٨", value: "08" },
                      { label: "٠٩", value: "09" },
                      { label: "١٠", value: "10" },
                      { label: "١١", value: "11" },
                      { label: "١٢", value: "12" },
                    ]}
                  >
                    <SelectTrigger id="rtl-mes">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl" lang="ar">
                      <SelectGroup>
                        <SelectItem value={null}>ش.ش</SelectItem>
                        <SelectItem value="01">٠١</SelectItem>
                        <SelectItem value="02">٠٢</SelectItem>
                        <SelectItem value="03">٠٣</SelectItem>
                        <SelectItem value="04">٠٤</SelectItem>
                        <SelectItem value="05">٠٥</SelectItem>
                        <SelectItem value="06">٠٦</SelectItem>
                        <SelectItem value="07">٠٧</SelectItem>
                        <SelectItem value="08">٠٨</SelectItem>
                        <SelectItem value="09">٠٩</SelectItem>
                        <SelectItem value="10">١٠</SelectItem>
                        <SelectItem value="11">١١</SelectItem>
                        <SelectItem value="12">١٢</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="rtl-ano">السنة</FieldLabel>
                  <Select
                    items={[
                      { label: "YYYY", value: null },
                      { label: "2026", value: "2026" },
                      { label: "2027", value: "2027" },
                      { label: "2028", value: "2028" },
                      { label: "2029", value: "2029" },
                      { label: "2030", value: "2030" },
                      { label: "2031", value: "2031" },
                    ]}
                  >
                    <SelectTrigger id="rtl-ano">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl" lang="ar">
                      <SelectGroup>
                        <SelectItem value={null}>YYYY</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                        <SelectItem value="2030">2030</SelectItem>
                        <SelectItem value="2031">2031</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="rtl-cvv">CVV</FieldLabel>
                  <Input
                    id="rtl-cvv"
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    dir="ltr"
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>عنوان الفوترة</FieldLegend>
            <FieldDescription>
              عنوان الفوترة المرتبط بطريقة الدفع الخاصة بك
            </FieldDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox id="rtl-mesmo-endereco" defaultChecked />
                <FieldLabel htmlFor="rtl-mesmo-endereco" className="font-normal">
                  نفس عنوان الشحن
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="rtl-comentarios">تعليقات</FieldLabel>
                <Textarea
                  id="rtl-comentarios"
                  placeholder="أضف أي تعليقات إضافية"
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">إرسال</Button>
            <Button variant="outline" type="button">
              إلغاء
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  ),
}

export const LayoutResponsivo: Story = {
  name: "Layout responsivo",
  render: () => (
    <div className="w-full max-w-lg">
      <form onSubmit={(event) => event.preventDefault()}>
        <FieldSet>
          <FieldLegend>Perfil</FieldLegend>
          <FieldDescription>Preencha os dados do seu perfil.</FieldDescription>
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="responsivo-nome">Nome</FieldLabel>
                <FieldDescription id="responsivo-nome-descricao">
                  Informe o nome completo, para identificação.
                </FieldDescription>
              </FieldContent>
              <Input
                id="responsivo-nome"
                placeholder="Joana Lima"
                autoComplete="name"
                required
                aria-describedby="responsivo-nome-descricao"
              />
            </Field>
            <Field orientation="responsive">
              <Button type="submit">Enviar</Button>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  ),
}

export const ValidacaoEErros: Story = {
  name: "Validação e erros",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The error is a live region with no `role="alert"`, ready for the text
    // to change, and it is the field's error message.
    const erro = canvasElement.querySelector("#validacao-email-erro")
    await expect(erro).toHaveAttribute("aria-live", "polite")
    await expect(erro).not.toHaveAttribute("role")
    await expect(canvas.getByLabelText("E-mail")).toHaveAttribute(
      "aria-errormessage",
      "validacao-email-erro"
    )

    // A valid field keeps its (empty) error region mounted, out of the flow.
    const vazio = canvasElement.querySelector("#validacao-usuario-erro")
    await expect(vazio).toBeInTheDocument()
    await expect(vazio).toHaveAttribute("aria-live", "polite")
    await expect(vazio).toBeEmptyDOMElement()
    await expect(vazio!.getBoundingClientRect().height).toBeLessThanOrEqual(1)

    // The red is only on the label and on the message: the Field itself
    // (and what inherits its color) stays in `foreground`.
    const campo = canvasElement.querySelector("[data-slot=field][data-invalid]")!
    const rotulo = canvasElement.querySelector(
      "[data-slot=field][data-invalid] [data-slot=field-label]"
    )!
    const cor = (elemento: Element) => getComputedStyle(elemento).color
    await expect(cor(rotulo)).toBe(cor(erro!))
    await expect(cor(campo)).not.toBe(cor(rotulo))
  },
  render: () => (
    <FieldGroup className="w-full max-w-xs">
      <Field data-invalid>
        <FieldLabel htmlFor="validacao-email">E-mail</FieldLabel>
        <Input
          id="validacao-email"
          type="email"
          defaultValue="joana@exemplo"
          autoComplete="email"
          aria-invalid
          aria-describedby="validacao-email-descricao validacao-email-erro"
          aria-errormessage="validacao-email-erro"
        />
        <FieldDescription id="validacao-email-descricao">
          Vamos enviar as novidades para este endereço.
        </FieldDescription>
        <FieldError id="validacao-email-erro">
          Informe um e-mail completo, como nome@exemplo.com.
        </FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="validacao-usuario">Nome de usuário</FieldLabel>
        <Input
          id="validacao-usuario"
          autoComplete="username"
          aria-describedby="validacao-usuario-erro"
        />
        {/* Sem erro: a região continua montada, vazia, e só o texto muda. */}
        <FieldError id="validacao-usuario-erro" />
      </Field>
    </FieldGroup>
  ),
}
