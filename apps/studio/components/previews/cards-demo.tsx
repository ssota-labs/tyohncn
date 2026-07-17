"use client"

import { Area, AreaChart, Line, LineChart } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { revenue: 10400, subscription: 40 },
  { revenue: 14405, subscription: 90 },
  { revenue: 9400, subscription: 200 },
  { revenue: 8200, subscription: 278 },
  { revenue: 7000, subscription: 89 },
  { revenue: 9600, subscription: 239 },
  { revenue: 11244, subscription: 78 },
  { revenue: 26475, subscription: 89 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--primary)" },
  subscription: { label: "Subscriptions", color: "var(--primary)" },
} satisfies ChartConfig

const plans = [
  {
    id: "starter",
    name: "Starter Plan",
    description: "Perfect for small businesses.",
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "More features and storage.",
  },
] as const

/**
 * tweakcn-style Cards composition.
 * Fixed-width columns in a horizontal track so the full desktop layout
 * scrolls sideways instead of crushing when the preview panel is narrow.
 */
export function CardsDemo() {
  return (
    <div className="flex w-max min-w-full gap-4 p-4 **:data-[slot=card]:shadow-none md:p-6">
      <div className="flex w-[520px] shrink-0 flex-col gap-4">
        <CardsStats />
        <CardsForms />
      </div>
      <div className="flex w-[380px] shrink-0 flex-col gap-4">
        <CardsCreateAccount />
        <CardsTeamMembers />
        <CardsCookieSettings />
      </div>
      <div className="flex w-[400px] shrink-0 flex-col gap-4">
        <CardsShare />
        <CardsReportIssue />
      </div>
    </div>
  )
}

function CardsStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-3xl">$15,231.89</CardTitle>
          <CardDescription>+20.1% from last month</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[90px] w-full"
            initialDimension={{ width: 220, height: 90 }}
          >
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                activeDot={{ r: 6 }}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Subscriptions</CardDescription>
          <CardTitle className="text-3xl">+2,350</CardTitle>
          <CardDescription>+180.1% from last month</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[90px] w-full"
            initialDimension={{ width: 220, height: 90 }}
          >
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <Area
                type="monotone"
                dataKey="subscription"
                stroke="var(--color-subscription)"
                fill="var(--color-subscription)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function CardsForms() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upgrade your subscription</CardTitle>
        <CardDescription>
          You are currently on the free plan. Upgrade to unlock every feature.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="card-name">Name</Label>
              <Input id="card-name" placeholder="Evil Rabbit" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="card-email">Email</Label>
              <Input id="card-email" placeholder="example@acme.com" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-number">Card Number</Label>
            <div className="grid grid-cols-[1fr_72px_56px] gap-2">
              <Input id="card-number" placeholder="1234 1234 1234 1234" />
              <Input id="card-expiry" placeholder="MM/YY" />
              <Input id="card-cvc" placeholder="CVC" />
            </div>
          </div>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium">Plan</legend>
            <RadioGroup defaultValue="starter" className="grid gap-3 sm:grid-cols-2">
              {plans.map((plan) => (
                <Label
                  key={plan.id}
                  className="flex items-start gap-3 rounded-lg border p-3 has-data-checked:border-ring has-data-checked:bg-input/20"
                >
                  <RadioGroupItem value={plan.id} id={plan.id} />
                  <div className="grid gap-1 font-normal">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-xs leading-snug text-muted-foreground">
                      {plan.description}
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-notes">Notes</Label>
            <Textarea id="card-notes" placeholder="Enter notes" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="font-normal">
                I agree to the terms and conditions
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="newsletter" defaultChecked />
              <Label htmlFor="newsletter" className="font-normal">
                Allow us to send you emails
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Upgrade Plan</Button>
      </CardFooter>
    </Card>
  )
}

function CardsCreateAccount() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline">GitHub</Button>
          <Button variant="outline">Google</Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="create-email">Email</Label>
          <Input id="create-email" type="email" placeholder="m@example.com" />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="create-password">Password</Label>
          <Input id="create-password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  )
}

function CardsTeamMembers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {[
          { name: "Sofia Davis", email: "m@example.com", role: "Owner", initials: "SD" },
          { name: "Jackson Lee", email: "p@example.com", role: "Member", initials: "JL" },
          { name: "Isabella Nguyen", email: "i@example.com", role: "Member", initials: "IN" },
        ].map((member) => (
          <div key={member.email} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar>
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 gap-0.5 text-sm">
                <div className="truncate font-medium">{member.name}</div>
                <div className="truncate text-muted-foreground">
                  {member.email}
                </div>
              </div>
            </div>
            <Badge variant="secondary">{member.role}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CardsShare() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>
          Anyone with the link can view this document.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            readOnly
            defaultValue="https://example.com/docs/123"
            className="min-w-0 flex-1"
          />
          <Button variant="secondary" className="shrink-0">
            Copy Link
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium">People with access</div>
          {[
            { name: "Olivia Martin", email: "m@example.com", initials: "OM" },
            { name: "Isabella Nguyen", email: "b@example.com", initials: "IN" },
          ].map((person) => (
            <div key={person.email} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 text-sm">
                  <span className="truncate font-medium">{person.name}</span>
                  <span className="truncate text-muted-foreground">
                    {person.email}
                  </span>
                </div>
              </div>
              <Select defaultValue="edit">
                <SelectTrigger className="w-[110px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="view">Can view</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CardsCookieSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Manage your cookie settings here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {[
          {
            id: "necessary",
            title: "Strictly Necessary",
            description: "These cookies are essential for the site to work.",
            checked: true,
            disabled: true,
          },
          {
            id: "functional",
            title: "Functional Cookies",
            description: "These cookies allow the site to remember choices.",
            checked: false,
            disabled: false,
          },
          {
            id: "performance",
            title: "Performance Cookies",
            description: "These cookies help us improve the site.",
            checked: false,
            disabled: false,
          },
        ].map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div className="grid gap-1">
              <Label htmlFor={item.id} className="font-medium">
                {item.title}
              </Label>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <Checkbox
              id={item.id}
              defaultChecked={item.checked}
              disabled={item.disabled}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  )
}

function CardsReportIssue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
        <CardDescription>
          What area are you having problems with?
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="area">Area</Label>
            <Select defaultValue="billing">
              <SelectTrigger id="area">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="account">Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="security">Security Level</Label>
            <Select defaultValue="severity">
              <SelectTrigger id="security">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="severity">Severity 1</SelectItem>
                <SelectItem value="severity-2">Severity 2</SelectItem>
                <SelectItem value="severity-3">Severity 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="I need help with…" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Please include all information relevant to your issue."
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  )
}
