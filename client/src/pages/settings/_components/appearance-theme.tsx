import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-provider"
import { toast } from "sonner"

export function AppearanceTheme() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme)

  const handleThemeChange = (value: "light" | "dark") => {
    setSelectedTheme(value)
  }

  const handleUpdateTheme = () => {
    setTheme(selectedTheme)
    toast.success(`Theme changed to ${selectedTheme} mode`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Theme</h4>
        <p className="text-sm text-muted-foreground">
          Select the theme for the dashboard.
        </p>
        <RadioGroup
          value={selectedTheme}
          onValueChange={handleThemeChange}
          className="flex flex-col md:flex-row items-start md:items-center gap-5 max-w-md pt-2"
        >
          {/* Light Theme Preview */}
          <div>
            <Label className="flex flex-col cursor-pointer [&:has([data-state=checked])>div]:ring-2 [&:has([data-state=checked])>div]:ring-primary">
              <RadioGroupItem value="light" className="sr-only" />
              <div className="items-center rounded-lg border-2 border-border bg-white p-1 hover:border-primary transition-all duration-200">
                <div className="space-y-2 rounded-sm bg-gray-100 p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-gray-200" />
                    <div className="h-2 w-[100px] rounded-lg bg-gray-200" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-gray-300" />
                    <div className="h-2 w-[100px] rounded-lg bg-gray-200" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-gray-300" />
                    <div className="h-2 w-[100px] rounded-lg bg-gray-200" />
                  </div>
                </div>
              </div>
              <p className="block w-full p-2 text-center font-normal text-foreground">
                Light
              </p>
            </Label>
          </div>

          {/* Dark Theme Preview */}
          <div>
            <Label className="flex flex-col cursor-pointer [&:has([data-state=checked])>div]:ring-2 [&:has([data-state=checked])>div]:ring-primary">
              <RadioGroupItem value="dark" className="sr-only" />
              <div className="items-center rounded-lg border-2 border-border bg-slate-900 p-1 hover:border-primary transition-all duration-200">
                <div className="space-y-2 rounded-sm bg-slate-800 p-2">
                  <div className="space-y-2 rounded-md bg-slate-700 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-500" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-500" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-700 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-500" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-500" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-700 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-500" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-500" />
                  </div>
                </div>
              </div>
              <p className="block w-full p-2 text-center font-normal text-foreground">
                Dark
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button
        type="button"
        className="mt-4 text-white"
        onClick={handleUpdateTheme}
      >
        Update preferences
      </Button>
    </div>
  )
}