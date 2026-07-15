"use client"

import * as React from "react"
import { Check, FileText, Inbox } from "lucide-react"
import { toast } from "sonner"
import { ThemeProvider } from "next-themes"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Toaster } from "@/components/ui/sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { DirectionProvider } from "@/components/ui/direction"

// ─── Chart config ─────────────────────────────────────────────────────────────

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--primary)" },
} satisfies ChartConfig

const chartData = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
]

// ─── Catalog ──────────────────────────────────────────────────────────────────

export function Catalog() {
  const [calDate, setCalDate] = React.useState<Date | undefined>(undefined)

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <div className="grid gap-6">
          <header>
            <h2 className="text-xl font-semibold tracking-tight">
              Component catalog
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              All @tyohn/registry UI components under the active style scope.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {/* ── 1. Button ── */}
            <CatalogCard
              title="Button"
              description="Variants, sizes, icon button"
              className="col-span-2"
            >
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "default",
                    "secondary",
                    "outline",
                    "ghost",
                    "destructive",
                    "link",
                  ] as const
                ).map((v) => (
                  <Button key={v} variant={v}>
                    {v}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(["xs", "sm", "default", "lg"] as const).map((s) => (
                  <Button key={s} size={s} variant="outline">
                    {s}
                  </Button>
                ))}
                <Button size="icon" aria-label="Confirm">
                  <Check />
                </Button>
              </div>
            </CatalogCard>

            {/* ── 2. ButtonGroup ── */}
            <CatalogCard title="ButtonGroup">
              <ButtonGroup>
                <Button variant="outline">Bold</Button>
                <Button variant="outline">Italic</Button>
                <Button variant="outline">Underline</Button>
              </ButtonGroup>
              <ButtonGroup orientation="vertical" className="w-fit">
                <Button variant="outline" size="sm">
                  Top
                </Button>
                <Button variant="outline" size="sm">
                  Bottom
                </Button>
              </ButtonGroup>
            </CatalogCard>

            {/* ── 3. Badge ── */}
            <CatalogCard title="Badge" description="All variants">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "default",
                    "secondary",
                    "outline",
                    "destructive",
                    "ghost",
                  ] as const
                ).map((v) => (
                  <Badge key={v} variant={v}>
                    {v}
                  </Badge>
                ))}
              </div>
            </CatalogCard>

            {/* ── 4. Input / Label / Textarea / Checkbox / Switch / RadioGroup ── */}
            <CatalogCard title="Form controls" className="col-span-2">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="demo-input">Label + Input</Label>
                  <Input id="demo-input" placeholder="Placeholder" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="demo-textarea">Textarea</Label>
                  <Textarea
                    id="demo-textarea"
                    placeholder="Type something…"
                    rows={2}
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox defaultChecked id="demo-check" />
                    Checkbox
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Switch defaultChecked id="demo-switch" />
                    Switch
                  </label>
                </div>
                <RadioGroup defaultValue="a" className="flex gap-4">
                  {["a", "b", "c"].map((v) => (
                    <label
                      key={v}
                      className="flex cursor-pointer items-center gap-1.5 text-sm"
                    >
                      <RadioGroupItem value={v} id={`radio-${v}`} />
                      {v.toUpperCase()}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </CatalogCard>

            {/* ── 5. NativeSelect ── */}
            <CatalogCard title="NativeSelect">
              <NativeSelect>
                <NativeSelectOption value="apple">Apple</NativeSelectOption>
                <NativeSelectOption value="banana">Banana</NativeSelectOption>
                <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
              </NativeSelect>
            </CatalogCard>

            {/* ── 6. Select ── */}
            <CatalogCard title="Select">
              <Select defaultValue="apple">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="cherry">Cherry</SelectItem>
                  <SelectItem value="grape">Grape</SelectItem>
                </SelectContent>
              </Select>
            </CatalogCard>

            {/* ── 7. Combobox ── */}
            <CatalogCard title="Combobox" description="Searchable select">
              <Combobox>
                <ComboboxInput placeholder="Select framework…" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxEmpty>No results.</ComboboxEmpty>
                    <ComboboxItem value="react">React</ComboboxItem>
                    <ComboboxItem value="vue">Vue</ComboboxItem>
                    <ComboboxItem value="svelte">Svelte</ComboboxItem>
                    <ComboboxItem value="solid">Solid</ComboboxItem>
                    <ComboboxItem value="angular">Angular</ComboboxItem>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </CatalogCard>

            {/* ── 8. InputOTP ── */}
            <CatalogCard title="InputOTP" description="6-slot with separator">
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </CatalogCard>

            {/* ── 9. InputGroup ── */}
            <CatalogCard title="InputGroup" description="Inline addon + input">
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="example.com" />
              </InputGroup>
              <InputGroup>
                <InputGroupAddon align="inline-end">
                  <InputGroupText>.com</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="domain" />
              </InputGroup>
            </CatalogCard>

            {/* ── 10. Field ── */}
            <CatalogCard title="Field" description="FieldSet / FieldLabel / FieldDescription">
              <FieldSet className="gap-4">
                <Field>
                  <FieldLabel htmlFor="field-email">Email address</FieldLabel>
                  <Input
                    id="field-email"
                    type="email"
                    placeholder="you@example.com"
                  />
                  <FieldDescription>
                    We'll never share your email.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="field-name">Full name</FieldLabel>
                  <Input id="field-name" placeholder="Jane Doe" />
                </Field>
              </FieldSet>
            </CatalogCard>

            {/* ── 11. Slider ── */}
            <CatalogCard title="Slider">
              <Slider defaultValue={[40]} />
              <Slider defaultValue={[20, 70]} />
            </CatalogCard>

            {/* ── 12. Progress ── */}
            <CatalogCard title="Progress">
              <Progress value={60}>
                <ProgressLabel>Loading…</ProgressLabel>
                <ProgressValue />
              </Progress>
              <Progress value={85}>
                <ProgressLabel>Uploading</ProgressLabel>
                <ProgressValue />
              </Progress>
            </CatalogCard>

            {/* ── 13. Toggle + ToggleGroup ── */}
            <CatalogCard title="Toggle + ToggleGroup">
              <div className="flex flex-wrap gap-2">
                <Toggle>Default</Toggle>
                <Toggle variant="outline">Outline</Toggle>
                <Toggle defaultPressed>Pressed</Toggle>
              </div>
              <ToggleGroup>
                <ToggleGroupItem>B</ToggleGroupItem>
                <ToggleGroupItem>I</ToggleGroupItem>
                <ToggleGroupItem>U</ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup variant="outline" spacing={0}>
                <ToggleGroupItem>Left</ToggleGroupItem>
                <ToggleGroupItem>Center</ToggleGroupItem>
                <ToggleGroupItem>Right</ToggleGroupItem>
              </ToggleGroup>
            </CatalogCard>

            {/* ── 14. Calendar ── */}
            <CatalogCard title="Calendar" description="Single mode">
              <Calendar
                mode="single"
                selected={calDate}
                onSelect={(day) => setCalDate(day)}
                className="rounded-md border w-fit"
              />
            </CatalogCard>

            {/* ── 15. Alert ── */}
            <CatalogCard title="Alert" description="default + destructive">
              <Alert>
                <AlertTitle>Default alert</AlertTitle>
                <AlertDescription>
                  This is a default informational alert.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Destructive alert</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            </CatalogCard>

            {/* ── 16. Avatar ── */}
            <CatalogCard title="Avatar" description="Image, fallback, group">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="shadcn"
                  />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <AvatarGroup>
                  {["JD", "KL", "MN"].map((fb) => (
                    <Avatar key={fb}>
                      <AvatarFallback>{fb}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
              </div>
            </CatalogCard>

            {/* ── 17. Skeleton + Spinner + Kbd ── */}
            <CatalogCard title="Skeleton · Spinner · Kbd">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
              <div className="flex items-center gap-3">
                <Spinner className="size-5" />
                <span className="text-sm text-muted-foreground">Loading…</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Shift</Kbd>
                  <Kbd>P</Kbd>
                </KbdGroup>
              </div>
            </CatalogCard>

            {/* ── 18. Separator ── */}
            <CatalogCard title="Separator">
              <div className="flex flex-col gap-2 text-sm">
                <span>Above</span>
                <Separator />
                <span>Below</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>Left</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Right</span>
              </div>
            </CatalogCard>

            {/* ── 19. AspectRatio ── */}
            <CatalogCard
              title="AspectRatio"
              description="16:9 colored placeholder"
            >
              <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden">
                <div className="size-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  16 / 9
                </div>
              </AspectRatio>
            </CatalogCard>

            {/* ── 20. ScrollArea ── */}
            <CatalogCard title="ScrollArea" description="h-32 overflow list">
              <ScrollArea className="h-32 rounded-md border">
                <div className="p-3 grid gap-1">
                  {Array.from({ length: 20 }, (_, i) => (
                    <p key={i} className="text-sm">
                      Item {i + 1}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </CatalogCard>

            {/* ── 21. Table ── */}
            <CatalogCard title="Table" className="col-span-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Alice", role: "Admin", joined: "Jan 2024" },
                    { name: "Bob", role: "Editor", joined: "Mar 2024" },
                    { name: "Carol", role: "Viewer", joined: "Jun 2024" },
                  ].map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell className="text-right">{row.joined}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CatalogCard>

            {/* ── 22. Tabs ── */}
            <CatalogCard title="Tabs">
              <Tabs defaultValue="account">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="pt-3">
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings here.
                  </p>
                </TabsContent>
                <TabsContent value="password" className="pt-3">
                  <p className="text-sm text-muted-foreground">
                    Update your password.
                  </p>
                </TabsContent>
                <TabsContent value="billing" className="pt-3">
                  <p className="text-sm text-muted-foreground">
                    View billing and invoices.
                  </p>
                </TabsContent>
              </Tabs>
            </CatalogCard>

            {/* ── 23. Accordion ── */}
            <CatalogCard title="Accordion">
              <Accordion>
                <AccordionItem value="q1">
                  <AccordionTrigger>What is this?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground p-3">
                      This is an accordion item with some explanatory content.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>How does it work?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground p-3">
                      Click the trigger to expand or collapse the panel.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CatalogCard>

            {/* ── 24. Collapsible ── */}
            <CatalogCard title="Collapsible">
              <Collapsible className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Details</span>
                  <CollapsibleTrigger
                    render={<Button variant="ghost" size="xs" />}
                  >
                    Toggle
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                    Hidden content revealed by collapsible.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </CatalogCard>

            {/* ── 25. Dialog ── */}
            <CatalogCard title="Dialog">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" size="sm" />}>
                  Open Dialog
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="dlg-name">Name</Label>
                      <Input id="dlg-name" defaultValue="Jane Doe" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button size="sm">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CatalogCard>

            {/* ── 26. AlertDialog ── */}
            <CatalogCard title="AlertDialog">
              <AlertDialog>
                <AlertDialogTrigger
                  render={<Button variant="destructive" size="sm" />}
                >
                  Delete item
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your item.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CatalogCard>

            {/* ── 27. Sheet ── */}
            <CatalogCard title="Sheet" description="Side right">
              <Sheet>
                <SheetTrigger render={<Button variant="outline" size="sm" />}>
                  Open Sheet
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Sheet panel</SheetTitle>
                    <SheetDescription>
                      A panel that slides in from the right side.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 p-4 text-sm text-muted-foreground">
                    Sheet body content goes here.
                  </div>
                  <SheetFooter>
                    <Button size="sm">Save</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </CatalogCard>

            {/* ── 28. Drawer ── */}
            <CatalogCard title="Drawer">
              <Drawer>
                <DrawerTrigger render={<Button variant="outline" size="sm" />}>
                  Open Drawer
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Drawer title</DrawerTitle>
                    <DrawerDescription>
                      Drag or click outside to dismiss.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 text-sm text-muted-foreground">
                    Drawer body content.
                  </div>
                  <DrawerFooter>
                    <Button size="sm">Confirm</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </CatalogCard>

            {/* ── 29. Popover ── */}
            <CatalogCard title="Popover">
              <Popover>
                <PopoverTrigger
                  render={<Button variant="outline" size="sm" />}
                >
                  Open Popover
                </PopoverTrigger>
                <PopoverContent className="p-3 text-sm">
                  This is the popover content. You can put anything here.
                </PopoverContent>
              </Popover>
            </CatalogCard>

            {/* ── 30. HoverCard ── */}
            <CatalogCard title="HoverCard">
              <HoverCard>
                <HoverCardTrigger
                  render={<Button variant="link" size="sm" />}
                >
                  @tyohn
                </HoverCardTrigger>
                <HoverCardContent className="w-60 p-3">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>TY</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 text-sm">
                      <p className="font-medium">@tyohn</p>
                      <p className="text-muted-foreground text-xs">
                        Design engineer building component systems.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CatalogCard>

            {/* ── 31. Tooltip ── */}
            <CatalogCard title="Tooltip">
              <div className="flex gap-3">
                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="outline" size="sm" />}
                  >
                    Hover me
                  </TooltipTrigger>
                  <TooltipContent>This is a tooltip</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={<Button size="icon" aria-label="Check" />}
                  >
                    <Check />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Confirm</TooltipContent>
                </Tooltip>
              </div>
            </CatalogCard>

            {/* ── 32. DropdownMenu ── */}
            <CatalogCard title="DropdownMenu">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="sm" />}
                >
                  Options
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CatalogCard>

            {/* ── 33. ContextMenu ── */}
            <CatalogCard title="ContextMenu" description="Right-click the area">
              <ContextMenu>
                <ContextMenuTrigger className="flex h-20 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground select-none">
                  Right-click here
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Cut</ContextMenuItem>
                  <ContextMenuItem>Copy</ContextMenuItem>
                  <ContextMenuItem>Paste</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </CatalogCard>

            {/* ── 34. Menubar ── */}
            <CatalogCard title="Menubar">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>New</MenubarItem>
                    <MenubarItem>Open</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Save</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </CatalogCard>

            {/* ── 35. Breadcrumb ── */}
            <CatalogCard title="Breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </CatalogCard>

            {/* ── 36. Pagination ── */}
            <CatalogCard title="Pagination">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CatalogCard>

            {/* ── 37. NavigationMenu ── */}
            <CatalogCard title="NavigationMenu" className="col-span-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-64 gap-1 p-2">
                        <li>
                          <NavigationMenuLink
                            href="#"
                            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                          >
                            Studio
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink
                            href="#"
                            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                          >
                            CLI
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink
                            href="#"
                            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                          >
                            Registry
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className="inline-flex h-9 items-center px-3 text-sm"
                    >
                      Docs
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </CatalogCard>

            {/* ── 38. Empty ── */}
            <CatalogCard title="Empty">
              <Empty className="py-4">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Inbox className="size-8 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No messages</EmptyTitle>
                  <EmptyDescription>
                    Your inbox is empty for now.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CatalogCard>

            {/* ── 39. Item ── */}
            <CatalogCard title="Item" description="ItemGroup with 2 Items">
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <ItemTitle>First item</ItemTitle>
                    <ItemDescription>Supporting detail text</ItemDescription>
                  </ItemContent>
                </Item>
                <Item>
                  <ItemContent>
                    <ItemTitle>Second item</ItemTitle>
                    <ItemDescription>Another supporting detail</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CatalogCard>

            {/* ── 40. Carousel ── */}
            <CatalogCard
              title="Carousel"
              description="3 slides with prev/next"
              className="col-span-2"
            >
              <Carousel className="mx-12">
                <CarouselContent>
                  {[1, 2, 3].map((n) => (
                    <CarouselItem key={n} className="basis-1/3">
                      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-sm font-medium">
                        Slide {n}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CatalogCard>

            {/* ── 41. Resizable ── */}
            <CatalogCard
              title="Resizable"
              description="Horizontal 2 panels"
              className="col-span-2"
            >
              <ResizablePanelGroup
                orientation="horizontal"
                className="h-40 rounded-lg border"
              >
                <ResizablePanel defaultSize={50}>
                  <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                    Left panel
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                  <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                    Right panel
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </CatalogCard>

            {/* ── 42. Chart ── */}
            <CatalogCard
              title="Chart"
              description="Bar chart with ChartContainer"
              className="col-span-2"
            >
              <ChartContainer
                config={chartConfig}
                className="min-h-[160px] w-full"
              >
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CatalogCard>

            {/* ── 43. Sonner ── */}
            <CatalogCard
              title="Sonner"
              description="Toast notifications via sonner"
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Studio toast 🎨")}
                >
                  Default
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.success("Changes saved successfully!")
                  }
                >
                  Success
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.error("Something went wrong.")}
                >
                  Error
                </Button>
              </div>
            </CatalogCard>

            {/* ── 44. Card density ── */}
            <CatalogCard title="Card" description="Size variants">
              <Card size="sm">
                <CardHeader>
                  <CardTitle>Small card</CardTitle>
                  <CardDescription>
                    Compact spacing for dense layouts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="xs" variant="outline">
                      Inspect
                    </Button>
                    <Button size="xs" variant="ghost">
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CatalogCard>

            {/* ── 45. Sidebar ── */}
            <CatalogCard
              title="Sidebar"
              description="Boxed collapsible=none demo"
              className="col-span-2"
            >
              <SidebarProvider
                className="!min-h-0 h-56 overflow-hidden rounded-lg border"
                style={{ minHeight: 0 }}
              >
                <Sidebar collapsible="none">
                  <SidebarHeader className="px-3 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Navigation
                    </span>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Settings</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Reports</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                </Sidebar>
                <SidebarInset>
                  <div className="flex items-center gap-2 border-b px-3 py-2">
                    <SidebarTrigger />
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                  <div className="p-4 text-sm text-muted-foreground">
                    Main content area.
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </CatalogCard>

            {/* ── 46. Bubble + Message ── */}
            <CatalogCard title="Bubble + Message" description="Chat-style demo">
              <MessageGroup className="gap-3">
                <Message align="start">
                  <MessageAvatar className="size-7 text-xs">
                    <span>A</span>
                  </MessageAvatar>
                  <MessageContent className="ml-2">
                    <BubbleGroup>
                      <Bubble variant="muted">
                        <BubbleContent className="px-3 py-2 text-sm">
                          Hello! How can I help?
                        </BubbleContent>
                      </Bubble>
                    </BubbleGroup>
                  </MessageContent>
                </Message>
                <Message align="end">
                  <MessageContent className="mr-2 items-end">
                    <BubbleGroup>
                      <Bubble variant="default" align="end">
                        <BubbleContent className="px-3 py-2 text-sm">
                          Looking good 🎨
                        </BubbleContent>
                      </Bubble>
                    </BubbleGroup>
                  </MessageContent>
                </Message>
              </MessageGroup>
            </CatalogCard>

            {/* ── 47. Attachment ── */}
            <CatalogCard title="Attachment" description="idle + done chips">
              <div className="flex flex-wrap gap-2">
                <Attachment state="idle" className="max-w-xs">
                  <AttachmentMedia variant="icon">
                    <FileText className="size-4" />
                  </AttachmentMedia>
                  <AttachmentContent className="px-2 py-1.5">
                    <AttachmentTitle>proposal.pdf</AttachmentTitle>
                    <AttachmentDescription>Idle · 840 KB</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
                <Attachment state="done" className="max-w-xs">
                  <AttachmentMedia variant="icon">
                    <Check className="size-4" />
                  </AttachmentMedia>
                  <AttachmentContent className="px-2 py-1.5">
                    <AttachmentTitle>report.docx</AttachmentTitle>
                    <AttachmentDescription>Done · 1.2 MB</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              </div>
            </CatalogCard>

            {/* ── 48. Marker ── */}
            <CatalogCard title="Marker" description="Separator row variants">
              <div className="grid gap-4">
                <Marker>
                  <MarkerIcon>•</MarkerIcon>
                  <MarkerContent className="text-xs text-muted-foreground ml-2">
                    Today
                  </MarkerContent>
                </Marker>
                <Marker variant="separator">
                  <MarkerContent className="text-xs text-muted-foreground bg-background px-2">
                    New messages
                  </MarkerContent>
                </Marker>
              </div>
            </CatalogCard>

            {/* ── 49. MessageScroller ── */}
            <CatalogCard
              title="MessageScroller"
              description="Provider + Scroller + 3 Items"
            >
              <MessageScrollerProvider>
                <MessageScroller className="h-40 rounded-md border">
                  <MessageScrollerViewport>
                    <MessageScrollerContent className="gap-px p-2">
                      {Array.from({ length: 8 }, (_, i) => (
                        <MessageScrollerItem
                          key={i}
                          scrollAnchor={i === 7}
                        >
                          <div className="rounded px-2 py-1 text-sm">
                            Message {i + 1}
                          </div>
                        </MessageScrollerItem>
                      ))}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                </MessageScroller>
              </MessageScrollerProvider>
            </CatalogCard>

            {/* ── 50. Direction ── */}
            <CatalogCard
              title="Direction"
              description="DirectionProvider rtl wrapping Breadcrumb"
            >
              <p className="text-xs text-muted-foreground">
                RTL scope — separators and icons flip:
              </p>
              <DirectionProvider direction="rtl">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">الرئيسية</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">المكونات</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>الاتجاه</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </DirectionProvider>
            </CatalogCard>
          </div>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}

// ─── CatalogCard helper ────────────────────────────────────────────────────────

function CatalogCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
    </Card>
  )
}
